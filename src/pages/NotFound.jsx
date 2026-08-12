import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'

export default function NotFound() {
  return (
    <section className="shell notfound">
      <span className="eyebrow">Error 404</span>
      <h1 className="display display--xl">This page is not part of the motion.</h1>
      <p className="lede">
        The link is broken or the page has moved. The five that matter are all one click away.
      </p>
      <Link className="btn" to="/">
        Back to home <Arrow />
      </Link>
    </section>
  )
}
