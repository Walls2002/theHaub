import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Arrow from '../components/Arrow'
import EnquiryModal from '../components/EnquiryModal'
import { useBooking } from '../components/BookingProvider'
import { site } from '../data/site'
import { faqs } from '../data/content'

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0)
  const [enquiry, setEnquiry] = useState(false)
  const { openBooking, bookingAvailable } = useBooking()

  // Booking replaced the enquiry form: the questions it used to ask are now on
  // Google's booking form, so the answers arrive attached to the invitation.
  // With no schedule configured there is nothing to open, so fall back to email
  // rather than leaving a button that does nothing.
  const onBookClick = (e) => {
    e.preventDefault()
    if (bookingAvailable) {
      openBooking()
      return
    }
    setEnquiry(true)
  }

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
              <span className="eyebrow">Book a call</span>
              <h2 className="display display--md" style={{ marginTop: 18 }}>
                Pick a time that suits you.
              </h2>
              <p className="body" style={{ marginTop: 20 }}>
                Thirty minutes on Google Meet. Pick a slot, add your name and email, and the
                invitation lands in your calendar straight away with the video link inside it.
              </p>

              <button type="button" className="btn" style={{ marginTop: 30 }} onClick={onBookClick}>
                {site.booking.label} <Arrow />
              </button>

              <p className="muted" style={{ marginTop: 22, fontSize: '0.9rem' }}>
                Not ready for a call?{' '}
                <button type="button" className="linkbtn" onClick={() => setEnquiry(true)}>
                  Send us a message instead
                </button>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------- Booking -------------------------------- */}
      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} />

      {/* ----------------------------------- FAQ ---------------------------------- */}
      <section className="section section--muted">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">Before you book</span>
              <h2 className="display display--lg head__title">The four questions we always get.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                If yours is not here, bring it to the call. We answer pricing questions in the first
                thirty minutes rather than the third meeting.
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
