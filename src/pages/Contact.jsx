import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Arrow from '../components/Arrow'
import images from '../data/images'
import { site } from '../data/site'
import { faqs } from '../data/content'

const EMPTY = { name: '', email: '', company: '', interest: 'Outbound engineering', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please tell us your name.'
  if (!values.email.trim()) errors.email = 'We need an email to reply to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'That email address does not look right.'
  if (values.message.trim().length < 12)
    errors.message = 'A sentence or two about the problem helps us prepare.'
  return errors
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    // No backend yet — wire this to your form endpoint or CRM.
    setSent(true)
  }

  if (sent) {
    return (
      <div className="form__sent">
        <span className="form__sent-mark" aria-hidden="true">
          ✓
        </span>
        <h3 className="display display--sm">Message received.</h3>
        <p className="body">
          Thanks, {values.name.split(' ')[0]}. A senior lead — not a bot and not a junior — will
          reply within one business day, usually with two or three questions about your current
          motion.
        </p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setValues(EMPTY)
            setSent(false)
          }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__grid">
        <div className="form__row2">
          <div className={`field ${errors.name ? 'has-error' : ''}`}>
            <label className="field__label" htmlFor="name">
              Name <span>*</span>
            </label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={update('name')}
              placeholder="First and last"
              autoComplete="name"
            />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </div>

          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <label className="field__label" htmlFor="email">
              Work email <span>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={update('email')}
              placeholder="you@company.com"
              autoComplete="email"
            />
            {errors.email && <span className="field__error">{errors.email}</span>}
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
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="interest">
              What you need
            </label>
            <select id="interest" name="interest" value={values.interest} onChange={update('interest')}>
              <option>Outbound engineering</option>
              <option>Revenue operations</option>
              <option>Inbound response</option>
              <option>Lifecycle &amp; retention</option>
              <option>Not sure yet</option>
            </select>
          </div>
        </div>

        <div className={`field ${errors.message ? 'has-error' : ''}`}>
          <label className="field__label" htmlFor="message">
            The problem <span>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={update('message')}
            placeholder="What is stalling, what you have tried, and what next quarter needs to look like."
          />
          {errors.message && <span className="field__error">{errors.message}</span>}
        </div>

        <div className="form__foot">
          <button type="submit" className="btn">
            Send message <Arrow />
          </button>
          <p className="form__note">
            We reply within one business day. No sequence, no drip campaign — you get a person.
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
        index="04"
        eyebrow="Contact"
        title="Let’s talk about the number you have to hit."
        lede="Thirty minutes, no deck. Bring your current pipeline math and we will tell you where an embedded team helps — and where it would only add noise."
      />

      <section className="section">
        <div className="shell">
          <div className="contact__grid">
            {/* ------------------------------ Left column ----------------------------- */}
            <div>
              <Reveal className="person">
                <span className="person__photo">
                  <img src={images.founder} alt="Elias Navarro, founder of TheHaub" />
                </span>
                <div>
                  <div className="person__name">Elias Navarro</div>
                  <div className="person__role">Founder &amp; Managing Partner</div>
                </div>
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
                If yours is not here, ask it in the form — we answer pricing questions in the first
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
