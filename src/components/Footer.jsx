import { Link } from 'react-router-dom'
import { nav, site } from '../data/site'

const services = [
  'Appointment setting',
  'Lead research',
  'Outreach infrastructure',
  'CRM and handover'
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__col">
            <Link to="/" className="brand" style={{ color: 'var(--paper)' }}>
              <span className="brand__mark" />
              <span>{site.name}</span>
            </Link>
            <p className="body" style={{ marginTop: 18, maxWidth: '34ch' }}>
              Researched outbound and booked meetings for B2B companies that would rather spend
              their selling time selling.
            </p>
          </div>

          <div className="footer__col">
            <h4>Navigate</h4>
            <ul className="footer__list">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Practice</h4>
            <ul className="footer__list">
              {services.map((s) => (
                <li key={s}>
                  <Link to="/work">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__list">
              <li>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
              <li>
                <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
              </li>
              <li>
                <span>{site.contact.address.join(', ')}</span>
              </li>
              <li>
                <span>{site.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bar">
          <span>
            © {new Date().getFullYear()} {site.legal}. All rights reserved.
          </span>
          <nav className="footer__nav" aria-label="Footer">
            {site.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
