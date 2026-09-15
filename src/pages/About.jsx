import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import CTABand from '../components/CTABand'
import images from '../data/images'
import { about } from '../data/content'

export default function About() {
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="About DealWorkx"
        variant="statement"
        title="Founded by former Senior SDRs who know that great products do not always lose because of the product, but because the right conversations never get started."
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
            </Reveal>
          </div>

          <Reveal delay={120} className="frame frame--hover ratio-16x9" style={{ marginTop: 64 }}>
            <img src={images.aboutLead} alt="Two colleagues reviewing an account map together" />
          </Reveal>
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
                Predictable does not mean large. It means the meetings you counted on in January are
                still landing in September, because the research and the sending behind them are
                visible to everyone who depends on them.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Work with us"
        title="You bring the ICP. We’ll show you how we’d turn it into a pipeline."
        body="Send us your ideal customer profile and your current outbound setup, and we will tell you, honestly, whether more outreach is the answer or whether something upstream needs fixing first."
      />
    </>
  )
}
