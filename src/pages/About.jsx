import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import CTABand from '../components/CTABand'
import Stats from '../components/Stats'
import images from '../data/images'
import { about, stats } from '../data/content'

export default function About() {
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="About TheHaub"
        title="Built by operators who got tired of watching good products lose slowly."
        lede={about.intro}
      />

      {/* --------------------------------- Opening -------------------------------- */}
      <section className="section">
        <div className="shell">
          <div className="prose-split">
            <Reveal className="prose-split__label">
              <span className="eyebrow">Who we are</span>
            </Reveal>
            <Reveal delay={80}>
              <p className="display display--md" style={{ maxWidth: '20ch' }}>
                Research first. Outreach second. Always in that order.
              </p>
              <p className="body" style={{ marginTop: 28 }}>
                {about.lead}
              </p>
              <p className="body">
                A pod is four people: a researcher who reads the market, two specialists who work
                it, and a senior lead who owns the number. They join your standups, sit in your
                Slack, and carry your email signature. Most clients stop describing them as an
                agency somewhere around week five.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="frame frame--hover ratio-16x9" style={{ marginTop: 64 }}>
            <img src={images.aboutLead} alt="Two colleagues reviewing an account map together" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- How it started --------------------------- */}
      <section className="section section--muted">
        <div className="shell">
          <div className="storyblock">
            <div>
              <Reveal>
                <span className="eyebrow">{about.beginning.title}</span>
                <h2 className="display display--md" style={{ marginTop: 20 }}>
                  Six weeks of reading before anyone picked up a phone.
                </h2>
              </Reveal>
              {about.beginning.body.map((p, i) => (
                <Reveal key={i} delay={80 + i * 60}>
                  <p className="body" style={{ marginTop: 22 }}>
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120} className="storyblock__media">
              <div className="frame frame--hover ratio-4x5">
                <img src={images.aboutStory} alt="Team mapping territories on a whiteboard" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------ Where we are now -------------------------- */}
      <section className="section">
        <div className="shell">
          <div className="storyblock storyblock--flip">
            <div>
              <Reveal>
                <span className="eyebrow">{about.now.title}</span>
                <h2 className="display display--md" style={{ marginTop: 20 }}>
                  Thirty-eight specialists, organised in pods of four.
                </h2>
              </Reveal>
              {about.now.body.map((p, i) => (
                <Reveal key={i} delay={80 + i * 60}>
                  <p className="body" style={{ marginTop: 22 }}>
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120} className="storyblock__media">
              <div className="frame frame--hover ratio-4x5">
                <img src={images.aboutMission} alt="The wider team at work across a shared floor" />
              </div>
            </Reveal>
          </div>

          <Reveal style={{ marginTop: 72 }}>
            <ul className="timeline">
              {about.timeline.map((t) => (
                <li key={t.year}>
                  <div className="timeline__year">{t.year}</div>
                  <p className="timeline__text">{t.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------- Values --------------------------------- */}
      <section className="section section--muted">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">How we operate</span>
              <h2 className="display display--lg head__title">Four rules we do not trade away.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                They cost us work occasionally. They are also the reason clients are still here in
                year three.
              </p>
            </Reveal>
          </div>
          <ul className="values">
            {about.values.map((v, i) => (
              <Reveal as="li" className="value" key={v.id} delay={i * 60}>
                <span className="value__num">{v.id}</span>
                <h3 className="value__title">{v.title}</h3>
                <p className="value__body">{v.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------- Mission -------------------------------- */}
      <section className="statement">
        <div className="shell">
          <div className="statement__grid">
            <Reveal>
              <span className="eyebrow">Our mission</span>
              <p className="statement__quote" style={{ marginTop: 26 }}>
                {about.mission}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="body">
                Predictable does not mean large. It means the number you commit to in January is the
                number you can still defend in September, because the system that produced it is
                visible to everyone who depends on it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <Stats items={stats} columns={4} />
        </div>
      </section>

      <CTABand
        eyebrow="Work with us"
        title="Want to see whether your motion is worth scaling?"
        body="Send us your current numbers and we will tell you, honestly, whether more activity is the answer or whether something upstream needs fixing first."
      />
    </>
  )
}
