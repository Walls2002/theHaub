import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import Reveal from '../components/Reveal'
import Stats from '../components/Stats'
import CTABand from '../components/CTABand'
import Quote from '../components/Quote'
import images from '../data/images'
import { clients, hero, reasons, services, statement, stats, testimonials } from '../data/content'

export default function Home() {
  return (
    <>
      {/* ---------------------------------- Hero --------------------------------- */}
      <section className="hero">
        <div className="shell">
          <Reveal>
            <span className="eyebrow">{hero.eyebrow}</span>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="display display--xl hero__title">
              {hero.headline}
              <span className="accentline">{hero.headlineAccent}</span>
            </h1>
          </Reveal>

          <Reveal delay={150} className="hero__meta">
            <p className="lede">{hero.body}</p>
            <div className="btn-row hero__actions">
              <Link className="btn" to="/contact">
                Book an intro call <Arrow />
              </Link>
              <Link className="btn btn--ghost" to="/work">
                See how we work
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Full-bleed banner with overlapping panels */}
        <Reveal delay={120} className="hero__stage">
          <div className="frame hero__banner">
            <img
              src={images.heroPrimary}
              alt="A revenue team working through account research across a shared floor"
              loading="eager"
            />
          </div>

          <div className="hero__panel">
            <span className="eyebrow">Live across client accounts</span>
            <ul className="hero__panel-stats">
              {hero.proof.map((p) => (
                <li key={p.label}>
                  <div className="hero__panel-value">{p.value}</div>
                  <div className="hero__panel-label">{p.label}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero__float">
            <div className="frame frame--hover">
              <img src={images.heroSecondary} alt="Two specialists reviewing a pipeline board" />
            </div>
            <p className="hero__float-note">
              Weekly review. Every miss read out with the wins.
            </p>
          </div>
        </Reveal>

        <div className="shell">
          <Reveal as="ul" className="hero__disciplines">
            {hero.disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
            <li style={{ marginLeft: 'auto' }} className="mono">
              Est. 2019 · 11 markets
            </li>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Statement -------------------------------- */}
      <section className="statement">
        <div className="shell">
          <div className="statement__grid">
            <Reveal>
              <span className="eyebrow">The position</span>
              <p className="statement__quote" style={{ marginTop: 26 }}>
                {statement}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="body">
                We are not a staffing agency with a sales deck. We are the team that owns the first
                thirty days of a buying conversation: research, outreach, qualification and the
                handover. Then we report on it in public.
              </p>
              <p className="statement__sig" style={{ marginTop: 28 }}>
                TheHaub · Embedded revenue teams
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------- What we do ------------------------------ */}
      <section className="section">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">What we do</span>
              <h2 className="display display--lg head__title">
                Four practices. One team on your account.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                Most clients start with one practice and add the next once the reporting proves out.
                Nothing is bundled that you did not ask for.
              </p>
            </Reveal>
          </div>

          <div className="services">
            {services.map((s, i) => (
              <Reveal className="service" key={s.id} delay={i * 60}>
                <span className="service__num">{s.id}</span>
                <h3 className="service__title">{s.title}</h3>
                <p className="body">{s.body}</p>
                <ul className="service__points">
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- Why us --------------------------------- */}
      <section className="section section--muted">
        <div className="shell">
          <div className="reasons__grid">
            <div className="reasons__media">
              <Reveal>
                <span className="eyebrow">Why build with us</span>
                <h2 className="display display--md" style={{ marginTop: 20 }}>
                  An extension of your team, held to the same bar.
                </h2>
                <div className="frame frame--hover ratio-4x5" style={{ marginTop: 32 }}>
                  <img src={images.approach} alt="A team lead running a weekly pipeline review" />
                </div>
              </Reveal>
            </div>

            <div>
              <Reveal>
                <p className="lede" style={{ marginBottom: 34 }}>
                  Outsourcing usually fails for structural reasons, not effort. Every one of these is
                  a fix for something we watched break.
                </p>
              </Reveal>
              <ul className="reasons__list">
                {reasons.map((r, i) => (
                  <Reveal as="li" className="reason" key={r.title} delay={i * 55}>
                    <h3 className="reason__title">{r.title}</h3>
                    <p className="reason__body">{r.body}</p>
                  </Reveal>
                ))}
              </ul>
              <Reveal delay={120}>
                <Link className="tlink" to="/work" style={{ marginTop: 30 }}>
                  How an engagement runs <Arrow size={12} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------- Numbers -------------------------------- */}
      <section className="section section--tight">
        <div className="shell">
          <Reveal>
            <span className="eyebrow">By the numbers</span>
          </Reveal>
          <div style={{ marginTop: 34 }}>
            <Stats items={stats} columns={4} />
          </div>
        </div>
      </section>

      {/* --------------------------------- Clients -------------------------------- */}
      <section className="section section--ruled">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">Selected clients</span>
              <h2 className="display display--lg head__title">
                Teams we build pipeline with.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                Logistics, health operations, industrial software and financial infrastructure.
                Long sales cycles, technical buyers, and no patience for spray-and-pray.
              </p>
            </Reveal>
          </div>
          <ul className="logos">
            {clients.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 40}>
                {c}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------ Testimonials ------------------------------ */}
      <section className="section section--muted">
        <div className="shell">
          <div className="head head--split">
            <Reveal>
              <span className="eyebrow">In their words</span>
              <h2 className="display display--lg head__title">What the work feels like.</h2>
            </Reveal>
            <Reveal delay={100}>
              <Link className="tlink" to="/testimonials">
                Read every testimonial <Arrow size={12} />
              </Link>
            </Reveal>
          </div>
          <div className="quotes">
            {testimonials.slice(0, 3).map((t, i) => (
              <Quote key={t.name} item={t} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  )
}
