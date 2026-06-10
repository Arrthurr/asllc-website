---
title: Story Scroll Founder-Builder Homepage Pattern
date: 2026-06-03
category: docs/solutions/design-patterns
module: Homepage story-scroll redesign
problem_type: design_pattern
component: development_workflow
severity: medium
applies_when:
  - A conventional marketing homepage needs to communicate founder-builder credibility rather than generic services positioning.
  - A scroll-driven visual redesign must preserve truthful proof, accessible fallback behavior, and a reliable contact path.
  - The business needs a bold first impression without trapping conversion inside animation.
related_components:
  - React homepage route
  - StoryScrollExperience
  - StoryScroll
  - Header
  - Contact
tags: [story-scroll, homepage-redesign, ai-positioning, scroll-driven-ui, mobile-fallback, reduced-motion, netlify-forms, founder-builder]
---

# Story Scroll Founder-Builder Homepage Pattern

## Context

The June 2026 positioning work moved Arturo Solo LLC away from commodity M365/cloud-support messaging and toward a founder-led AI build studio. The first website pivot changed the copy, but the page still had the rhythm of a conventional services brochure: stacked sections, modest typography, service cards, proof cards, and a familiar agency layout.

That mismatch created the core design problem: cold visitors could still categorize the business as another generic AI consultant before they absorbed the deeper “builder who ships working systems” message.

The redesign worked because it treated the homepage as one narrative product surface, not as a restyled set of old sections:

```diagram
╭──────────────────────╮     ╭──────────────────────╮     ╭──────────────────────╮
│ StoryScrollExperience│────▶│ Final bottleneck CTA │────▶│ Warm Contact section │
│ bold founder story   │     │ blunt persuasion     │     │ native Netlify POST  │
╰──────────────────────╯     ╰──────────────────────╯     ╰──────────────────────╯
```

Prior session context confirmed the positioning reason for this shape: M365/cloud work is useful as a trust signal, but it should not remain the service-menu headline. The website needs to speak “AI builder,” while operational history supports credibility in the background. (session history)

## Guidance

Use the Story Scroll as the persuasion surface, then exit into a normal contact section.

The homepage composition should stay intentionally small:

```tsx
// src/App.tsx
<MotionConfig reducedMotion="user">
  <Layout>
    <StoryScrollExperience />
    <Contact />
  </Layout>
</MotionConfig>
```

Do not reintroduce the old `Hero`, `Services`, `About`, `Clients`, or `CaseStudies` sections into the main route unless the product strategy changes. Keeping those sections out of the route is what prevents the page from slipping back into a standard agency brochure.

Keep the seven story beats local and auditable in `StoryScrollExperience`:

1. Opening promise
2. Bottlenecks become systems
3. Real-world proof
4. Method
5. AI Jumpstart offer
6. Why Arturo
7. Final CTA

This local data-object approach is the right abstraction for this repo. It keeps panel order, proof language, themes, and CTA copy easy to inspect without adding a CMS or content architecture.

Preserve the hybrid proof model. The proof panel should communicate a broader builder pattern without overstating unfinished work:

```tsx
heading: 'Products, workflows, operations.',
body: 'The evidence is not one portfolio tile. It is public products shipped, internal workflows built, real client contexts, and AI tools currently being developed carefully—not oversold.',
contextWords: ['public products', 'internal workflows', 'small business ops', 'data tools', 'AI builds in development'],
proofLogos,
```

The logos are subordinate evidence. They support the “real operations” claim; they are not a generic “trusted by” strip.

Keep the tonal transition:

- Story panels can be blunt and manifesto-like: “Working AI. In your business.” / “Your messy process is the map.” / “Show me the work that keeps slipping.”
- Contact should be warmer and practical: “Tell me where the work gets stuck.” / “You do not need a polished AI idea.”

That boundary matters. The scroll story creates conviction; the contact section lowers friction.

Scope GSAP to the story primitive. `gsap` and `@gsap/react` belong in `src/components/ui/story-scroll.tsx`; keep Framer Motion for the existing non-story transitions.

Treat mobile and reduced-motion as core behavior, not polish:

```tsx
const forceStack = prefersReducedMotion || isMobile || panels.length <= 1;
const useStackedLayout =
  forceStack || contentExceedsViewport || (!forceStack && !measurementComplete);
```

Desktop can get pinned kinetic panels when every panel’s natural height fits within the viewport. Mobile, reduced-motion, and desktop overflow viewports get the same panels as readable stacked content. Measure in stacked geometry before enabling GSAP pin; default to stacked until measurement completes to avoid a flash of clipped pinned content. If any panel exceeds `document.documentElement.clientHeight`, fall back to stacked mode for the whole story (one-way per session). Do not create a separate mobile story, and do not hide essential content behind animation.

Make the fixed header panel-aware. A global `scrollY > 50` rule is not enough when the header crosses light, dark, and accent panels. The working pattern dispatches the active story theme from `StoryScroll`:

```tsx
window.dispatchEvent(
  new CustomEvent('story-theme-change', { detail: { theme } })
);
```

`Layout` listens for that event and passes `storyTheme` into `Header`. It also resets the header to the light theme as the visitor reaches Contact.

Preserve native Netlify form semantics. The visible form in `Contact.tsx` and the hidden detection form in `index.html` must stay synchronized:

- `name="contact"`
- `method="POST"`
- `action="/success"`
- `data-netlify="true"`
- `data-netlify-honeypot="bot-field"`
- hidden `form-name`
- hidden `subject`
- honeypot `bot-field`
- field names: `name`, `email`, `company`, `service`, `message`
- service option values: `ai-jumpstart`, `custom-ai-build`, `not-sure`

Do not call `preventDefault` in `handleSubmit`; the browser should perform the native POST.

## Why This Matters

The design works because it separates persuasion risk from conversion reliability.

The dramatic part of the page answers the brand problem: Arturo Solo LLC should feel like a solo builder of working AI systems, not a generic consultant, cloud admin vendor, or services agency. The page earns that by using oversized kinetic type, blunt bottleneck-first copy, and a proof model based on shipped products, internal workflows, client contexts, and careful in-development work.

The ordinary part of the page protects the business outcome: the inquiry path remains a standard, readable, native form. Visitors are not asked to submit through an animated panel, scroll trap, or client-side-only handler.

The most important invariant is:

```text
Dramatic persuasion happens in StoryScrollExperience.
Reliable conversion happens in Contact.
```

Breaking that boundary makes the site either less memorable or more fragile.

The accessibility and fallback rules also matter because scroll-driven designs can visually hide content while leaving it semantically reachable. In pinned desktop mode, inactive panels need `aria-hidden`/`inert`; in stacked fallback mode (mobile, reduced motion, or desktop overflow), all panels remain normal readable content with a single labelled landmark per panel on the wrapper — not duplicated on the inner `<section>`. The mode changes the interaction, not the message.

## When to Apply

Apply this pattern when a marketing page needs to communicate a sharp founder/product thesis rather than list conventional services.

It is especially appropriate when:

- the first impression matters more than exhaustive above-the-fold information density
- the offer is best understood as a transformation sequence
- the proof exists, but not all proof is screenshot-friendly
- the business needs to differentiate from generic consultants or agencies
- the conversion path must remain reliable despite an expressive top-of-page experience

Do not apply this pattern blindly when:

- the page needs dense pricing, comparison tables, FAQs, or SEO content above the fold
- the proof requires long-form case studies before the core claim is credible
- the team cannot manually verify desktop, mobile, and reduced-motion behavior
- the form, checkout, or other business-critical flow would be trapped inside animation
- the brand should feel quiet, institutional, or information-first

For this repo, preserve the pattern unless the strategy moves away from “AI build studio / working AI / bottleneck-to-system” positioning.

## Examples

The panel renderer is intentionally typography-first:

```tsx
// src/components/sections/StoryPanel.tsx
<HeadingTag className="mb-7 break-words text-[clamp(2.65rem,14vw,5.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.095em] md:text-[clamp(3.6rem,12vw,10.5rem)] md:leading-[0.82]">
  {heading}
</HeadingTag>
```

The story primitive snaps to whole panels so users do not park between overlapping states:

```tsx
snap: {
  snapTo: 1 / (panels.length - 1),
  duration: { min: 0.3, max: 0.6 },
  delay: 0.1,
  ease: 'power2.inOut',
  directional: false,
},
```

Inactive pinned panels are hidden semantically, not just visually:

```tsx
const isInactivePinnedPanel = !useStackedLayout && index !== activeIndex;

<div
  aria-hidden={isInactivePinnedPanel || undefined}
  {...(isInactivePinnedPanel ? { inert: '' } : {})}
>
  {panel}
</div>
```

This rule only applies in pinned mode. In stacked mobile/reduced-motion mode, every panel remains part of normal reading and focus order.

The root motion config makes Framer Motion respect reduced-motion preferences across the app:

```tsx
<MotionConfig reducedMotion="user">
  <Layout>
    <StoryScrollExperience />
    <Contact />
  </Layout>
</MotionConfig>
```

The contact form stays native:

```tsx
const handleSubmit = () => {
  setIsSubmitting(true);
  // Let the browser handle the native form submission
};
```

## Related

- `docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md` — origin requirements and acceptance examples.
- `docs/plans/2026-06-03-001-feat-story-scroll-redesign-plan.md` — implementation plan and risk model.
- `docs/story-scroll-redesign-understanding-checklist.md` — post-review fixes and human-understanding checklist.
- `docs/brainstorms/2026-06-01-ai-consultancy-pivot-requirements.md` — upstream AI build-studio positioning.
- `docs/plans/2026-06-01-001-feat-ai-consultancy-pivot-plan.md` — earlier pivot implementation and Netlify form-sync learning.
