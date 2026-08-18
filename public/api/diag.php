<?php
/**
 * TEMPORARY DIAGNOSTIC — delete once the form works.
 *
 * Reports what the server can actually do, so a 500 can be told apart from a
 * blocked port or a stale config. Prints no secrets: the SMTP password is
 * reported only as a length.
 *
 * Open https://dealworkx.com/api/diag.php in a browser.
 *
 * Written with no type declarations, no arrow functions and no typed properties,
 * so it parses on every PHP version back to 5.6. If THIS page renders but
 * contact.php returns 500, the PHP version is too old for contact.php and the
 * fix is to raise it in hPanel.
 */

header('Content-Type: text/plain; charset=utf-8');

echo "=== PHP ===\n";
echo 'version:            ' . PHP_VERSION . "\n";
echo 'version id:         ' . PHP_VERSION_ID . "  (needs >= 70400)\n";
echo 'sapi:               ' . PHP_SAPI . "\n";

echo "\n=== extensions and functions ===\n";
$needed = array('stream_socket_client', 'stream_socket_enable_crypto', 'fsockopen', 'mb_substr', 'random_bytes');
foreach ($needed as $fn) {
    echo str_pad($fn . ':', 34) . (function_exists($fn) ? 'yes' : 'MISSING') . "\n";
}
echo str_pad('openssl loaded:', 34) . (extension_loaded('openssl') ? 'yes' : 'MISSING') . "\n";
echo str_pad('mbstring loaded:', 34) . (extension_loaded('mbstring') ? 'yes' : 'missing (polyfilled)') . "\n";

$disabled = ini_get('disable_functions');
echo str_pad('disable_functions:', 34) . ($disabled ? $disabled : '(none)') . "\n";

echo "\n=== files ===\n";
foreach (array('config.php', 'contact.php', 'smtp.php') as $file) {
    $path = __DIR__ . '/' . $file;
    echo str_pad($file . ':', 34);
    if (!file_exists($path)) {
        echo "NOT FOUND\n";
    } else {
        echo 'present, ' . filesize($path) . " bytes\n";
    }
}

echo "\n=== config.php contents (password masked) ===\n";
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    echo "config.php is MISSING — this alone causes a 500 from contact.php.\n";
} else {
    $config = @include $configPath;
    if (!is_array($config)) {
        echo "config.php did not return an array (a syntax error inside it would do this).\n";
    } else {
        foreach (array('SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURITY', 'SMTP_USER', 'MAIL_FROM', 'MAIL_TO') as $key) {
            echo str_pad($key . ':', 34) . (isset($config[$key]) ? (is_array($config[$key]) ? '[array]' : $config[$key]) : 'NOT SET') . "\n";
        }
        echo str_pad('SMTP_PASS:', 34)
            . (isset($config['SMTP_PASS']) ? 'set, ' . strlen($config['SMTP_PASS']) . ' chars' : 'NOT SET') . "\n";
    }
}

echo "\n=== environment variables visible to PHP ===\n";
echo "If these show values, credentials can live in the host panel instead of a file.\n\n";
$envKeys = array('DEALWORKX_SMTP_HOST', 'DEALWORKX_SMTP_USER', 'DEALWORKX_SMTP_PASS', 'DEALWORKX_MAIL_FROM', 'DEALWORKX_MAIL_TO');
foreach ($envKeys as $key) {
    $value = getenv($key);
    if ($value === false && isset($_SERVER[$key])) { $value = $_SERVER[$key]; }
    if ($value === false && isset($_ENV[$key]))    { $value = $_ENV[$key]; }

    echo str_pad($key . ':', 34);
    if ($value === false || $value === '') {
        echo "not set\n";
    } elseif (strpos($key, 'PASS') !== false) {
        echo 'set, ' . strlen($value) . " chars\n";
    } else {
        echo $value . "\n";
    }
}

echo "\n=== outbound SMTP reachability ===\n";
echo "This is the answer to whether Hostinger blocks outbound mail ports.\n\n";

$targets = array(
    array('tcp://smtp-relay.brevo.com:587', '587 STARTTLS'),
    array('ssl://smtp-relay.brevo.com:465', '465 implicit TLS'),
    array('tcp://smtp-relay.brevo.com:2525', '2525 STARTTLS')
);

foreach ($targets as $target) {
    $errno = 0;
    $errstr = '';
    $started = microtime(true);
    $socket = @stream_socket_client($target[0], $errno, $errstr, 8);
    $took = round((microtime(true) - $started) * 1000);

    echo str_pad($target[1] . ':', 22);
    if ($socket) {
        stream_set_timeout($socket, 8);
        $greeting = @fgets($socket, 512);
        @fclose($socket);
        echo 'OPEN (' . $took . 'ms) greeting: ' . trim((string) $greeting) . "\n";
    } else {
        echo 'BLOCKED/FAILED (' . $took . 'ms) ' . ($errstr !== '' ? $errstr : 'errno ' . $errno) . "\n";
    }
}

echo "\n=== DNS ===\n";
$ip = @gethostbyname('smtp-relay.brevo.com');
echo 'smtp-relay.brevo.com resolves to: ' . ($ip !== 'smtp-relay.brevo.com' ? $ip : 'RESOLUTION FAILED') . "\n";

echo "\n=== error log ===\n";
$log = __DIR__ . '/contact-errors.log';
if (file_exists($log)) {
    echo "last 3000 bytes of contact-errors.log:\n\n";
    $size = filesize($log);
    $handle = @fopen($log, 'r');
    if ($handle) {
        if ($size > 3000) {
            fseek($handle, -3000, SEEK_END);
        }
        echo (string) fread($handle, 3000);
        fclose($handle);
    }
} else {
    echo "no contact-errors.log yet (it is only written when SMTP itself fails)\n";
}

echo "\n=== done ===\n";
