import images from './images'

/* ---------------------------------- Home ---------------------------------- */

export const hero = {
  eyebrow: 'B2B appointment setting',
  headline: 'You close the deals.',
  headlineAccent: 'We fill the calendar.',
  body:
    'DealWorkx researches your market, runs the outreach across email, LinkedIn and phone, and books qualified meetings straight onto your reps’ calendars. First meetings inside thirty days.',
  disciplines: ['Appointment setting', 'Lead research', 'Outbound campaigns']
}

export const statement =
  'Building an in-house SDR desk costs six months and most of a quarter of a million dollars before the first meeting lands. We start booking in thirty days.'

export const services = [
  {
    id: '01',
    title: 'Lead research',
    body:
      'Your ideal customer defined narrowly, then built into a list of real people with verified contact details and a reason to hear from you this month.',
    points: ['ICP and account mapping', 'Verified contact data', 'Intent and hiring triggers']
  },
  {
    id: '02',
    title: 'Appointment setting',
    body:
      'Research, outreach and follow-up handled end to end. You get a confirmed meeting with a decision maker who knows why the call is happening.',
    points: ['Verified decision makers', 'Confirmed and reminded', 'Briefed before the call']
  },
  {
    id: '03',
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

// Industries rather than client names: the categories we book meetings in.
export const industries = [
  'Code Review & Deep Learning AI',
  'AI Code Generation & Testing Platforms',
  'Causal Machine Learning',
  'No-Code Data Exploration (MarTech)',
  'Developer Tooling & DevOps',
  'Data Infrastructure & Analytics',
  'Cloud Security & Compliance',
  'B2B SaaS & Enterprise Platforms'
]

/* ---------------------------------- About --------------------------------- */

export const about = {
  intro:
    'We started DealWorkx because good products kept losing to worse ones with fuller calendars. Pipeline is rarely a talent problem. It is a research and consistency problem, and that can be handed to someone else.',
  lead:
    "DealWorkx is a team of experienced Senior SDRs, led by founders who have lived through the evolution of B2B outreach from traditional prospecting to today's modern, technology-driven approach. We've combined the best of both worlds to create meaningful conversations and book qualified meetings for B2B companies.",
  mission:
    'Our job is to make the calendar predictable, so the people who build the product can stop guessing what next quarter looks like.'
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
