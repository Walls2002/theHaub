import Reveal from './Reveal'

export default function PageHeader({ index, eyebrow, title, lede, aside }) {
  return (
    <header className="pagehead">
      <div className="shell">
        <Reveal className="crumbs">
          {index && <span className="mono">{index}</span>}
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <div className="pagehead__grid">
          <Reveal delay={60}>
            <h1 className="display display--xl">{title}</h1>
          </Reveal>
          {(lede || aside) && (
            <Reveal delay={140}>
              {lede && <p className="lede">{lede}</p>}
              {aside}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  )
}
