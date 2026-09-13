// Brand-level facts. Placeholder contact details, replace before launch.

export const site = {
  name: 'DealWorkx',
  domain: 'dealworkx.com',
  tagline: 'B2B appointment setting',
  legal: 'DealWorkx Partners, Inc.',
  founded: 2019,
  // Google Calendar appointment schedule. To create it:
  //   Google Calendar -> Create -> Appointment schedule -> set the 30 minute
  //   slots and your hours -> tick "Add Google Meet video conferencing" ->
  //   Save -> Share -> copy the booking page link.
  // Paste that link below. It looks like:
  //   https://calendar.google.com/calendar/appointments/schedules/AcZssZ.../
  // Google creates the event on info@'s calendar, attaches the Meet link and
  // emails the invitation to the visitor and to us. Nothing else to wire up.
  //
  // Every booking is a separate event, so Google mints a fresh Meet link for
  // each one. The only ways to end up with a shared room are pasting a Meet
  // URL into the description by hand or using a personal meeting room, so do
  // neither: leave the "Add Google Meet video conferencing" tick box to it.
  //
  // Left empty the contact page simply skips the calendar and points at the
  // form, rather than embedding a frame that cannot load.
  //
  // The canonical URL rather than the calendar.app.google short link: the short
  // one 302s, and making an iframe follow a redirect is a needless failure
  // point. Share -> Copy link gives the short form, so resolve it before
  // pasting a new one here.
  booking: {
    url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ233QIoKNPH-km5lTX42UYhIpZyXLsObCABQjJ8aw1bpocL46DvpHjDSZIrCNQN1gfweKYIjmKG',
    label: 'Book a 30-minute call',
    note: 'Thirty minutes, on Google Meet. Pick any slot that suits you and the invitation lands in your calendar straight away.'
  },

  // Contact form target: the PHP endpoint uploaded alongside the site, which
  // relays through Brevo to info@dealworkx.com. Credentials live in
  // api/config.php on the server, never in this file.
  contactEndpoint: '/api/contact.php',

  contact: {
    email: 'info@dealworkx.com',
    phone: '+1 (628) 555-0142',
    phoneHref: '+16285550142',
    address: ['Level 12, Ayala North Exchange', 'Salcedo Village, Makati City', 'Philippines'],
    hours: 'Coverage across US, UK and APAC business hours'
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'X', href: 'https://x.com/' },
    { label: 'Careers', href: '#' }
  ]
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Contact', to: '/contact' }
]

export default site
