import Dialog from './Dialog'
import EnquiryForm from './EnquiryForm'

/**
 * The written enquiry, for visitors who would rather not book a call yet.
 *
 * Posts to the same PHP endpoint as before, which relays through Brevo to
 * info@dealworkx.com. The form keeps its own confirmation screen, so the dialog
 * stays open after sending rather than closing out from under the message.
 */
export default function EnquiryModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title="Send a message" className="bmodal--form">
      <div className="bmodal__body">
        <p className="bmodal__lede">
          Tell us what is stalling and we will reply within one business day. Prefer to talk? Close
          this and book a call instead.
        </p>
        {/* Remounted on each open so a previous send does not greet the next
            visitor with someone else's confirmation. */}
        {open && <EnquiryForm />}
      </div>
    </Dialog>
  )
}
