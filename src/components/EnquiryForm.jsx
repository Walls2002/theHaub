import { useEffect, useRef, useState } from 'react'
import Arrow from './Arrow'
import Select from './Select'
import { site } from '../data/site'

// Mirrors INTERESTS in public/api/contact.php. The endpoint rejects anything
// outside its own list, so the two have to move together.
const INTERESTS = [
  'Appointment setting',
  'Lead research',
  'Outreach infrastructure',
  'CRM and handover',
  'Not sure yet'
]

const EMPTY = {
  name: '',
  email: '',
  company: '',
  interest: '',
  message: '',
  website: '' // honeypot, never shown
}

const REQUIRED = ['name', 'email', 'company', 'interest', 'message']

function validateField(key, values) {
  const value = values[key].trim()
  if (key === 'name') return value ? '' : 'Please tell us your name.'
  if (key === 'email') {
    if (!value) return 'We need an email to reply to.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'That email address does not look right.'
    return ''
  }
  if (key === 'company') return value ? '' : 'Which company are you with?'
  if (key === 'interest') return value ? '' : 'Pick the one closest to what you need.'
  if (key === 'message' && value.length < 12)
    return 'A sentence or two about the problem helps us prepare.'
  return ''
}

function validate(values) {
  return REQUIRED.reduce((errors, key) => {
    const message = validateField(key, values)
    if (message) errors[key] = message
    return errors
  }, {})
}

// Posts to the PHP endpoint in public/api/, which validates the submission again
// server-side and relays it through Brevo's SMTP to info@dealworkx.com. Anything
// thrown here surfaces as the form's failure state, with the mailto address as
// the fallback, so a delivery problem is never shown to a visitor as a success.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || site.contactEndpoint

async function submitMessage(payload) {
  // Vite's dev server does not run PHP, so a local submit would always fail and
  // look like a broken form. Short-circuit it and log what would have been sent.
  if (import.meta.env.DEV && !import.meta.env.VITE_CONTACT_ENDPOINT) {
    console.info('[contact] dev mode, not sent:', payload)
    return
  }

  // Give up rather than leave the button spinning if the host never answers.
  const abort = new AbortController()
  const timer = setTimeout(() => abort.abort(), 20000)

  let response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: abort.signal
    })
  } finally {
    clearTimeout(timer)
  }

  // A 200 that is not our own {ok:true} means something else answered, such as
  // error page, a redirect to index.html. Treat it as a failure, not a send.
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || `Contact endpoint returned ${response.status}`)
  }
}

export default function EnquiryForm({ onSent }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | sent | failed
  const [sentName, setSentName] = useState('')

  const formRef = useRef(null)
  const sentRef = useRef(null)
  const nameRef = useRef(null)
  const moveFocus = useRef(null)

  // Focus follows the state change, so keyboard and screen reader users land on
  // the confirmation instead of being dropped back at the top of the document.
  useEffect(() => {
    if (moveFocus.current === 'sent') sentRef.current?.focus()
    if (moveFocus.current === 'form') nameRef.current?.focus()
    moveFocus.current = null
  })

  const update = (key) => (e) => {
    const { value } = e.target
    setValues((v) => ({ ...v, [key]: value }))
    // Clear an error the moment the field becomes valid, but never raise a new
    // one mid-keystroke: that is what blur and submit are for.
    setErrors((prev) =>
      prev[key] && !validateField(key, { ...values, [key]: value })
        ? { ...prev, [key]: undefined }
        : prev
    )
  }

  const onBlur = (key) => () => {
    setErrors((prev) => ({ ...prev, [key]: validateField(key, values) || undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return

    // Bots fill the honeypot; people cannot reach it. Drop it silently.
    if (values.website) {
      setStatus('sent')
      return
    }

    const found = validate(values)
    setErrors(found)

    const firstInvalid = REQUIRED.find((key) => found[key])
    if (firstInvalid) {
      setStatus('idle') // clear a stale failure banner; the field errors say more
      formRef.current?.querySelector(`#${firstInvalid}`)?.focus()
      return
    }

    setStatus('submitting')
    try {
      const { website, ...payload } = values
      await submitMessage(payload)
      setSentName(values.name.trim().split(' ')[0])
      setValues(EMPTY)
      setErrors({})
      moveFocus.current = 'sent'
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const startOver = () => {
    moveFocus.current = 'form'
    setSentName('')
    setStatus('idle')
  }

  if (status === 'sent') {
    return (
      <div className="form__sent" role="status" tabIndex={-1} ref={sentRef}>
        <span className="form__sent-mark" aria-hidden="true">
          ✓
        </span>
        <h3 className="display display--sm">Message received.</h3>
        <p className="body">
          Thanks{sentName ? `, ${sentName}` : ''}. A senior lead, not a bot and not a junior, will
          reply within one business day, usually with two or three questions about your current
          motion.
        </p>
        <button type="button" className="btn btn--ghost" onClick={startOver}>
          Send another message
        </button>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form className="form" id="enquiry" onSubmit={onSubmit} noValidate ref={formRef}>
      {status === 'failed' && (
        <p className="form__alert" role="alert">
          That did not send. Try again, or email us directly at{' '}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>
      )}

      <div className="form__grid">
        <div className="form__row2">
          <div className={`field ${errors.name ? 'has-error' : ''}`}>
            <label className="field__label" htmlFor="name">
              Name <span aria-hidden="true">*</span>
              <span className="visually-hidden">(required)</span>
            </label>
            <input
              id="name"
              name="name"
              ref={nameRef}
              value={values.name}
              onChange={update('name')}
              onBlur={onBlur('name')}
              placeholder="First and last"
              autoComplete="name"
              maxLength={80}
              required
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span className="field__error" id="name-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <label className="field__label" htmlFor="email">
              Work email <span aria-hidden="true">*</span>
              <span className="visually-hidden">(required)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={update('email')}
              onBlur={onBlur('email')}
              placeholder="you@company.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              maxLength={120}
              required
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span className="field__error" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="form__row2">
          <div className={`field ${errors.company ? 'has-error' : ''}`}>
            <label className="field__label" htmlFor="company">
              Company <span aria-hidden="true">*</span>
              <span className="visually-hidden">(required)</span>
            </label>
            <input
              id="company"
              name="company"
              value={values.company}
              onChange={update('company')}
              onBlur={onBlur('company')}
              placeholder="Where you work"
              autoComplete="organization"
              maxLength={80}
              aria-invalid={errors.company ? 'true' : undefined}
              aria-describedby={errors.company ? 'company-error' : undefined}
            />
            {errors.company && (
              <span className="field__error" id="company-error" role="alert">
                {errors.company}
              </span>
            )}
          </div>

          <div className={`field ${errors.interest ? 'has-error' : ''}`}>
            <label className="field__label" htmlFor="interest">
              What you need <span aria-hidden="true">*</span>
              <span className="visually-hidden">(required)</span>
            </label>
            <Select
              id="interest"
              name="interest"
              value={values.interest}
              onChange={update('interest')}
              options={INTERESTS}
              placeholder="Select one"
            />
            {errors.interest && (
              <span className="field__error" id="interest-error" role="alert">
                {errors.interest}
              </span>
            )}
          </div>
        </div>

        <div className={`field ${errors.message ? 'has-error' : ''}`}>
          <label className="field__label" htmlFor="message">
            The problem <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={update('message')}
            onBlur={onBlur('message')}
            placeholder="What is stalling, what you have tried, and what next quarter needs to look like."
            maxLength={1200}
            required
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <span className="field__error" id="message-error" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        {/* Honeypot. Off-screen and out of the tab order, so only bots fill it. */}
        <div className="form__trap" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            value={values.website}
            onChange={update('website')}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="form__foot">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Sending…' : <>Send message <Arrow /></>}
          </button>
          <p className="form__note">
            We reply within one business day. No sequence, no drip campaign. You get a person.
          </p>
        </div>
      </div>
    </form>
  )
}

