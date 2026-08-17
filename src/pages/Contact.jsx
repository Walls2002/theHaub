import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Arrow from '../components/Arrow'
import { site } from '../data/site'
import { faqs } from '../data/content'

const EMPTY = {
  name: '',
  email: '',
  company: '',
  interest: 'Appointment setting',
  message: '',
  website: '' // honeypot, never shown
}

const REQUIRED = ['name', 'email', 'message']

function validateField(key, values) {
  const value = values[key].trim()
  if (key === 'name') return value ? '' : 'Please tell us your name.'
  if (key === 'email') {
    if (!value) return 'We need an email to reply to.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'That email address does not look right.'
    return ''
  }
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

  // A 200 that is not our own {ok:true} means something else answered — a host
  // error page, a redirect to index.html. Treat it as a failure, not a send.
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || `Contact endpoint returned ${response.status}`)
  }
}

function ContactForm() {
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
    <form className="form" onSubmit={onSubmit} noValidate ref={formRef}>
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
          <div className="field">
            <label className="field__label" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              name="company"
              value={values.company}
              onChange={update('company')}
              placeholder="Where you work"
              autoComplete="organization"
              maxLength={80}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="interest">
              What you need
            </label>
            <select id="interest" name="interest" value={values.interest} onChange={update('interest')}>
              <option>Appointment setting</option>
              <option>Lead research</option>
              <option>Outreach infrastructure</option>
              <option>CRM and handover</option>
              <option>Not sure yet</option>
            </select>
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

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <PageHeader
        index="03"
        eyebrow="Contact"
        title="Let’s talk about the number you have to hit."
        lede="Thirty minutes, no deck. Bring your current pipeline math and we will tell you how many meetings a month your market can realistically support."
      />

      <section className="section">
        <div className="shell">
          <div className="contact__grid">
            {/* ------------------------------ Left column ----------------------------- */}
            <div>
              <Reveal className="person">
                <a className="btn" href={site.bookingUrl} target="_blank" rel="noreferrer">
                  Book a 30-minute call <Arrow />
                </a>
              </Reveal>

              <Reveal delay={80} className="detail-list">
                <div className="detail">
                  <span className="field__label">Email</span>
                  <span className="detail__value">
                    <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                  </span>
                </div>
                <div className="detail">
                  <span className="field__label">Phone</span>
                  <span className="detail__value">
                    <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
                  </span>
                </div>
                <div className="detail">
                  <span className="field__label">Studio</span>
                  <span className="detail__value">
                    {site.contact.address.map((line) => (
                      <span key={line} style={{ display: 'block' }}>
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="detail">
                  <span className="field__label">Hours</span>
                  <span className="detail__value">{site.contact.hours}</span>
                </div>
              </Reveal>
            </div>

            {/* ----------------------------- Right column ----------------------------- */}
            <Reveal delay={120}>
              <span className="eyebrow">Send a message</span>
              <h2 className="display display--md" style={{ marginTop: 18, marginBottom: 30 }}>
                Tell us what is stalling.
              </h2>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------- FAQ ---------------------------------- */}
      <section className="section section--muted">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">Before you write</span>
              <h2 className="display display--lg head__title">The four questions we always get.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                If yours is not here, ask it in the form. We answer pricing questions in the first
                reply rather than the third call.
              </p>
            </Reveal>
          </div>

          <div className="faq">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={f.q}>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  >
                    {f.q}
                    <span className="faq__sign" aria-hidden="true">
                      +
                    </span>
                  </button>
                  <div className="faq__a" id={`faq-panel-${i}`} role="region">
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
