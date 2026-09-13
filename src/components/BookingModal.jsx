import { useEffect, useRef } from 'react'
import { site } from '../data/site'

/**
 * The Google Calendar appointment schedule, in a dialog.
 *
 * Inline, the booking page has to be given a fixed height, and whatever height
 * you pick is wrong for somebody: Google's own content is taller than it looks
 * and you end up with a scrollbar inside a scrollbar. A dialog can take most of
 * the viewport, which is enough for the whole booking page at once.
 *
 * Built on the native <dialog>, so focus trapping, the backdrop and Escape all
 * come from the browser rather than from us getting them subtly wrong.
 */

/** Google's booking page only renders inside a frame when gv=true is present. */
function embedUrl(raw) {
  try {
    const url = new URL(raw)
    url.searchParams.set('gv', 'true')
    return url.toString()
  } catch {
    return raw
  }
}

export function hasBooking() {
  return Boolean(site.booking?.url)
}

export default function BookingModal({ open, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  // Escape and the backdrop close the dialog without going through React, so
  // listen for the browser's own close event to keep the two in step.
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const sync = () => onClose()
    el.addEventListener('close', sync)
    return () => el.removeEventListener('close', sync)
  }, [onClose])

  // showModal makes the page inert but does not stop it scrolling behind.
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!hasBooking()) return null

  const { url, label } = site.booking

  return (
    <dialog
      ref={ref}
      className="bmodal"
      aria-label={label}
      // A click landing on the dialog itself is a click on the backdrop; the
      // panel inside swallows its own.
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="bmodal__panel">
        <div className="bmodal__bar">
          <span className="bmodal__title">{label}</span>
          <button type="button" className="bmodal__close" onClick={onClose} aria-label="Close">
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M1 1l11 11M12 1L1 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* Mounted only while open, so Google's app is not downloaded by every
            visitor who never books. */}
        {open && <iframe className="bmodal__frame" src={embedUrl(url)} title={label} />}

        <p className="bmodal__fallback">
          Not loading?{' '}
          <a href={url} target="_blank" rel="noreferrer">
            Open the booking page
          </a>
        </p>
      </div>
    </dialog>
  )
}
