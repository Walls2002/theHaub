import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import Reveal from './Reveal'
import { site } from '../data/site'

export default function CTABand({
  eyebrow = 'Next step',
  title = 'Tell us what your pipeline is missing.',
  body = 'A thirty-minute call, no deck. We will tell you whether an embedded team is the right answer — including when it is not.',
  primary = { label: 'Book an intro call', to: '/contact' }
}) {
  return (
    <section className="cta">
      <div className="shell">
        <div className="cta__grid">
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="display display--lg" style={{ marginTop: 20 }}>
              {title}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="body">{body}</p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link className="btn" to={primary.to}>
                {primary.label} <Arrow />
              </Link>
              <a className="btn btn--ghost" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
