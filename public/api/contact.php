<?php
/**
 * Contact form endpoint. Receives JSON from src/pages/Contact.jsx, validates it
 * server-side, and submits one email over authenticated SMTP.
 *
 * Responds 200 {"ok":true} on success and a 4xx/5xx with {"ok":false,"error":…}
 * otherwise. The front end only distinguishes success from failure, but the
 * error text is useful when testing with curl.
 *
 * Client-side validation is a courtesy, not a control: everything is re-checked
 * here because anything can post to this URL.
 */

declare(strict_types=1);

require __DIR__ . '/smtp.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const MAX_FIELD_LENGTHS = [
    'name'     => 80,
    'email'    => 120,
    'company'  => 80,
    'interest' => 60,
    'message'  => 1200,
];

const INTERESTS = [
    'Appointment setting',
    'Lead research',
    'Outreach infrastructure',
    'CRM and handover',
    'Not sure yet',
];

/**
 * mbstring is usually present on Hostinger but is not guaranteed, and a fatal
 * "undefined function" here would look identical to a mail failure. Degrade to
 * byte semantics instead: slightly blunter truncation, never a 500.
 */
function clip(string $value, int $limit): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, $limit) : substr($value, 0, $limit);
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

/** Send a JSON response and stop. Return type is void, not never, so the file
 *  still parses on PHP 8.0 hosts. */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/** Strip anything that could break out of a header line into a new one. */
function headerSafe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
}

/** RFC 2047 encode a header value only when it is not plain ASCII. */
function encodeHeader(string $value): string
{
    $value = headerSafe($value);

    return preg_match('/^[\x20-\x7E]*$/', $value) === 1
        ? $value
        : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function clientIp(): string
{
    // Hostinger fronts sites with a proxy, so REMOTE_ADDR can be an internal
    // address. Prefer the forwarded chain's first hop when present.
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        if (empty($_SERVER[$key])) {
            continue;
        }
        $candidate = trim(explode(',', (string) $_SERVER[$key])[0]);
        if (filter_var($candidate, FILTER_VALIDATE_IP) !== false) {
            return $candidate;
        }
    }

    return 'unknown';
}

/**
 * Crude per-IP throttle backed by one JSON file in the system temp directory.
 * Good enough to stop a script hammering the mailbox; not a security boundary.
 * Fails open, because losing a real lead is worse than allowing an extra post.
 */
function withinRateLimit(int $limit, string $ip): bool
{
    if ($limit <= 0) {
        return true;
    }

    $path = sys_get_temp_dir() . '/dealworkx-contact-rate.json';
    $now  = time();
    $hour = 3600;

    $handle = @fopen($path, 'c+');
    if ($handle === false) {
        return true;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return true;
        }

        $size     = (int) (fstat($handle)['size'] ?? 0);
        $contents = $size > 0 ? (string) fread($handle, $size) : '';
        $buckets  = json_decode($contents, true);
        if (!is_array($buckets)) {
            $buckets = [];
        }

        // Drop expired entries so the file cannot grow without bound.
        $buckets = array_filter(
            $buckets,
            static fn ($stamps) => is_array($stamps) && !empty(array_filter($stamps, static fn ($t) => $now - (int) $t < $hour))
        );

        $key    = hash('sha256', $ip);
        $recent = array_values(array_filter(
            is_array($buckets[$key] ?? null) ? $buckets[$key] : [],
            static fn ($t) => $now - (int) $t < $hour
        ));

        if (count($recent) >= $limit) {
            return false;
        }

        $recent[]      = $now;
        $buckets[$key] = $recent;

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, (string) json_encode($buckets));
        fflush($handle);

        return true;
    } finally {
        @flock($handle, LOCK_UN);
        @fclose($handle);
    }
}

function logError(array $config, string $message): void
{
    if (empty($config['LOG_ERRORS'])) {
        return;
    }

    @file_put_contents(
        __DIR__ . '/contact-errors.log',
        '[' . gmdate('Y-m-d H:i:s') . "Z] " . $message . "\n\n",
        FILE_APPEND | LOCK_EX
    );
}

// ---------------------------------------------------------------------- guards

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Allow: POST');
    respond(204, []);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'This endpoint only accepts POST.']);
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    // Deliberately loud: a missing config must never look like a delivered lead.
    respond(500, ['ok' => false, 'error' => 'Mail is not configured on this server (api/config.php is missing).']);
}

$config = require $configPath;
if (!is_array($config)) {
    respond(500, ['ok' => false, 'error' => 'api/config.php did not return a configuration array.']);
}

$allowedOrigins = is_array($config['ALLOWED_ORIGINS'] ?? null) ? $config['ALLOWED_ORIGINS'] : [];
$origin         = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($allowedOrigins !== [] && $origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'error' => 'Origin not allowed.']);
}

// ------------------------------------------------------------------ read input

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '' || strlen($raw) > 20000) {
    respond(400, ['ok' => false, 'error' => 'Empty or oversized request body.']);
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    respond(400, ['ok' => false, 'error' => 'Expected a JSON object.']);
}

$field = static function (string $key) use ($input): string {
    $value = $input[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = str_replace("\0", '', $value);

    return trim(clip($value, MAX_FIELD_LENGTHS[$key] ?? 200));
};

// The honeypot: a real person cannot reach that input, so a value means a bot.
// Answer 200 so the script believes it succeeded and does not retry.
if (($input['website'] ?? '') !== '') {
    respond(200, ['ok' => true]);
}

$name     = $field('name');
$email    = $field('email');
$company  = $field('company');
$interest = $field('interest');
$message  = $field('message');

$errors = [];
if ($name === '') {
    $errors['name'] = 'Name is required.';
}
if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors['email'] = 'A valid email is required.';
}
if (textLength($message) < 12) {
    $errors['message'] = 'The message is too short.';
}
if ($errors !== []) {
    respond(422, ['ok' => false, 'error' => 'Validation failed.', 'fields' => $errors]);
}

// Fall back rather than reject: an unexpected value means the option list moved,
// which is our problem, not the prospect's.
if (!in_array($interest, INTERESTS, true)) {
    $interest = 'Not specified';
}

$ip = clientIp();
if (!withinRateLimit((int) ($config['RATE_LIMIT'] ?? 6), $ip)) {
    respond(429, ['ok' => false, 'error' => 'Too many submissions from this address. Try again later.']);
}

// -------------------------------------------------------------- compose + send

$smtpUser = (string) ($config['SMTP_USER'] ?? '');
$smtpPass = (string) ($config['SMTP_PASS'] ?? '');
$from     = (string) ($config['MAIL_FROM'] ?? $smtpUser);
$to       = (string) ($config['MAIL_TO'] ?? '');

if ($smtpUser === '' || $smtpPass === '' || $to === '') {
    respond(500, ['ok' => false, 'error' => 'Mail configuration is incomplete.']);
}

$body = implode("\n", [
    'New enquiry from the DealWorkx contact form.',
    '',
    'Name:     ' . $name,
    'Email:    ' . $email,
    'Company:  ' . ($company !== '' ? $company : '—'),
    'Needs:    ' . $interest,
    '',
    'The problem, in their words',
    str_repeat('-', 42),
    $message,
    '',
    str_repeat('-', 42),
    'Submitted: ' . gmdate('D, d M Y H:i:s') . ' UTC',
    'IP:        ' . $ip,
    'Reply directly to this email to reach them.',
]);

$headers = [
    'Date'                      => gmdate('D, j M Y H:i:s') . ' +0000',
    'From'                      => encodeHeader((string) ($config['MAIL_FROM_NAME'] ?? 'Website')) . ' <' . headerSafe($from) . '>',
    'To'                        => headerSafe($to),
    // Puts the prospect one click away: hitting reply in the shared inbox
    // addresses them, not the sending robot.
    'Reply-To'                  => encodeHeader($name) . ' <' . headerSafe($email) . '>',
    'Subject'                   => encodeHeader($interest . ' — ' . $name . ($company !== '' ? ' (' . $company . ')' : '')),
    'Message-ID'                => '<' . bin2hex(random_bytes(12)) . '@' . (explode('@', $from)[1] ?? 'dealworkx.com') . '>',
    'MIME-Version'              => '1.0',
    'Content-Type'              => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
    'Auto-Submitted'            => 'auto-generated',
    'X-Mailer'                  => 'DealWorkx site',
];

$smtp = new Smtp(
    (string) ($config['SMTP_HOST'] ?? 'smtp.gmail.com'),
    (int) ($config['SMTP_PORT'] ?? 587),
    (string) ($config['SMTP_SECURITY'] ?? 'tls')
);

try {
    $smtp->send(
        $smtpUser,
        $smtpPass,
        $from,
        $to,
        $headers,
        chunk_split(base64_encode($body), 76, "\r\n")
    );
} catch (Throwable $e) {
    logError($config, $e->getMessage() . "\nSMTP transcript:\n" . $smtp->trace());

    // The visitor gets the mailto fallback, not our plumbing details.
    respond(502, ['ok' => false, 'error' => 'The message could not be delivered.']);
}

respond(200, ['ok' => true]);
