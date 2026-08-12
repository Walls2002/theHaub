import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import CTABand from '../components/CTABand'
import Arrow from '../components/Arrow'
import images from '../data/images'
import { capabilities, engagements, pillars } from '../data/content'

export default function Work() {
  return (
    <>
      <PageHeader
        index="02"
        eyebrow="The work"
        title="How we deliver value."
        lede="Every engagement runs on the same five-part method. The inputs change by market; the order never does."
      />

      {/* --------------------------------- Pillars -------------------------------- */}
      <section className="section">
        <div className="shell">
          <div className="pillars">
            {pillars.map((p, i) => (
              <Reveal className="pillar" key={p.id} delay={i * 60}>
                <span className="pillar__num">{p.id}</span>
                <h2 className="pillar__title">{p.title}</h2>
                <p className="body">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- Field work ------------------------------ */}
      <section className="section section--muted">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">From the floor</span>
              <h2 className="display display--lg head__title">
                What the method looks like on an ordinary Tuesday.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                No stock heroics. Research blocks, calibration calls, call scoring, and the Friday
                review where the misses get read out loud.
              </p>
            </Reveal>
          </div>

          <div className="gallery">
            {images.work.map((item, i) => (
              <Reveal as="figure" key={item.caption} delay={i * 60}>
                <div className="frame frame--hover ratio-3x2">
                  <img src={item.src} alt={item.alt} loading="lazy" />
                </div>
                <figcaption>{item.caption}</figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- Engagements ------------------------------ */}
      <section className="section">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">Selected engagements</span>
              <h2 className="display display--lg head__title">
                Three problems, and what changed.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                Client names withheld where the contract requires it. Numbers are as reported in the
                closing quarterly review.
              </p>
            </Reveal>
          </div>

          {engagements.map((e, i) => (
            <Reveal className="engagement" key={e.title} delay={i * 60}>
              <div>
                <span className="mono">{e.tag}</span>
                <h3 className="engagement__title">{e.title}</h3>
              </div>
              <p className="body">{e.body}</p>
              <div className="metrics">
                {e.metrics.map((m) => (
                  <div className="metric" key={m.label}>
                    <div className="metric__value">{m.value}</div>
                    <div className="metric__label">{m.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------- Capabilities ----------------------------- */}
      <section className="section section--muted">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">Capabilities</span>
              <h2 className="display display--lg head__title">Everything a pod can cover.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                Start with one area or take the full motion. Scope is agreed in writing before a
                single account is touched.
              </p>
              <Link className="tlink" to="/contact" style={{ marginTop: 22 }}>
                Scope an engagement <Arrow size={12} />
              </Link>
            </Reveal>
          </div>

          <div className="captable">
            {capabilities.map((c, i) => (
              <Reveal className="captable__row" key={c.area} delay={i * 45}>
                <span className="captable__area">{c.area}</span>
                <span className="captable__detail">{c.detail}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Start here"
        title="Bring us the motion that stalled."
        body="We will read your last two quarters, tell you where the drop-off is, and only then talk about a team."
      />
    </>
  )
}
