import { useEffect, useRef, useState } from 'react'

/**
 * A listbox that can actually be styled.
 *
 * A native <select> renders its popup through the operating system, so the
 * options ignore every rule in our stylesheet: on Windows they come out as a
 * blue-highlighted system menu that belongs to no design at all. This is the
 * usual replacement -- a button plus a real listbox -- kept small and wired for
 * the keyboard, because a custom control that only works with a mouse is worse
 * than the ugly one it replaced.
 *
 * onChange is handed a synthetic {target:{value}} so it drops straight into the
 * same update(key) handler the inputs use.
 */
export default function Select({ id, name, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)))
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const buttonRef = useRef(null)
  const typed = useRef({ term: '', at: 0 })
  const listId = `${id}-listbox`

  // Reopening should land on the current choice, not wherever we left off.
  useEffect(() => {
    if (open) setActive(Math.max(0, options.indexOf(value)))
  }, [open, options, value])

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  // Keep the highlighted row visible when the list is longer than its box.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const commit = (index) => {
    const next = options[index]
    if (next !== undefined && next !== value) onChange({ target: { value: next } })
    setOpen(false)
    buttonRef.current?.focus()
  }

  const step = (delta) =>
    setActive((i) => Math.min(options.length - 1, Math.max(0, i + delta)))

  const onKeyDown = (e) => {
    // Jump to the next option starting with the typed letters.
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now()
      typed.current.term = (now - typed.current.at < 700 ? typed.current.term : '') + e.key
      typed.current.at = now
      const term = typed.current.term.toLowerCase()
      const found = options.findIndex((o) => o.toLowerCase().startsWith(term))
      if (found !== -1) {
        e.preventDefault()
        if (open) setActive(found)
        else commit(found)
        return
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        open ? step(1) : setOpen(true)
        break
      case 'ArrowUp':
        e.preventDefault()
        open ? step(-1) : setOpen(true)
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setActive(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setActive(options.length - 1)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        open ? commit(active) : setOpen(true)
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          setOpen(false)
        }
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div className={`select ${open ? 'is-open' : ''}`} ref={rootRef}>
      {/* Keeps the value in a normal form submission, and in autofill. */}
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={id}
        ref={buttonRef}
        className="select__button"
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span>{value}</span>
        <svg className="select__chevron" width="11" height="7" viewBox="0 0 11 7" aria-hidden="true">
          <path d="M1 1l4.5 4.5L10 1" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {open && (
        <ul
          className="select__list"
          id={listId}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${id}-opt-${active}`}
        >
          {options.map((option, i) => (
            <li
              key={option}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={option === value}
              className={`select__option ${i === active ? 'is-active' : ''} ${
                option === value ? 'is-selected' : ''
              }`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(i)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
