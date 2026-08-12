import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Quote from '../components/Quote'
import Stats from '../components/Stats'
import CTABand from '../components/CTABand'
import { clients, featuredTestimonial, outcomeStats, testimonials } from '../data/content'

export default function Testimonials() {
  return (
    <>
      <PageHeader
        index="03"
        eyebrow="Client testimonials"
        title="What our clients say when we are not in the room."
        lede="Collected from quarterly reviews and reference calls, published with permission and without edits beyond length."
      />

      {/* -------------------------------- Featured -------------------------------- */}
      <section className="section">
        <div className="shell">
          <div className="feature-quote">
            <Reveal>
              <span className="feature-quote__mark" aria-hidden="true" />
              <blockquote className="feature-quote__text">{featuredTestimonial.quote}</blockquote>
            </Reveal>
            <Reveal delay={120}>
              <div className="attrib">
                <span className="attrib__avatar">
                  <img src={featuredTestimonial.avatar} alt="" />
                </span>
                <span>
                  <span className="attrib__name">{featuredTestimonial.name}</span>
                  <br />
                  <span className="attrib__role">
                    {featuredTestimonial.role}, {featuredTestimonial.company}
                  </span>
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------- Grid ----------------------------------- */}
      <section className="section section--muted section--ruled">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">More from clients</span>
              <h2 className="display display--lg head__title">Six accounts, six views.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                Reference calls available on request — we will connect you with a client in your
                segment, including one that ended an engagement.
              </p>
            </Reveal>
          </div>

          <div className="quotes">
            {testimonials.map((t, i) => (
              <Quote key={t.name} item={t} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- Outcomes -------------------------------- */}
      <section className="section section--dark">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">Outcomes</span>
              <h2 className="display display--lg head__title">The numbers behind the quotes.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                Measured across all active accounts for the twelve months ending December 2025.
              </p>
            </Reveal>
          </div>
          <Stats items={outcomeStats} columns={3} />
        </div>
      </section>

      {/* --------------------------------- Clients -------------------------------- */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <span className="eyebrow">Who they are</span>
            <h2 className="display display--md" style={{ marginTop: 20, marginBottom: 40 }}>
              Selected clients.
            </h2>
          </Reveal>
          <ul className="logos">
            {clients.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 40}>
                {c}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CTABand
        eyebrow="Reference call"
        title="Talk to a client before you talk to us."
        body="Tell us your segment and we will introduce you to someone running the same motion. No sales call required first."
      />
    </>
  )
}
