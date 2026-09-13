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

const SETTINGS = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_SECURITY',
    'SMTP_USER',
    'SMTP_PASS',
    'MAIL_FROM',
    'MAIL_FROM_NAME',
    'MAIL_TO',
];

/**
 * Read one setting from the environment, checking the three places a host might
 * expose it. Names are prefixed DEALWORKX_ so they cannot collide with anything
 * else on a shared server: DEALWORKX_SMTP_PASS, DEALWORKX_MAIL_TO, and so on.
 *
 * Returns null when unset, which is distinct from an empty value.
 */
function envValue(string $key): ?string
{
    $name = 'DEALWORKX_' . $key;

    foreach ([$_ENV, $_SERVER] as $bag) {
        if (isset($bag[$name]) && is_scalar($bag[$name]) && (string) $bag[$name] !== '') {
            return (string) $bag[$name];
        }
    }

    $value = getenv($name);

    return ($value === false || $value === '') ? null : $value;
}

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

// ----------------------------------------------------------------- email body

const MIME_RELATED     = 'dwx-rel-4f81c2a7';
const MIME_ALTERNATIVE = 'dwx-alt-9b3e60d4';

/**
 * The HTML half of the notification.
 *
 * Tables and inline styles throughout, because Gmail strips <style> blocks and
 * no mail client can be trusted with flexbox. Every value that came from the
 * form is escaped: the message field is free text from a stranger.
 *
 * The logo rides on a dark band. Its wordmark is brushed silver and disappears
 * on white, which is the same reason the site header is dark.
 */
function renderHtmlEmail(
    string $name,
    string $email,
    string $company,
    string $interest,
    string $message,
    string $submitted,
    string $ip
): string {
    $e = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    $labelStyle = 'padding:0 16px 16px 0;width:96px;vertical-align:top;'
        . 'font:400 11px/1.6 Arial,Helvetica,sans-serif;letter-spacing:0.09em;'
        . 'text-transform:uppercase;color:#78837f;';
    $valueStyle = 'padding:0 0 16px;vertical-align:top;'
        . 'font:400 15px/1.55 Arial,Helvetica,sans-serif;color:#14181a;';

    $rows = [
        ['Name', $e($name)],
        ['Email', '<a href="mailto:' . $e($email) . '" style="color:#0f5a48;text-decoration:none;border-bottom:1px solid #b9cdc4;">' . $e($email) . '</a>'],
        ['Company', $company !== '' ? $e($company) : '<span style="color:#9aa5a1;">Not given</span>'],
        ['Needs', $e($interest)],
    ];

    $rowsHtml = '';
    foreach ($rows as $row) {
        $rowsHtml .= '<tr><td style="' . $labelStyle . '">' . $row[0] . '</td>'
            . '<td style="' . $valueStyle . '">' . $row[1] . '</td></tr>';
    }

    $messageHtml = nl2br($e($message), false);
    $replyTo     = $e($email);
    $safeName    = $e($name);
    $safeIp      = $e($ip);
    $safeStamp   = $e($submitted);

    return <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background:#eef2f0;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">New enquiry from {$safeName} via the DealWorkx contact form.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef2f0;">
<tr><td align="center" style="padding:28px 12px;">

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #dde4e1;border-radius:6px;">

  <tr><td style="background:#14181a;padding:22px 28px;border-radius:6px 6px 0 0;">
    <img src="cid:dealworkx-logo" alt="DealWorkx" width="124" style="display:block;border:0;outline:none;width:124px;height:auto;">
  </td></tr>

  <tr><td style="padding:30px 28px 4px;">
    <div style="font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:#0f5a48;">New enquiry</div>
    <div style="padding-top:10px;font:700 21px/1.3 Arial,Helvetica,sans-serif;color:#14181a;">{$safeName} got in touch</div>
  </td></tr>

  <tr><td style="padding:22px 28px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{$rowsHtml}</table>
  </td></tr>

  <tr><td style="padding:6px 28px 0;">
    <div style="font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:0.09em;text-transform:uppercase;color:#78837f;padding-bottom:10px;">The problem, in their words</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f8f7;border-left:3px solid #2f9e6a;">
      <tr><td style="padding:16px 18px;font:400 15px/1.65 Arial,Helvetica,sans-serif;color:#2c3936;">{$messageHtml}</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 28px 4px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background:#14181a;border-radius:3px;">
        <a href="mailto:{$replyTo}" style="display:inline-block;padding:13px 24px;font:700 14px/1 Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;">Reply to {$safeName}</a>
      </td></tr>
    </table>
    <div style="padding-top:12px;font:400 13px/1.5 Arial,Helvetica,sans-serif;color:#78837f;">Replying to this email reaches them directly.</div>
  </td></tr>

  <tr><td style="padding:22px 28px 26px;">
    <div style="border-top:1px solid #e6ebe9;padding-top:16px;font:400 12px/1.7 Arial,Helvetica,sans-serif;color:#9aa5a1;">
      Submitted {$safeStamp}<br>
      From IP {$safeIp}<br>
      Sent automatically by the dealworkx.com contact form.
    </div>
  </td></tr>

</table>

</td></tr>
</table>
</body>
</html>
HTML;
}

/**
 * Wrap the two bodies and the logo into one MIME tree:
 *
 *   multipart/related
 *     multipart/alternative
 *       text/plain      <- what notification previews show
 *       text/html       <- what the inbox shows
 *     image/png         <- referenced as cid:dealworkx-logo
 *
 * The logo is embedded rather than linked so it renders without the recipient
 * having to allow remote images. When it is missing the tree collapses to the
 * alternative pair and the header band simply comes through empty.
 */
function buildMimeBody(string $text, string $html, ?string $logo): string
{
    $crlf = "\r\n";
    $b64  = static fn (string $raw): string => chunk_split(base64_encode($raw), 76, "\r\n");

    $alt = '--' . MIME_ALTERNATIVE . $crlf
        . 'Content-Type: text/plain; charset=UTF-8' . $crlf
        . 'Content-Transfer-Encoding: base64' . $crlf . $crlf
        . $b64($text)
        . '--' . MIME_ALTERNATIVE . $crlf
        . 'Content-Type: text/html; charset=UTF-8' . $crlf
        . 'Content-Transfer-Encoding: base64' . $crlf . $crlf
        . $b64($html)
        . '--' . MIME_ALTERNATIVE . '--' . $crlf;

    $body = 'This is a multi-part message in MIME format.' . $crlf . $crlf
        . '--' . MIME_RELATED . $crlf
        . 'Content-Type: multipart/alternative; boundary="' . MIME_ALTERNATIVE . '"' . $crlf . $crlf
        . $alt . $crlf;

    if ($logo !== null && $logo !== '') {
        $body .= '--' . MIME_RELATED . $crlf
            . 'Content-Type: image/png; name="dealworkx-logo.png"' . $crlf
            . 'Content-Transfer-Encoding: base64' . $crlf
            . 'Content-ID: <dealworkx-logo>' . $crlf
            . 'Content-Disposition: inline; filename="dealworkx-logo.png"' . $crlf . $crlf
            . $b64($logo) . $crlf;
    }

    return $body . '--' . MIME_RELATED . '--' . $crlf;
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

// Credentials come from the environment first and config.php only as a fallback,
// so the secret never has to live in this repository. Either source alone is
// enough; when both are present the environment wins.
$config = [];

$configPath = __DIR__ . '/config.php';
if (is_file($configPath)) {
    $fromFile = require $configPath;
    if (!is_array($fromFile)) {
        respond(500, ['ok' => false, 'error' => 'api/config.php did not return a configuration array.']);
    }
    $config = $fromFile;
}

foreach (SETTINGS as $key) {
    $value = envValue($key);
    if ($value !== null) {
        $config[$key] = $key === 'SMTP_PORT' ? (int) $value : $value;
    }
}

if ($config === []) {
    // Deliberately loud: an unconfigured endpoint must never look like a
    // delivered lead.
    respond(500, ['ok' => false, 'error' => 'Mail is not configured on this server: set DEALWORKX_SMTP_* or create api/config.php.']);
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

$submitted = gmdate('D, d M Y H:i:s') . ' UTC';

// The plain-text half still matters: it is what lock-screen previews, watches
// and text-only clients show, so it stays a complete account on its own.
$textBody = implode("\n", [
    'New enquiry from the DealWorkx contact form.',
    '',
    'Name:     ' . $name,
    'Email:    ' . $email,
    'Company:  ' . ($company !== '' ? $company : '(not given)'),
    'Needs:    ' . $interest,
    '',
    'The problem, in their words',
    str_repeat('-', 42),
    $message,
    '',
    str_repeat('-', 42),
    'Submitted: ' . $submitted,
    'IP:        ' . $ip,
    'Reply directly to this email to reach them.',
]);

$htmlBody = renderHtmlEmail($name, $email, $company, $interest, $message, $submitted, $ip);

// The logo sits at the web root, one level up from api/. A missing file is not
// worth failing a lead over, so the email goes out without it.
$logoPath = __DIR__ . '/../brand/logo.png';
$logoData = is_readable($logoPath) ? @file_get_contents($logoPath) : false;

$body = buildMimeBody($textBody, $htmlBody, $logoData === false ? null : $logoData);

$headers = [
    'Date'                      => gmdate('D, j M Y H:i:s') . ' +0000',
    'From'                      => encodeHeader((string) ($config['MAIL_FROM_NAME'] ?? 'Website')) . ' <' . headerSafe($from) . '>',
    'To'                        => headerSafe($to),
    // Puts the prospect one click away: hitting reply in the shared inbox
    // addresses them, not the sending robot.
    'Reply-To'                  => encodeHeader($name) . ' <' . headerSafe($email) . '>',
    'Subject'                   => encodeHeader($interest . ' / ' . $name . ($company !== '' ? ' (' . $company . ')' : '')),
    'Message-ID'                => '<' . bin2hex(random_bytes(12)) . '@' . (explode('@', $from)[1] ?? 'dealworkx.com') . '>',
    'MIME-Version'              => '1.0',
    'Content-Type'              => 'multipart/related; type="multipart/alternative"; boundary="' . MIME_RELATED . '"',
    'Content-Transfer-Encoding' => '7bit',
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
        $body
    );
} catch (Throwable $e) {
    logError($config, $e->getMessage() . "\nSMTP transcript:\n" . $smtp->trace());

    // The visitor gets the mailto fallback, not our plumbing details.
    respond(502, ['ok' => false, 'error' => 'The message could not be delivered.']);
}

respond(200, ['ok' => true]);
