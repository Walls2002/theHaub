import images from './images'

/* ---------------------------------- Home ---------------------------------- */

export const hero = {
  eyebrow: 'Embedded revenue teams',
  headline: 'Pipeline is a system.',
  headlineAccent: 'We build and run yours.',
  body:
    'TheHaub assembles specialists who sit inside your sales org, not beside it. They use your stack, your qualification bar and your calendar, and they answer to a named lead who reports to you every Friday.',
  disciplines: ['Outbound engineering', 'Revenue operations', 'Lifecycle & retention'],
  proof: [
    { value: '1,180', label: 'Qualified meetings held in 2025' },
    { value: '94%', label: 'Client retention past year one' },
    { value: '21 days', label: 'Median ramp to live volume' }
  ]
}

export const statement =
  'Most teams do not have a lead problem. They have an execution problem that nobody owns. We take ownership, in writing, with numbers attached.'

export const services = [
  {
    id: '01',
    title: 'Outbound engineering',
    body:
      'Account research, list architecture, message testing and the specialists who work the sequences every day. Built per segment, rewritten every six weeks against reply data.',
    points: ['ICP and account mapping', 'Multi-channel cadences', 'Copy testing at volume']
  },
  {
    id: '02',
    title: 'Revenue operations',
    body:
      'The unglamorous half of pipeline: clean records, sane routing, honest attribution and a dashboard your board can read without a translator.',
    points: ['CRM hygiene and routing', 'Attribution and forecasting', 'Reporting your board reads']
  },
  {
    id: '03',
    title: 'Inbound response',
    body:
      'Speed-to-lead under five minutes during your business hours. Every inbound is qualified against your criteria and booked directly onto the right calendar.',
    points: ['Sub-5-minute response', 'Qualification against your bar', 'Direct calendar booking']
  },
  {
    id: '04',
    title: 'Lifecycle & retention',
    body:
      'Onboarding sequences, expansion plays and churn signals worked by people who know your product well enough to answer the second question.',
    points: ['Onboarding and activation', 'Expansion and renewal plays', 'Churn-signal monitoring']
  }
]

export const reasons = [
  {
    title: 'Hired for you, not drawn from a pool',
    body:
      'Every specialist is recruited against your role brief and stays on your account. No rotating bench, no shared headcount across four clients.'
  },
  {
    title: 'They live in your stack',
    body:
      'Your CRM, your sequencer, your Slack, your meeting notes. Nothing is exported to a vendor system you cannot audit.'
  },
  {
    title: 'One senior lead per account',
    body:
      'A named team lead owns targets, quality and escalation. You get one person to call, not a support queue.'
  },
  {
    title: 'Ramped in twenty-one days',
    body:
      'Week one is discovery and enablement, week two is calibration, week three is live volume with a quality gate before scale.'
  },
  {
    title: 'Reported without varnish',
    body:
      'Meetings held, pipeline created, and the plays that failed. We publish the misses in the same document as the wins.'
  }
]

export const stats = [
  { value: '21', unit: 'days', label: 'Median ramp to live volume' },
  { value: '4.2', unit: '×', label: 'Average pipeline coverage built' },
  { value: '38', unit: '', label: 'Embedded specialists placed' },
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
    'We started TheHaub on a simple observation: the companies with the best products rarely lose on product. They lose because nobody owns the first thirty days of a buying conversation.',
  lead:
    'TheHaub is a team of researchers, operators and sales specialists who take that ownership. We map the accounts worth your time, build the motion that reaches them, and staff it with people who stay long enough to get good at your market.',
  beginning: {
    title: 'How it started',
    body: [
      'In 2019 we were two operators moonlighting for a logistics software company that had eleven salespeople and no research function. We spent six weeks doing nothing but reading accounts before anyone dialled. The quarter closed at 340% of target.',
      'Understand, then reach out. That order of operations became the whole company. We wrote it down, hired against it, and refused the work that asked us to skip it.'
    ]
  },
  now: {
    title: 'Where we are now',
    body: [
      'Thirty-eight specialists across research, outbound, operations and lifecycle, organised into pods of four with a senior lead on every account. Clients range from Series A teams making their first sales hire to enterprises rebuilding a stalled outbound function.',
      'We still refuse the work that asks us to skip the reading. It costs us deals. It is also the only reason the numbers hold up in month nine.'
    ]
  },
  mission:
    'Our job is to make revenue predictable enough to plan against, so that the people who build the product can stop guessing what next quarter looks like.',
  values: [
    { id: '01', title: 'Say the number', body: 'Targets are agreed in writing before work starts, and reported against whether or not they were met.' },
    { id: '02', title: 'Read before you write', body: 'No account is contacted before it is understood. Volume without context is just noise with a logo on it.' },
    { id: '03', title: 'Stay long enough to be useful', body: 'We staff for tenure, not utilisation. A specialist in month nine is worth four in month one.' },
    { id: '04', title: 'Publish the misses', body: 'The plays that failed go in the same report as the ones that worked, with the reason attached.' }
  ],
  timeline: [
    { year: '2019', text: 'Founded with two operators and one logistics client.' },
    { year: '2021', text: 'First revenue operations pod; reporting standard published.' },
    { year: '2023', text: 'Lifecycle and retention practice opened after client demand.' },
    { year: '2026', text: 'Thirty-eight specialists across eleven markets.' }
  ]
}

/* ----------------------------------- Work ---------------------------------- */

export const pillars = [
  {
    id: '01',
    title: 'Definition before deployment',
    body:
      'Nothing is sent until the account map, the qualification bar and the target math are agreed in writing. If we cannot describe who should buy and why now, we have no business contacting them.'
  },
  {
    id: '02',
    title: 'Research that earns the reply',
    body:
      'Every account is read before it is contacted: funding, hiring, tooling, org changes, and the trigger that makes this the right week rather than some week.'
  },
  {
    id: '03',
    title: 'Cadence built per segment',
    body:
      'Email, phone, LinkedIn and direct outreach sequenced differently for enterprise, mid-market and product-led motions. One cadence for all three is a rounding error pretending to be a strategy.'
  },
  {
    id: '04',
    title: 'Qualification you can audit',
    body:
      'MEDDICC, BANT or your own framework, applied consistently, recorded on the call, scored, and reviewed with your account executives every Friday.'
  },
  {
    id: '05',
    title: 'Reporting without varnish',
    body:
      'One dashboard, refreshed nightly: meetings set, meetings held, pipeline created, and a written note on what we stopped doing and why.'
  }
]

export const engagements = [
  {
    tag: 'Logistics software',
    title: 'Rebuilt outbound after a stalled quarter',
    body:
      'A 40-person team with a full CRM and an empty calendar. We rewrote the account map, cut the target list by 62%, and rebuilt the cadence around shipment-volume triggers.',
    metrics: [
      { value: '3.1×', label: 'Meetings held per month' },
      { value: '62%', label: 'Smaller target list' },
      { value: '19 days', label: 'To first held meeting' }
    ]
  },
  {
    tag: 'Clinical operations',
    title: 'Inbound response inside five minutes',
    body:
      'Demo requests were sitting for eleven hours. We staffed a two-person response pod across two time zones with qualification scripted against their compliance criteria.',
    metrics: [
      { value: '4m 10s', label: 'Median response time' },
      { value: '+48%', label: 'Demo-to-opportunity rate' },
      { value: '0', label: 'Unworked inbounds' }
    ]
  },
  {
    tag: 'Industrial automation',
    title: 'Operations rebuilt before headcount added',
    body:
      'They wanted four more reps. They needed routing, deduplication and a forecast that matched reality. We fixed the system first, then added two specialists.',
    metrics: [
      { value: '11k', label: 'Duplicate records merged' },
      { value: '±6%', label: 'Forecast accuracy' },
      { value: '2', label: 'Hires instead of four' }
    ]
  }
]

export const capabilities = [
  { area: 'Research', detail: 'Account mapping, ICP definition, intent and trigger monitoring, list architecture' },
  { area: 'Outbound', detail: 'Email, phone, LinkedIn, direct mail, sequence design and copy testing' },
  { area: 'Operations', detail: 'CRM administration, routing, deduplication, attribution, forecasting' },
  { area: 'Qualification', detail: 'MEDDICC, BANT, CHAMP or bespoke frameworks, call scoring and review' },
  { area: 'Lifecycle', detail: 'Onboarding, activation, expansion plays, renewal and churn-signal work' },
  { area: 'Reporting', detail: 'Nightly dashboards, weekly written reviews, quarterly business reviews' }
]

/* ------------------------------- Testimonials ------------------------------ */

export const featuredTestimonial = {
  quote:
    'We had run three outsourced pilots before this one and every single one ended with a spreadsheet of meetings nobody could verify. TheHaub handed us recordings, scores and a written note on what they had stopped doing. Month nine looks like month three, only bigger.',
  name: 'Adaeze Okafor',
  role: 'VP Revenue',
  company: 'Northbeam Logistics',
  avatar: images.avatars.a
}

export const testimonials = [
  {
    quote:
      'The first three weeks were almost entirely research and I hated it. Then the meetings started landing with people who already understood why we were calling.',
    name: 'Tomas Reinholt',
    role: 'Chief Commercial Officer',
    company: 'Halden Robotics',
    avatar: images.avatars.b
  },
  {
    quote:
      'Our inbound used to sit overnight. It now gets answered before the prospect closes the tab, and the qualification actually matches what our AEs want.',
    name: 'Priya Raghavan',
    role: 'Head of Growth',
    company: 'Corvara Health',
    avatar: images.avatars.c
  },
  {
    quote:
      'They told us not to hire the four reps we had budgeted. That advice cost them revenue and bought them a three-year relationship.',
    name: 'Daniel Osei',
    role: 'Founder',
    company: 'Solvent Labs',
    avatar: images.avatars.d
  },
  {
    quote:
      'The Friday review is the only recurring meeting on my calendar I have never cancelled. Wins, misses, and what changes on Monday.',
    name: 'Ingrid Halvorsen',
    role: 'VP Sales',
    company: 'Ledgerline',
    avatar: images.avatars.e
  },
  {
    quote:
      'Their operations lead found eleven thousand duplicate records we had been forecasting against. That single fix changed how the board read our numbers.',
    name: 'Marcus Bell',
    role: 'Director of RevOps',
    company: 'Meridian Freight',
    avatar: images.avatars.f
  },
  {
    quote:
      'Two specialists have been on our account for two years. They know our product better than half our new hires, and prospects can tell.',
    name: 'Sofia Marchetti',
    role: 'Chief of Staff',
    company: 'Kestrel Analytics',
    avatar: images.avatars.g
  }
]

export const outcomeStats = [
  { value: '94%', label: 'Client retention past year one' },
  { value: '2.7 yrs', label: 'Average specialist tenure on account' },
  { value: '1,180', label: 'Qualified meetings held in 2025' }
]

/* --------------------------------- Contact --------------------------------- */

export const faqs = [
  {
    q: 'What does an engagement cost?',
    a: 'Engagements start at a fixed monthly fee per embedded specialist, with a performance component tied to held meetings once the ramp period closes. There is no long-term lock; ninety days is the shortest arrangement that produces a fair read.'
  },
  {
    q: 'How quickly can a team start?',
    a: 'Recruitment against your role brief takes two to three weeks. From day one of the engagement, discovery and enablement run for a week, calibration for a week, and live volume opens in week three.'
  },
  {
    q: 'Do we keep the data and the accounts?',
    a: 'Always. Everything is built inside your CRM and sequencing tools. If the engagement ends, the account map, the sequences and the records stay with you.'
  },
  {
    q: 'Which markets do you cover?',
    a: 'North America, the UK and Ireland, the Nordics, ANZ and Southeast Asia, staffed to your prospects business hours rather than ours.'
  }
]
