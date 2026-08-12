import Reveal from './Reveal'

export default function Quote({ item, delay = 0 }) {
  return (
    <Reveal as="figure" className="quote" delay={delay}>
      <div>
        <div className="quote__company">{item.company}</div>
        <blockquote className="quote__text">{item.quote}</blockquote>
      </div>
      <figcaption className="attrib">
        <span className="attrib__avatar">
          <img src={item.avatar} alt="" loading="lazy" />
        </span>
        <span>
          <span className="attrib__name">{item.name}</span>
          <br />
          <span className="attrib__role">{item.role}</span>
        </span>
      </figcaption>
    </Reveal>
  )
}
