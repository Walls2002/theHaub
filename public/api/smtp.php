<?php
/**
 * Minimal authenticated SMTP client.
 *
 * Hostinger's shared plans give you PHP but no Composer, so rather than asking
 * you to vendor PHPMailer by hand this speaks just enough of RFC 5321 to submit
 * one message over an authenticated, encrypted connection. It is deliberately
 * small: connect, STARTTLS, AUTH LOGIN, one recipient, QUIT.
 *
 * Every server reply is checked. Anything unexpected throws, and the caller
 * turns that into the form's failure state.
 */

declare(strict_types=1);

final class SmtpError extends RuntimeException {}

final class Smtp
{
    /** @var resource|null */
    private $socket = null;

    private string $host;
    private int $port;
    private string $security; // 'tls' (STARTTLS, 587) | 'ssl' (implicit, 465)
    private int $timeout;

    /** Transcript of the exchange, minus credentials. Surfaced only in the log. */
    private array $trace = [];

    public function __construct(string $host, int $port, string $security = 'tls', int $timeout = 20)
    {
        $this->host     = $host;
        $this->port     = $port;
        $this->security = $security;
        $this->timeout  = $timeout;
    }

    public function trace(): string
    {
        return implode("\n", $this->trace);
    }

    /**
     * Submit one message. $headers is an ordered map; $body must already be
     * encoded to match the Content-Transfer-Encoding header.
     */
    public function send(
        string $username,
        string $password,
        string $envelopeFrom,
        string $envelopeTo,
        array $headers,
        string $body
    ): void {
        try {
            $this->connect();
            $this->handshake($username, $password);

            $this->command('MAIL FROM:<' . $envelopeFrom . '>', [250]);
            $this->command('RCPT TO:<' . $envelopeTo . '>', [250, 251]);
            $this->command('DATA', [354]);

            $this->write($this->serialize($headers, $body));
            $this->expect([250]); // queued

            $this->command('QUIT', [221]);
        } finally {
            $this->close();
        }
    }

    // ------------------------------------------------------------- connection

    private function connect(): void
    {
        // Implicit TLS on 465 means the socket is encrypted before the greeting.
        $scheme   = $this->security === 'ssl' ? 'ssl://' : 'tcp://';
        $context  = stream_context_create([
            'ssl' => [
                'verify_peer'       => true,
                'verify_peer_name'  => true,
                'allow_self_signed' => false,
                'SNI_enabled'       => true,
                'peer_name'         => $this->host,
            ],
        ]);

        $errno  = 0;
        $errstr = '';
        $socket = @stream_socket_client(
            $scheme . $this->host . ':' . $this->port,
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$socket) {
            // The common cause on shared hosting is a blocked outbound port,
            // not a wrong password. Say so, because the fix is different.
            throw new SmtpError(sprintf(
                'Could not open a connection to %s:%d (%s). If this is a timeout, the host is '
                    . 'likely blocking outbound SMTP; try the alternate port or ask support to open it.',
                $this->host,
                $this->port,
                $errstr !== '' ? $errstr : 'error ' . $errno
            ));
        }

        stream_set_timeout($socket, $this->timeout);
        $this->socket = $socket;

        $this->expect([220]); // server greeting
    }

    private function handshake(string $username, string $password): void
    {
        $ehloName = $this->ehloName();

        $this->command('EHLO ' . $ehloName, [250]);

        if ($this->security === 'tls') {
            $this->command('STARTTLS', [220]);

            $crypto = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                $crypto = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            }
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $crypto |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }

            if (@stream_socket_enable_crypto($this->socket, true, $crypto) !== true) {
                throw new SmtpError('STARTTLS negotiation failed; refusing to send in the clear.');
            }

            // RFC 3207: the EHLO must be repeated once the channel is encrypted.
            $this->command('EHLO ' . $ehloName, [250]);
        }

        // AUTH LOGIN rather than PLAIN: both are equally supported by Google and
        // this one is easier to trace when a password is wrong.
        $this->command('AUTH LOGIN', [334]);
        // Both of these are base64, which is encoding not encryption, so they are
        // written with logging suppressed — otherwise the App Password lands in
        // contact-errors.log in trivially reversible form.
        $this->write(base64_encode($username) . "\r\n", true);
        $this->expect([334], '<username>');
        $this->write(base64_encode($password) . "\r\n", true);

        try {
            $this->expect([235], '<password>');
        } catch (SmtpError $e) {
            throw new SmtpError(
                'The mail server rejected the credentials. For Google Workspace this almost always '
                    . 'means SMTP_PASS is not a 16-character App Password, or 2-Step Verification is off '
                    . 'for that account. Original reply: ' . $e->getMessage()
            );
        }
    }

    /** A syntactically valid EHLO argument; Google does not check it, but bare hostnames are rejected. */
    private function ehloName(): string
    {
        $host = $_SERVER['SERVER_NAME'] ?? $_SERVER['HTTP_HOST'] ?? 'localhost';
        $host = preg_replace('/[^A-Za-z0-9.\-]/', '', (string) $host) ?? '';
        $host = trim($host, '.');

        return ($host === '' || strpos($host, '.') === false) ? '[127.0.0.1]' : $host;
    }

    private function close(): void
    {
        if (is_resource($this->socket)) {
            @fclose($this->socket);
        }
        $this->socket = null;
    }

    // ------------------------------------------------------------ wire access

    private function command(string $line, array $expected): string
    {
        $this->write($line . "\r\n");

        return $this->expect($expected, $line);
    }

    private function write(string $data, bool $sensitive = false): void
    {
        if (!is_resource($this->socket)) {
            throw new SmtpError('Connection closed before the message was sent.');
        }

        if ($sensitive) {
            $this->trace[] = '> [credential withheld]';
        } elseif (strlen($data) < 512) {
            // Only the first line, so the trace stays a protocol log rather than
            // a copy of the visitor's message.
            $this->trace[] = '> ' . rtrim(explode("\r\n", $data)[0], "\r\n");
        } else {
            $this->trace[] = '> [message payload, ' . strlen($data) . ' bytes]';
        }

        $written = 0;
        $length  = strlen($data);
        while ($written < $length) {
            $chunk = @fwrite($this->socket, substr($data, $written));
            if ($chunk === false || $chunk === 0) {
                throw new SmtpError('Write to the mail server failed mid-message.');
            }
            $written += $chunk;
        }
    }

    /** Read one reply, following multiline continuations, and assert its code. */
    private function expect(array $codes, string $context = ''): string
    {
        $reply = '';
        $code  = null;

        while (true) {
            $line = @fgets($this->socket, 1024);

            if ($line === false || $line === '') {
                $meta = is_resource($this->socket) ? stream_get_meta_data($this->socket) : ['timed_out' => false];
                throw new SmtpError(!empty($meta['timed_out'])
                    ? 'The mail server stopped responding' . ($context !== '' ? ' after ' . $context : '') . '.'
                    : 'The mail server closed the connection' . ($context !== '' ? ' after ' . $context : '') . '.');
            }

            $reply .= $line;
            $this->trace[] = '< ' . rtrim($line, "\r\n");

            // "250-line" continues the reply; "250 line" ends it.
            if (preg_match('/^(\d{3})([ -])/', $line, $m) === 1) {
                $code = (int) $m[1];
                if ($m[2] === ' ') {
                    break;
                }
            }
        }

        if ($code === null || !in_array($code, $codes, true)) {
            throw new SmtpError(sprintf(
                'Unexpected reply%s: %s',
                $context !== '' ? ' to ' . $context : '',
                trim($reply)
            ));
        }

        return $reply;
    }

    // --------------------------------------------------------------- envelope

    /**
     * Join headers and body into a DATA payload. Lines beginning with a period
     * are escaped so a "." in the message cannot terminate it early (RFC 5321
     * transparency).
     */
    private function serialize(array $headers, string $body): string
    {
        $out = '';
        foreach ($headers as $name => $value) {
            $out .= $name . ': ' . $value . "\r\n";
        }
        $out .= "\r\n";

        $normalized = preg_replace("/\r\n|\r|\n/", "\r\n", $body) ?? '';
        foreach (explode("\r\n", $normalized) as $line) {
            $out .= (isset($line[0]) && $line[0] === '.' ? '.' . $line : $line) . "\r\n";
        }

        return $out . ".\r\n";
    }
}
