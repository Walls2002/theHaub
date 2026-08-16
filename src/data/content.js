import images from './images'

/* ---------------------------------- Home ---------------------------------- */

export const hero = {
  eyebrow: 'B2B appointment setting',
  headline: 'You close the deals.',
  headlineAccent: 'We fill the calendar.',
  body:
    'DealWorkx researches your market, runs the outreach across email, LinkedIn and phone, and books qualified meetings straight onto your reps’ calendars. First meetings inside thirty days.',
  disciplines: ['Appointment setting', 'Lead research', 'Outbound campaigns'],
  proof: [
    { value: '$310M', label: 'Client pipeline generated since 2019' },
    { value: '9,400', label: 'Qualified meetings booked' },
    { value: '30 days', label: 'To your first booked meeting' }
  ]
}

export const statement =
  'Building an in-house SDR desk costs six months and most of a quarter of a million dollars before the first meeting lands. We start booking in thirty days.'

export const services = [
  {
    id: '01',
    title: 'Appointment setting',
    body:
      'Research, outreach and follow-up handled end to end. You get a confirmed meeting with a decision maker who knows why the call is happening.',
    points: ['Verified decision makers', 'Confirmed and reminded', 'Briefed before the call']
  },
  {
    id: '02',
    title: 'Lead research',
    body:
      'Your ideal customer defined narrowly, then built into a list of real people with verified contact details and a reason to hear from you this month.',
    points: ['ICP and account mapping', 'Verified contact data', 'Intent and hiring triggers']
  },
  {
    id: '03',
    title: 'Outreach infrastructure',
    body:
      'Separate sending domains, warmed properly and monitored every week. Campaign volume never touches the domain your invoices go out on.',
    points: ['Dedicated sending domains', 'Inbox placement monitoring', 'Copy tested per segment']
  },
  {
    id: '04',
    title: 'CRM and handover',
    body:
      'Every booked meeting lands in your CRM with the research attached, routed to the right rep, and tracked through to closed won or closed lost.',
    points: ['CRM setup and routing', 'Handover briefs', 'Pipeline reporting']
  }
]

export const reasons = [
  {
    title: 'A quarter of the cost of hiring',
    body:
      'One in-house rep means salary, tooling, management and a six-month ramp you pay for whether or not it works. A DealWorkx team costs less and starts sooner.'
  },
  {
    title: 'Live in two weeks, booking in four',
    body:
      'Research and infrastructure run in parallel during weeks one and two. Campaigns open in week three, and the first meetings land inside thirty days.'
  },
  {
    title: 'Your domain reputation stays clean',
    body:
      'All campaign volume runs on separate warmed domains we own and monitor. If a domain degrades we retire it, and your primary sending reputation is untouched.'
  },
  {
    title: 'You only do the closing',
    body:
      'List building, copy, sending, follow-up, no-shows and rescheduling are ours. Your reps open their calendar and take the call.'
  }
]

export const stats = [
  { value: '30', unit: 'days', label: 'To first booked meeting' },
  { value: '9,400', unit: '', label: 'Meetings booked since 2019' },
  { value: '71', unit: '%', label: 'Average meeting show rate' },
  { value: '11', unit: '', label: 'Markets covered end to end' }
]

export const clients = [
  'Northbeam Logistics',
  'Corvara Health',
  'Ledgerline',
  'Halden Robotics',
  'Solvent Labs',
  'Meridian Freight',
  'Pathwise',
  'Kestrel Analytics'
]

/* ---------------------------------- About --------------------------------- */

export const about = {
  intro:
    'We started DealWorkx because good products kept losing to worse ones with fuller calendars. Pipeline is rarely a talent problem. It is a research and consistency problem, and that can be handed to someone else.',
  lead:
    'DealWorkx is a team of researchers, copywriters and sales development reps who book meetings for B2B companies. You bring the product and the closers. We bring the calendar.',
  beginning: {
    title: 'How it started',
    body: [
      'In 2019 we ran outbound for a logistics software company with eleven salespeople and no research function. We spent six weeks reading accounts before anyone sent a first email. That quarter closed at 340% of target.',
      'Research first, outreach second. That order became the company.'
    ]
  },
  now: {
    title: 'Where we are now',
    body: [
      'Thirty-eight specialists across research, copy, sending and booking, working accounts in eleven markets for clients from Series A through enterprise.',
      'We still refuse campaigns that ask us to skip the research. It costs us deals, and it is the reason month nine looks like month three.'
    ]
  },
  mission:
    'Our job is to make the calendar predictable, so the people who build the product can stop guessing what next quarter looks like.',
  values: [
    { id: '01', title: 'Say the number', body: 'Meeting targets are agreed in writing before work starts, and reported against either way.' },
    { id: '02', title: 'Read before you write', body: 'No account is contacted before it is understood. Volume without context is just noise.' },
    { id: '03', title: 'Protect the inbox', body: 'Deliverability is a standing job, not a setup task. We monitor placement every week.' },
    { id: '04', title: 'Publish the misses', body: 'Campaigns that failed go in the same report as the ones that worked, with the reason attached.' }
  ],
  timeline: [
    { year: '2019', text: 'Founded with two operators and one logistics client.' },
    { year: '2021', text: 'Dedicated deliverability practice opened after our first burned domain.' },
    { year: '2023', text: 'Five thousandth meeting booked.' },
    { year: '2026', text: 'Thirty-eight specialists across eleven markets.' }
  ]
}

/* ----------------------------------- Work ---------------------------------- */

export const pillars = [
  {
    id: '01',
    title: 'Define and research',
    body:
      'We narrow your ideal customer until it is a list of named people, then read each account for the trigger that makes this the right month rather than some month.'
  },
  {
    id: '02',
    title: 'Build the infrastructure',
    body:
      'Sending domains registered, warmed and authenticated. Sequences built per segment. Nothing sends until placement testing clears.'
  },
  {
    id: '03',
    title: 'Run the outreach',
    body:
      'Email, LinkedIn and phone, sequenced by segment and rewritten every six weeks against reply data. Two variants always running against each other.'
  },
  {
    id: '04',
    title: 'Book and hand over',
    body:
      'Interested replies are qualified against your criteria, booked, confirmed, reminded, and handed to your rep with the research attached.'
  }
]

export const engagements = [
  {
    tag: 'Logistics software',
    title: 'A full CRM and an empty calendar',
    body:
      'Forty salespeople, no research function. We cut the target list by 62% and rebuilt outreach around shipment-volume triggers.',
    metrics: [
      { value: '31', label: 'Meetings booked per month' },
      { value: '62%', label: 'Smaller target list' },
      { value: '19 days', label: 'To first booked meeting' }
    ]
  },
  {
    tag: 'Clinical operations',
    title: 'Rebuilt after a burned domain',
    body:
      'Their primary domain had been used for cold volume and was landing in spam. We moved sending to fresh warmed domains and repaired placement.',
    metrics: [
      { value: '96%', label: 'Inbox placement restored' },
      { value: '+48%', label: 'Reply-to-meeting rate' },
      { value: '0', label: 'Emails from their main domain' }
    ]
  },
  {
    tag: 'Industrial automation',
    title: 'Meetings that actually happened',
    body:
      'They were being sold appointments that never showed. We rewrote qualification, added confirmation calls, and reported on held meetings only.',
    metrics: [
      { value: '79%', label: 'Show rate, up from 41%' },
      { value: '2.4×', label: 'Pipeline per meeting' },
      { value: '11k', label: 'Duplicate records merged' }
    ]
  }
]

export const capabilities = [
  { area: 'Research', detail: 'ICP definition, account mapping, verified contact data, intent and trigger monitoring' },
  { area: 'Copy', detail: 'Sequence design, per-segment messaging, A/B testing against reply data' },
  { area: 'Sending', detail: 'Domain setup and warm-up, authentication, inbox placement monitoring' },
  { area: 'Booking', detail: 'Qualification against your criteria, confirmation, reminders, rescheduling' },
  { area: 'Reporting', detail: 'Meetings booked and held, pipeline created, weekly written reviews' }
]

/* --------------------------------- Contact --------------------------------- */

export const faqs = [
  {
    q: 'What does it cost?',
    a: 'A flat monthly fee covering the whole team, with a performance component tied to held meetings once the ramp period closes. It lands well under the loaded cost of one in-house rep. Ninety days is the shortest engagement that produces a fair read.'
  },
  {
    q: 'How quickly do meetings start?',
    a: 'Research and domain warm-up run through weeks one and two, campaigns open in week three, and the first meetings are usually booked inside thirty days.'
  },
  {
    q: 'Do we keep the data and the accounts?',
    a: 'Always. The account map, the sequences and every record stay with you if the engagement ends. Nothing is locked in a vendor system you cannot export.'
  },
  {
    q: 'Which markets do you cover?',
    a: 'North America, the UK and Ireland, the Nordics, ANZ and Southeast Asia, staffed to your prospects’ business hours rather than ours.'
  }
]
