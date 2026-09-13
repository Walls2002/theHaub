import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, site } from '../data/site'
import { useBooking } from './BookingProvider'
import Arrow from './Arrow'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const { pathname } = useLocation()
  const { openBooking, bookingAvailable } = useBooking()

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
          <img src="/brand/logo.png" alt={site.name} width="391" height="296" />
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

        {/* Falls back to the contact page when no schedule is configured, so
            the bar never carries a button that does nothing. */}
        {bookingAvailable ? (
          <button type="button" className="btn header__cta" onClick={openBooking}>
            Book a demo <Arrow size={12} />
          </button>
        ) : (
          <Link to="/contact" className="btn header__cta">
            Book a demo <Arrow size={12} />
          </Link>
        )}

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
            {bookingAvailable ? (
              <button
                type="button"
                className="btn"
                style={{ justifyContent: 'center' }}
                onClick={() => {
                  // The drawer closes on navigation, and opening a dialog is not
                  // one, so dismiss it by hand or it sits behind the backdrop.
                  setOpen(false)
                  openBooking()
                }}
              >
                Book a demo <Arrow size={12} />
              </button>
            ) : (
              <Link to="/contact" className="btn" style={{ justifyContent: 'center' }}>
                Book a demo <Arrow size={12} />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
