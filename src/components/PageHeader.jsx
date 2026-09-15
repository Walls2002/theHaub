import Reveal from './Reveal'

/**
 * Page banner. Short titles ("How a meeting gets booked.") sit beside the lede
 * at display--xl. Sentence-length titles need variant="statement": it drops the
 * title a size, runs it across the full measure and moves the lede beneath it,
 * because a two-clause sentence in a half-width column wraps into a wall.
 */
export default function PageHeader({ index, eyebrow, title, lede, aside, variant }) {
  const statement = variant === 'statement'

  return (
    <header className={statement ? 'pagehead pagehead--statement' : 'pagehead'}>
      <div className="shell">
        <Reveal className="crumbs">
          {index && <span className="mono">{index}</span>}
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <div className="pagehead__grid">
          <Reveal delay={60}>
            <h1 className={`display ${statement ? 'display--lg' : 'display--xl'} pagehead__title`}>
              {title}
            </h1>
          </Reveal>
          {(lede || aside) && (
            <Reveal delay={140} className="pagehead__aside">
              {lede && <p className="lede">{lede}</p>}
              {aside}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  )
}
