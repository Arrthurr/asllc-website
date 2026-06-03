---
date: 2026-06-03
topic: story-scroll-redesign
---

# Story-Scroll Visual Redesign

## Summary

Redesign the Arturo Solo LLC marketing site as a **full-page, scroll-driven founder-builder story** inspired by the 21st.dev Story Scroll pattern. The experience should be bold, kinetic, typography-first, and centered on the promise: **working AI, built into your business**.

---

## Problem Frame

The June 2026 content pivot repositioned Arturo Solo LLC around founder-led AI implementation, but the current visual system still reads like a conventional services website: soft sections, modest typography, standard cards, and a familiar marketing-page rhythm. That undermines the intended differentiation because cold visitors can still bucket the business with generic AI consultants before they read deeply.

The earlier proof frame also risks becoming too narrow if it leans only on two visible shipped products. Arturo has public products, internal workflow builds, and tools in development; not all meaningful proof is screenshot-friendly. The redesign needs to make invisible workflow credibility legible without overstating unfinished work or turning the site into a generic logo wall.

The desired visitor reaction is not merely “this company offers AI services.” It is: **Arturo turns messy business bottlenecks into working AI systems, and I can bring him mine.**

---

## Actors

- A1. **Cold discovery visitor:** Arrives without prior trust and quickly judges whether Arturo is a real builder or another AI consultant.
- A2. **Business owner / operator:** Has a concrete workflow bottleneck but may not know what an AI implementation should look like.
- A3. **Arturo Solo LLC:** Needs the site to communicate founder-builder credibility, real-world operating experience, and an approachable path to first contact.

---

## Key Flows

- F1. **Cold visitor story scroll**
  - **Trigger:** A visitor lands on the homepage from search, social, referral, or direct traffic.
  - **Actors:** A1, A3
  - **Steps:** Visitor sees the “working AI” opening promise, scrolls through proof that bottlenecks become systems, sees real-world context for visible and invisible work, understands the AI Jumpstart as the entry point, and reaches a final CTA.
  - **Outcome:** Visitor leaves with a builder/shipped-systems impression or continues into contact with a specific bottleneck in mind.
  - **Covered by:** R1, R2, R3, R4, R5, R9

- F2. **Operator inquiry path**
  - **Trigger:** A visitor reaches the final CTA and wants to start a conversation.
  - **Actors:** A2, A3
  - **Steps:** Visitor exits the scroll story into a standard contact section, reads warmer guidance, completes the existing inquiry form, and submits without animation or layout friction.
  - **Outcome:** Contact remains reliable, accessible, and conversion-oriented even though the preceding experience is highly stylized.
  - **Covered by:** R8, R10, R11

- F3. **Reduced-motion or mobile visitor path**
  - **Trigger:** Visitor uses a mobile device or has `prefers-reduced-motion: reduce` enabled.
  - **Actors:** A1, A2
  - **Steps:** Visitor receives the same narrative content in a simplified, readable form without relying on pinned scroll, intense motion, or desktop-only layout behavior.
  - **Outcome:** The story remains understandable and contact remains reachable.
  - **Covered by:** R6, R7, R8, R10

```diagram
╭────────────╮   ╭────────────────╮   ╭──────────────╮   ╭──────────────╮
│ Landing    │──▶│ Story panels   │──▶│ Final CTA    │──▶│ Contact form │
│ promise    │   │ proof + offer  │   │ bottleneck   │   │ warm + stable│
╰────────────╯   ╰────────────────╯   ╰──────────────╯   ╰──────────────╯
```

---

## Requirements

**Narrative and positioning**
- R1. The homepage must become a full Story Scroll-style narrative experience, not a lightly polished version of the existing stacked brochure layout.
- R2. The opening promise must emphasize **working AI** built into the visitor's business, supported by contrast language such as “not decks,” “not demos,” and “tools that run.”
- R3. The core proof model must be **hybrid proof**: public products, internal workflow builds, generally described AI tools in development, and compact real-world client/context signals.
- R4. The proof story must avoid implying Arturo has only built two things; visible products are examples within a broader pattern of turning bottlenecks into systems.
- R5. The narrative must include the AI Jumpstart as the commercial entry point: one practical workflow, built until it runs, as the first step into larger AI work.

**Visual language and motion**
- R6. The visual direction must be bold, kinetic, and typography-first: oversized headlines, strong color panels, arrows/numbers/symbolic transitions, and minimal reliance on screenshots or literal product mockups.
- R7. Motion must be controlled kinetic: transitions should feel energetic, but each panel must settle into a readable state before asking the visitor to absorb key copy.
- R8. Mobile and reduced-motion experiences must preserve the same story in a simplified, readable form without broken pinned panels, scroll traps, or inaccessible content.

**Credibility and supporting proof**
- R9. Logos and context words may appear as a compact supporting credibility moment, but they must not become a generic “trusted by” section or dominate the proof hierarchy.
- R10. In-development products must be mentioned only generally, not named or presented as finished portfolio items.

**Conversion and chrome**
- R11. The final scroll panel must point visitors toward action with a blunt CTA such as “bring me the bottleneck,” then immediately transition into a standard contact section.
- R12. The contact section must shift warmer and more conversational than the scroll panels while preserving the existing reliable inquiry path.
- R13. The header must remain minimal, adaptive, and legible across changing panel backgrounds; it should support orientation and contact access without flattening the immersive story.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R6.** Given a cold visitor lands on the homepage, when they view the first panel, they immediately encounter a bold typographic “working AI” promise rather than a conventional services hero.
- AE2. **Covers R3, R4, R9.** Given the visitor reaches the proof sequence, when they scan it quickly, they understand that proof includes public products, internal workflows, real operational contexts, and tools in development—not only two visible portfolio items.
- AE3. **Covers R7.** Given a visitor scrolls through the story, when a panel transition completes, the main headline and support line are stationary/readable long enough to understand before the next beat.
- AE4. **Covers R8.** Given a visitor has reduced motion enabled or uses a small screen, when they navigate the homepage, all story content remains readable and the contact form remains reachable without depending on pinned scroll behavior.
- AE5. **Covers R11, R12.** Given a visitor reaches the final CTA, when they continue scrolling, they arrive at a standard, warm contact form rather than an animated form trapped inside the final story panel.
- AE6. **Covers R13.** Given the header overlays different color panels, when the visitor scrolls between them, the logo/name and contact affordance remain legible and do not obscure primary story copy.

---

## Success Criteria

- A cold visitor describing the site in one sentence uses language like **builder**, **working AI**, **systems**, **shipped**, or **bottlenecks**, not generic consultant/agency language.
- The site feels visibly distinct from the current version and from generic SMB IT or AI consultant templates.
- The proof feels broader than two public products while remaining truthful and non-inflated.
- The final contact path feels approachable and remains reliable despite the more dramatic scroll experience.
- A downstream planner can proceed without inventing the primary audience, proof model, motion intensity, contact placement, or logo/context treatment.

---

## Scope Boundaries

### Deferred for later

- Named treatment of the two in-development products; v1 mentions them generally only.
- Product screenshots, UI mockups, founder photography, or a visual case-study system.
- A deeper portfolio or case-study page for public products and internal workflow examples.
- Blog, FAQ, privacy, terms, or other secondary site destinations.

### Outside this product's identity

- A generic client-logo trust strip as a major page section.
- A screenshot-heavy SaaS landing page aesthetic.
- Positioning Arturo Solo LLC as a generic AI consultant, dev shop, M365/cloud admin vendor, or website agency.
- Inflated claims about unfinished products, vague AI transformation, or “trusted by” language that overstates the available proof.

---

## Key Decisions

- **Full Story Scroll over hybrid/static redesign:** The redesign prioritizes distinctiveness and memorability over incremental visual polish.
- **Bold and kinetic, but readable:** The site should feel alive without making visitors fight the motion.
- **Abstract kinetic type over product visuals:** The core experience is poster-like typography and motion, not screenshots or mock dashboards.
- **Hybrid proof model:** Public products, internal workflow builds, tools in development, and compact logo/context signals together better represent the business than product proof alone.
- **Warm contact after blunt story:** The scroll story creates conviction; the contact section should reduce friction and feel human.
- **Adaptive header:** Persistent orientation and contact access matter, but the header should visually adapt to each panel instead of behaving like a conventional solid nav bar.

---

## Dependencies / Assumptions

- The existing site remains a React/Vite/Tailwind marketing site; no platform migration is assumed.
- The referenced 21st.dev Story Scroll component is compatible with the current stack, but the later implementation plan must account for its animation dependencies and browser-only scroll behavior.
- Existing Netlify contact form behavior should be preserved.
- Existing June 2026 AI consultancy pivot content remains the messaging baseline unless the build reveals copy gaps.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R6, R7][Design] Exact panel count, panel order, and color sequence.
- [Affects R9][Content] Which logos and context words are safe, accurate, and visually subordinate enough for the real-operations panel.
- [Affects R8][Technical] The precise mobile and reduced-motion behavior for the Story Scroll experience.
- [Affects R13][Design] The exact adaptive header contrast rules per panel.
- [Affects R12][Technical] Any contact-form adjustments needed to preserve Netlify detection and submission reliability after the redesign.

---

## Human Understanding Checklist

- [x] Understand why the current site feels too plain: conventional brochure structure, soft visual language, and insufficient first-impression differentiation.
- [x] Understand why Story Scroll is compatible with the current stack but introduces animation planning considerations.
- [x] Understand why product-only proof is too narrow and why the redesign uses hybrid proof instead.
- [x] Understand why logos/context returned to scope as supporting evidence for invisible workflow work.
- [x] Understand why in-development tools are mentioned generally rather than named.
- [x] Understand why the contact form remains standard and warmer after the blunt scroll story.
- [x] Understand why controlled kinetic motion, mobile fallback, and reduced-motion behavior are core requirements rather than implementation polish.
