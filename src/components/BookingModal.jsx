import Dialog from './Dialog'
import { site } from '../data/site'

/**
 * The Google Calendar appointment schedule, in a dialog.
 *
 * Inline, the booking page has to be given a fixed height, and whatever height
 * you pick is wrong for somebody: Google's own content is taller than it looks
 * and you end up with a scrollbar inside a scrollbar. A dialog can take most of
 * the viewport, which is enough for the whole booking page at once.
 */

/** Google's booking page only renders inside a frame when gv=true is present. */
function embedUrl(raw) {
  try {
    const url = new URL(raw)
    url.searchParams.set('gv', 'true')
    return url.toString()
  } catch {
    return raw
  }
}

export function hasBooking() {
  return Boolean(site.booking?.url)
}

export default function BookingModal({ open, onClose }) {
  if (!hasBooking()) return null

  const { url, label } = site.booking

  return (
    <Dialog open={open} onClose={onClose} title={label}>
      {/* Only mounted while open, so Google's app is never downloaded by a
          visitor who does not open the dialog. */}
      {open && <iframe className="bmodal__frame" src={embedUrl(url)} title={label} />}

      <p className="bmodal__fallback">
        Not loading?{' '}
        <a href={url} target="_blank" rel="noreferrer">
          Open the booking page
        </a>
      </p>
    </Dialog>
  )
}
