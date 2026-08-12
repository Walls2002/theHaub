import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, site } from '../data/site'
import Arrow from './Arrow'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`header ${stuck ? 'is-stuck' : ''}`}>
      <div className="shell header__inner">
        <Link to="/" className="brand" aria-label={`${site.name} home`}>
          <span className="brand__mark" />
          <span>{site.name}</span>
          <span className="brand__sub">{site.tagline}</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="btn header__cta">
          Book an intro <Arrow size={12} />
        </Link>

        <button
          type="button"
          className={`burger ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="drawer" id="mobile-menu">
          <nav aria-label="Mobile">
            {nav.map((item, i) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="drawer__link">
                {item.label}
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              </NavLink>
            ))}
          </nav>
          <div className="drawer__foot">
            <a className="tlink" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
            <Link to="/contact" className="btn" style={{ justifyContent: 'center' }}>
              Book an intro <Arrow size={12} />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
