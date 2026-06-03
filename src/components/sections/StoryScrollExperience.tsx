import React from 'react';
import StoryScroll from '../ui/story-scroll';
import StoryPanel from './StoryPanel';

const proofLogos = [
  { name: 'HG Jones Associates', logo: '/clients/hg-jones.png' },
  { name: 'DMDL', logo: '/clients/dmdl.png' },
  { name: 'Joy for Books', logo: '/clients/joy-for-books.png' },
  { name: 'Darklight', logo: '/clients/darklight.png' },
];

const panels = [
  {
    label: 'Opening promise',
    eyebrow: 'Arturo Solo LLC · AI build studio',
    heading: 'Working AI. In your business.',
    body: 'Not another deck. Not a demo that dies after the meeting. I build the first useful AI system into the way your team already works.',
    number: '01',
    theme: 'accent' as const,
    variant: 'center' as const,
    isOpening: true,
    bullets: ['Built to run', 'Scoped to one real bottleneck', 'Delivered as a working workflow'],
  },
  {
    label: 'Bottlenecks become systems',
    eyebrow: 'The shift',
    heading: 'Your messy process is the map.',
    body: 'Inbox triage, handoffs, reporting, follow-up, data cleanup—the work people avoid is usually where the first AI win lives.',
    number: '02',
    theme: 'dark' as const,
    bullets: ['Find the repeatable drag', 'Turn it into a small system', 'Keep humans in control where judgment matters'],
  },
  {
    label: 'Real-world proof',
    eyebrow: 'Proof model',
    heading: 'Products, workflows, operations.',
    body: 'The evidence is not one portfolio tile. It is public products shipped, internal workflows built, real client contexts, and AI tools currently being developed carefully—not oversold.',
    number: '03',
    theme: 'light' as const,
    variant: 'proof' as const,
    contextWords: ['public products', 'internal workflows', 'small business ops', 'data tools', 'AI builds in development'],
    proofLogos,
  },
  {
    label: 'Method',
    eyebrow: 'How the work moves',
    heading: 'Scope small. Build real. Learn fast.',
    body: 'We pick one bottleneck, design the smallest useful workflow, ship it into the business, then use the result—not guesses—to choose the next build.',
    number: '04',
    theme: 'dark' as const,
    bullets: ['Map the job', 'Build the workflow', 'Put it in front of real use', 'Decide the next system from evidence'],
  },
  {
    label: 'AI Jumpstart offer',
    eyebrow: 'Commercial entry point',
    heading: 'Start with an AI Jumpstart.',
    body: 'A focused first engagement for operators who need a working AI workflow, not a strategy fog. You bring the bottleneck. I build the first running version.',
    number: '05',
    theme: 'accent' as const,
    variant: 'offer' as const,
    bullets: ['One high-leverage workflow', 'Clear build boundary', 'A real handoff, not a PDF', 'A path to the next useful build'],
  },
  {
    label: 'Why Arturo',
    eyebrow: 'Founder speed',
    heading: 'Solo-builder speed. Operator patience.',
    body: 'I use AI-native tools to design, build, and ship software myself—then bring that same practical build rhythm to small businesses that need momentum without theater.',
    number: '06',
    theme: 'light' as const,
    bullets: ['Hands on keyboards', 'Plain-language decisions', 'No generic AI transformation pitch'],
  },
  {
    label: 'Final call to action',
    eyebrow: 'Bring the bottleneck',
    heading: 'Show me the work that keeps slipping.',
    body: 'If there is a process your team repeats, delays, copies, cleans, checks, or forgets, that is enough to start a useful conversation.',
    number: '07',
    theme: 'dark' as const,
    variant: 'final' as const,
    cta: { label: 'Start the conversation', href: '#contact' },
  },
];

const StoryScrollExperience: React.FC = () => {
  return (
    <div id="top">
      <StoryScroll>
        {panels.map((panel) => (
          <StoryPanel key={panel.number} {...panel} />
        ))}
      </StoryScroll>
    </div>
  );
};

export default StoryScrollExperience;
