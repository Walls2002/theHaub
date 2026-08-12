import Reveal from './Reveal'

export default function Stats({ items, columns = 4 }) {
  return (
    <ul className={`stats stats--${columns}`}>
      {items.map((item, i) => (
        <Reveal as="li" className="stat" key={item.label} delay={i * 70}>
          <div className="stat__value">
            {item.value}
            {item.unit ? <span className="stat__unit">{item.unit}</span> : null}
          </div>
          <p className="stat__label">{item.label}</p>
        </Reveal>
      ))}
    </ul>
  )
}
