# DealWorkx (dealworkx.com)

Marketing site for DealWorkx, built with React 18 + Vite + React Router.
Structure mirrors the reference site (Home / About / Work / Contact);
brand, copy, design language and imagery are entirely original.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

## Structure

```
src/
  main.jsx              entry + router
  App.jsx               routes, header/footer shell
  data/
    site.js             brand, nav, contact details
    content.js          all page copy in one place
    images.js           every image URL (Unsplash placeholders)
  components/           Header, Footer, PageHeader, CTABand, Stats, Reveal, Arrow
  pages/                Home, About, Work, Contact, NotFound
  styles/
    base.css            tokens, reset, typography, buttons, primitives
    components.css      header, footer, page header, CTA band, stat + logo rails
    pages.css           per-page blocks
```

## Design notes

Corporate B2B rather than the usual SaaS template:

- **Hero:** contained headline lockup over a full-bleed 21:9 banner, with a solid
  ink proof panel breaking the banner's bottom-left edge and a secondary photo
  lifting off the top-right. Overlays collapse to a stacked layout under 1000px.

- **No gradients, no glows, no glassmorphism.** Depth comes from 1px hairline rules,
  whitespace and type scale.
- **Palette:** paper `#faf8f5`, ink `#17171b`, single deep-pine accent `#174a3a`
  used sparingly (rules, numerals, one hover state). Form errors use a separate
  `--danger` token so the accent never has to mean "something is wrong".
- **Type:** Inter Tight 600 for headings (tight tracking, tabular numerals),
  Inter 400/450 for body. One family, two optical cuts, which reads corporate rather
  than editorial. Controlled by `--display`, `--display-weight`, `--display-track`
  and `--sans` in `base.css`.
- **Corners:** 2px on buttons, square everywhere else.
- **Motion:** one subtle fade-up on scroll (`Reveal`), slow image scale on hover,
  sliding link underlines. Everything respects `prefers-reduced-motion`.

All tokens live at the top of `src/styles/base.css`. Change the accent there and it
propagates site-wide.

## Before launch: placeholders to replace

| What | Where |
| --- | --- |
| Images (Unsplash temporary art) | `src/data/images.js` |
| Email, phone, address, Calendly URL | `src/data/site.js` |
| Client names, case-study metrics | `src/data/content.js` |
| Privacy / Terms links | `src/components/Footer.jsx` |
| Brevo sender address for the contact form | `MAIL_FROM` in `public/api/config.php` (see below) |

## Deploy (Hostinger)

```bash
npm run build
```

Upload **the contents of `dist/`** — not the folder itself — into `public_html`.
`dist/` contains `.htaccess` and `api/`, both required.

Easiest reliable method: zip everything inside `dist/`, upload the zip via
hPanel → Files → File Manager, then right-click → Extract. Zipping matters
because File Manager and some FTP clients silently skip dotfiles, and
**`.htaccess`** is not optional — React Router owns `/about`, `/work` and
`/contact`, so without its rewrite those URLs return a Hostinger 404 on direct
load or refresh.

Hostinger must be running PHP 8.0+ (hPanel → Advanced → PHP Configuration).

### Contact form → info@dealworkx.com

`submitMessage` in `src/pages/Contact.jsx` posts JSON to `/api/contact.php`,
which re-validates the submission server-side and relays it through Brevo's SMTP
relay to `info@dealworkx.com`. `Reply-To` is set to the prospect, so replying
from the shared inbox reaches them rather than the sending robot.

Three files in `api/` do the work:

- `contact.php` — validation, honeypot, per-IP rate limit, message composition.
- `smtp.php` — a small self-contained SMTP client. Hostinger's shared plans have
  no Composer, so this speaks just enough of RFC 5321 to submit one message over
  an authenticated, encrypted connection rather than vendoring PHPMailer.
- `config.php` — live credentials. Gitignored, blocked by `.htaccess`, and built
  into `dist/api/` so there is nothing to create on the server.

`info@dealworkx.com` is only ever a *recipient*, which is deliberate: it needs no
verification and no mailbox access, and it can be a Google group or alias.

Two values in `config.php` may need attention:

1. **`MAIL_FROM` must be a verified sender in Brevo** (Senders, Domains &
   Dedicated IPs). Brevo rejects unverified senders outright. A Brevo signup
   address is verified automatically, which is what the default uses. Once you
   can add DNS records for `dealworkx.com`, authenticate the domain in Brevo and
   change this to `forms@dealworkx.com` — a company-domain sender is filtered far
   less often than a `gmail.com` one, and reads correctly in the client's inbox.
2. **`SMTP_PORT`** is 587. If submissions time out, Hostinger is blocking
   outbound SMTP on that port; Brevo also listens on 465 (with `SMTP_SECURITY`
   set to `'ssl'`) and 2525 (keep `'tls'`).

Verify before launch, because a silently-swallowed lead looks identical to a
delivered one:

```bash
curl -i https://dealworkx.com/api/contact.php \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Person","email":"you@example.com","company":"Test Co",
       "interest":"Appointment setting","message":"Checking the endpoint works."}'
```

`{"ok":true}` means Brevo accepted it. Cross-check under Brevo → *Transactional →
Logs*, which shows whether it was then delivered, deferred or bounced — useful
precisely because you may not be able to read the destination inbox. Anything
else: read `api/contact-errors.log`, which holds the SMTP transcript with
credentials withheld.

Then submit through the real form and confirm the success screen. A delivery
failure now shows the form's failure state with the mailto fallback, so the
screen and reality can no longer disagree.

Once confirmed, set `LOG_ERRORS` to `false`.

`ALLOWED_ORIGINS` ships empty, which disables origin checking. An `Origin` header
is trivial to forge outside a browser so it was never real protection, while
getting it wrong (temporary `*.hostingersite.com` domain, www vs apex) returns
403 on every submission. The honeypot and rate limit still apply. To enable it,
list the exact origins served.

Local `npm run dev` does not run PHP, so submits are short-circuited and logged
to the browser console. Set `VITE_CONTACT_ENDPOINT` to test against the deployed
endpoint.

### DNS warning

If you point `dealworkx.com` at Hostinger by changing **nameservers**, Hostinger's
DNS zone will not contain the Google Workspace MX records and all mail to
`info@` stops arriving — the form's included. Add the MX records in hPanel → DNS
Zone Editor first, along with any SPF/DKIM/DMARC records. Pointing only the A
record at Hostinger avoids this entirely.

### Other hosts

On Netlify/Vercel/S3 the `.htaccess` is ignored — add an SPA rewrite (all paths
→ `/index.html`) and port `api/contact.php` to a serverless function.
