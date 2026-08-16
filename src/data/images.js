// All imagery is temporary Unsplash placeholder art.
// Swap the URLs here and every page updates. Nothing else references Unsplash directly.

const u = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const images = {
  // Home
  heroPrimary: u('1497366754035-f200968a6e72', 1800),
  heroSecondary: u('1521737604893-d14cc237f11d', 900),
  approach: u('1552664730-d307ca884978', 1400),
  clients: u('1517245386807-bb43f82c33c4', 1400),

  // About
  aboutLead: u('1600880292203-757bb62b4baf', 1400),
  aboutStory: u('1542744173-8e7e53415bb0', 1400),
  aboutMission: u('1519389950473-47ba0277781c', 1400),

  // Work: field gallery
  work: [
    { src: u('1454165804606-c3d57bc86b40', 1200), alt: 'Account planning session around a shared dashboard', caption: 'Account planning, Q3 cycle' },
    { src: u('1531482615713-2afd69097998', 1200), alt: 'Specialist reviewing an outbound sequence on screen', caption: 'Sequence review, mid-market pod' },
    { src: u('1556761175-b413da4baf72', 1200), alt: 'Team standing over a whiteboard of territory maps', caption: 'Territory mapping workshop' },
    { src: u('1497366811353-6870744d04b2', 1200), alt: 'Operations desk with live pipeline reporting', caption: 'Live pipeline desk' },
    { src: u('1600880292089-90a7e086ee0c', 1200), alt: 'Specialist on a discovery call taking notes', caption: 'Discovery call, recorded and scored' },
    { src: u('1517048676732-d65bc937f952', 1200), alt: 'Weekly business review in a meeting room', caption: 'Friday review with client AEs' }
  ],

  // People
  founder: u('1560250097-0b93528c311a', 800)
}

export default images
