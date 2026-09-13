import { useEffect, useRef } from 'react'

/**
 * The shell both modals sit in.
 *
 * Built on the native <dialog>, so focus trapping, the backdrop and Escape come
 * from the browser rather than from us reimplementing them subtly wrong. Height
 * lives on the dialog and the body flexes into what is left, which is what stops
 * a tall child from pushing its own footer off a short screen.
 */
export default function Dialog({ open, onClose, title, className = '', children }) {
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

  return (
    <dialog
      ref={ref}
      className={`bmodal ${className}`}
      aria-label={title}
      // A click landing on the dialog itself is a click on the backdrop; the
      // panel inside swallows its own.
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="bmodal__panel">
        <div className="bmodal__bar">
          <span className="bmodal__title">{title}</span>
          <button type="button" className="bmodal__close" onClick={onClose} aria-label="Close">
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M1 1l11 11M12 1L1 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
