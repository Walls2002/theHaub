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
| Founder name + photo | `src/pages/Contact.jsx`, `images.founder` |
| Client names, case-study metrics | `src/data/content.js` |
| Contact form submission | `submitMessage` in `src/pages/Contact.jsx` — a no-op stub.
  Point it at your form endpoint or CRM; anything it throws surfaces as the form's
  failure state, with the mailto address as the fallback |
| Privacy / Terms links | `src/components/Footer.jsx` |

## Deploy

Static build. On Netlify/Vercel/S3, add an SPA rewrite so client-side routes resolve:
all paths → `/index.html`.
