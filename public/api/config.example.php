/**
 * Two ways to supply credentials. contact.php checks the environment first and
 * falls back to this file, so pick whichever your host supports.
 *
 * 1. ENVIRONMENT VARIABLES (nothing to create, nothing to keep secret in a file)
 *
 *      DEALWORKX_SMTP_HOST, DEALWORKX_SMTP_PORT, DEALWORKX_SMTP_SECURITY,
 *      DEALWORKX_SMTP_USER, DEALWORKX_SMTP_PASS,
 *      DEALWORKX_MAIL_FROM, DEALWORKX_MAIL_FROM_NAME, DEALWORKX_MAIL_TO
 *
 *    Works only if the host actually exposes its variables to PHP. On Hostinger
 *    shared hosting the hPanel Node.js variables reach the Node process and not
 *    PHP, so this usually needs option 2 instead. Test with api/diag.php.
 *
 * 2. THIS FILE. Copy it to config.php and fill in the values.
 *
 *    Create it on the SERVER, inside the repository checkout at
 *    public/api/config.php — not inside dist/. It is gitignored, so git pull
 *    leaves it alone on every deploy, and the build copies it into dist/api/
 *    each time. A copy placed directly in dist/ would be erased by the next
 *    build, because Vite empties that directory first.
 *
 * Never commit config.php. GitHub push protection blocks pushes containing an
 * SMTP key, and on a public repository it would be scraped within hours.
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
