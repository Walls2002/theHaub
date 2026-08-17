<?php
/**
 * Copy this file to config.php ON THE SERVER (public_html/api/config.php) and
 * fill in the real values. config.php is gitignored and denied by .htaccess, so
 * it never lands in the repo and is never served over HTTP.
 *
 * Configured for Brevo SMTP. Brevo signs and sends the mail; info@dealworkx.com
 * stays on Google Workspace and simply receives it. Nothing about your Workspace
 * setup has to change, and it does not matter whether info@ is a real mailbox, a
 * group, or an alias — it is only ever a recipient here.
 *
 * Everything marked TODO must be replaced before the form will send.
 */

declare(strict_types=1);

return [
    // ------------------------------------------------------------------ server
    // Brevo's relay. If 587 times out, Hostinger is blocking outbound SMTP on
    // that port: try 465 with SMTP_SECURITY 'ssl', or 2525 with 'tls'.
    'SMTP_HOST'     => 'smtp-relay.brevo.com',
    'SMTP_PORT'     => 587,
    'SMTP_SECURITY' => 'tls', // 'tls' for 587 or 2525, 'ssl' for 465

    // ------------------------------------------------------------ credentials
    // Both come from Brevo → SMTP & API → SMTP tab.
    //
    // SMTP_USER is the "Login" shown there. It is NOT your Brevo account email;
    // it normally looks like 8a1b2c001@smtp-brevo.com.
    // SMTP_PASS is the SMTP key from the same page, NOT your Brevo password.
    'SMTP_USER'     => 'TODO@smtp-brevo.com',
    'SMTP_PASS'     => 'TODO-brevo-smtp-key',

    // --------------------------------------------------------------- envelope
    // Brevo rejects any sender it has not verified, so this address must appear
    // under Brevo → Senders, Domains & Dedicated IPs. Verify the single address,
    // or authenticate dealworkx.com with their DKIM records and then any address
    // on the domain works.
    //
    // Do not set this to a free-mail address (gmail.com, yahoo.com); DMARC will
    // fail and the message will be junked.
    'MAIL_FROM'      => 'forms@dealworkx.com',
    'MAIL_FROM_NAME' => 'DealWorkx website',

    // Where submissions are delivered. Safe to be a group or an alias.
    // Reply-To is set to the prospect, so replying from the inbox reaches them.
    'MAIL_TO'        => 'info@dealworkx.com',

    // --------------------------------------------------------------- behaviour
    // Submissions allowed per IP per hour before the endpoint starts refusing.
    'RATE_LIMIT'      => 6,

    // Only accept posts whose Origin matches one of these. Empty array disables
    // the check. Include both apex and www if both resolve, and add Hostinger's
    // temporary *.hostingersite.com domain while you are still testing on it —
    // a mismatch here returns 403 on every submission.
    'ALLOWED_ORIGINS' => [
        'https://dealworkx.com',
        'https://www.dealworkx.com',
    ],

    // Writes SMTP failures to api/contact-errors.log for debugging, with
    // credentials withheld. Turn off once the form is confirmed working.
    'LOG_ERRORS'      => true,
];
