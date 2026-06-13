# AGENTS.md

## Collaboration Style

Act as a clear, effective teacher as well as an implementer. Help the human understand the problem, the solution, the design decisions, edge cases, and broader impact. Explain incrementally during substantial work instead of saving all context for the end.

When useful, keep or update a running checklist under `docs/` for what the human should understand. `docs/outstanding-tasks-understanding-checklist.md` is the current backlog-oriented checklist.

`docs/solutions/` contains reusable project learnings with YAML frontmatter (`module`, `tags`, `problem_type`). Read relevant solution docs before changing areas they cover.

## Project Shape

This is a Vite + React + TypeScript marketing site for Arturo Solo LLC. The current positioning is an AI build studio for small businesses: "working AI, built into your business."

The homepage is intentionally small:

```tsx
<Layout>
  <StoryScrollExperience />
  <Contact />
</Layout>
```

Do not reintroduce the old brochure-section route shape (`Hero`, `Services`, `About`, `Clients`, `CaseStudies`) unless the product strategy changes. The homepage should remain a story-scroll persuasion surface followed by a reliable contact section.

Important files:

- `src/App.tsx` composes the homepage.
- `src/components/sections/StoryScrollExperience.tsx` owns the seven story beats and proof data.
- `src/components/ui/story-scroll.tsx` owns all GSAP story-scroll behavior.
- `src/components/sections/StoryPanel.tsx` renders individual story panels.
- `src/components/layout/Layout.tsx` bridges story theme events into the fixed header.
- `src/components/layout/Header.tsx` renders adaptive desktop/mobile navigation.
- `src/components/sections/Contact.tsx` renders the visible Netlify form.
- `index.html` contains the hidden Netlify detection form.

## Story Scroll Invariants

The seven story beats are:

1. Opening promise
2. Bottlenecks become systems
3. Real-world proof
4. Method
5. AI Jumpstart offer
6. Why Arturo
7. Final CTA

Keep panel content local and auditable in `StoryScrollExperience`. A CMS or content abstraction is premature unless copy starts changing frequently.

Preserve the hybrid proof model: public products, internal workflows, real client contexts, and AI tools in development. Do not imply that unfinished products are finished portfolio items. Logos are subordinate proof, not a generic "trusted by" strip.

The tonal boundary matters:

- Story panels can be blunt and kinetic.
- Contact should be warmer, practical, and low-friction.

Core invariant:

```text
Dramatic persuasion happens in StoryScrollExperience.
Reliable conversion happens in Contact.
```

## Animation Architecture

GSAP and `@gsap/react` are scoped to `src/components/ui/story-scroll.tsx`. Do not spread GSAP to header, contact, cards, or other chrome.

Do not reintroduce Framer Motion or another general-purpose runtime animation library. Non-story motion should use CSS transitions, `tailwindcss-animate`, and `src/hooks/useExitTransition.ts` for mount/unmount exit transitions.

Story scroll has three modes:

- Pinned kinetic: `data-story-mode="pinned"` when all panels fit. Uses GSAP pin/scrub/snap.
- Stacked kinetic: `data-story-mode="stacked"`, `data-story-stack-reason="overflow"`, and `data-story-kinetic="stacked-scrub"` on desktop viewports where panels overflow. Uses per-panel GSAP scrub without pin or snap.
- Stacked static: mobile, reduced-motion, or single-panel. No GSAP timelines.

Measure panels in stacked geometry before enabling pinned mode. Default to stacked until measurement completes to avoid a flash of clipped pinned content. If any panel exceeds `document.documentElement.clientHeight`, the whole story falls back to stacked mode for the session.

Mobile and reduced-motion are core behavior, not polish. Reduced-motion users must never get pinned or stacked-scrub GSAP timelines.

Header theming depends on `story-theme-change` events from `StoryScroll`. If changing story mode or active-panel behavior, verify the header remains legible over light, dark, accent, and contact backgrounds.

## Accessibility Rules

Pinned inactive panels must be removed from the accessibility tree and focus order with `aria-hidden` and `inert`.

Stacked panels must remain normal readable content. Do not duplicate landmark labels on inner sections.

The mobile menu button should expose menu state and ownership with `aria-expanded` and `aria-controls`.

Placeholder links are not acceptable in production navigation. Current known cleanup areas include footer social/legal links and any `href="#"` contact metadata links.

## Netlify Form Rules

Preserve native Netlify form behavior. Do not call `preventDefault` in `Contact.tsx`; the browser should perform the native POST.

The visible form in `src/components/sections/Contact.tsx` and the hidden detection form in `index.html` must stay synchronized:

- `name="contact"`
- `method="POST"`
- `action="/success"`
- `data-netlify="true"`
- `data-netlify-honeypot="bot-field"`
- hidden `form-name`
- hidden `subject`
- honeypot `bot-field`
- fields: `name`, `email`, `company`, `service`, `message`
- service option values: `ai-jumpstart`, `custom-ai-build`, `not-sure`

## Verification

Use these commands before considering changes complete:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

Playwright may need permission to bind the local Vite preview server on `127.0.0.1:4173`.

Manual/visual checks matter after story or layout changes:

- 1512x856 desktop: stacked kinetic overflow mode should feel kinetic and preserve all panel content, especially proof logos/tags.
- 1512x1400 or similarly tall desktop: pinned kinetic mode should still work.
- Mobile: stacked static story should be readable.
- Reduced motion: stacked static story, no GSAP scrub.
- Contact form remains reachable after the story.

Track bundle size when changing animation or dependencies. The documented post-Framer baseline is approximately 121.60 kB gzipped JS+CSS from a normal Vite build; current builds should be compared against the same method.

## Current Backlog Signals

Most outstanding work is tracked in docs, not inline TODOs. See `docs/outstanding-tasks-understanding-checklist.md`.

Known outstanding tasks:

- Add `aria-expanded` and `aria-controls` to the mobile menu toggle.
- Replace/remove placeholder footer social links, privacy/terms anchors, and any other `href="#"` placeholders.
- Add real testimonials and a finished AI case study once there is truthful business input.
- Replace limited/provisional visuals with final screenshots, representative product imagery, and a founder headshot when available.
- Decide whether a deeper portfolio/case-study page is needed.
- Decide whether in-development products should be named publicly once ready.
- Consider extracting page copy into a content/config module only if copy churn increases.
- Consider in-panel child reveals only if boundary-only stacked kinetic motion feels too flat.
- Consider visual-regression GIF capture and INP/scroll-jank gates if animation regressions recur.

