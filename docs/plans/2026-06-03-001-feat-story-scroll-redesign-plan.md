---
title: "feat: Redesign homepage with story scroll"
type: feat
status: completed
date: 2026-06-03
origin: docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md
---

# feat: Redesign homepage with story scroll

## Summary

Implement the Story Scroll redesign as a new homepage experience: a GSAP-powered, typography-first narrative surface followed by a standard warm contact form. The plan replaces the old stacked marketing route with a full scroll story, preserves Netlify contact reliability, and treats mobile/reduced-motion behavior as core delivery rather than polish.

---

## Problem Frame

The current site has the right AI-build-studio copy direction, but the page structure still reads like a conventional brochure. The implementation must turn the requirements into a distinctive scroll-driven experience without breaking the practical conversion path or overstating proof.

---

## Requirements

- R1. Homepage becomes a full Story Scroll-style narrative experience, not a restyled stacked brochure.
- R2. Opening promise emphasizes **working AI** built into the visitor's business, with blunt contrast against decks/demos.
- R3. Proof model is hybrid: public products, internal workflow builds, generally described tools in development, and compact real-world client/context signals.
- R4. Proof must not imply Arturo has only built two things.
- R5. Narrative includes AI Jumpstart as the commercial entry point.
- R6. Visual direction is bold, kinetic, typography-first, and minimally screenshot-dependent.
- R7. Motion is controlled kinetic with readable settled states.
- R8. Mobile and reduced-motion visitors receive the same story in a simplified readable form.
- R9. Logos/context appear only as subordinate real-world credibility, not a generic “trusted by” section.
- R10. In-development products are mentioned generally, not named as finished work.
- R11. Final story panel points to action, then transitions immediately into a standard contact section.
- R12. Contact section is warmer and conversational while preserving the existing inquiry path.
- R13. Header remains minimal, adaptive, and legible across changing panels.

**Origin actors:** A1 cold discovery visitor, A2 business owner/operator, A3 Arturo Solo LLC.

**Origin flows:** F1 cold visitor story scroll, F2 operator inquiry path, F3 reduced-motion or mobile visitor path.

**Origin acceptance examples:** AE1 opening promise, AE2 hybrid proof, AE3 readable motion, AE4 mobile/reduced motion, AE5 contact after CTA, AE6 adaptive header.

---

## Scope Boundaries

### Deferred for later

- Named treatment of the two in-development products; v1 mentions them generally only.
- Product screenshots, UI mockups, founder photography, or a visual case-study system.
- A deeper portfolio/case-study page for public products and internal workflow examples.
- Blog, FAQ, privacy, terms, or other secondary site destinations.

### Outside this product's identity

- Generic client-logo trust strip as a major page section.
- Screenshot-heavy SaaS landing page aesthetic.
- Positioning Arturo Solo LLC as a generic AI consultant, dev shop, M365/cloud admin vendor, or website agency.
- Inflated claims about unfinished products, vague AI transformation, or overstated “trusted by” language.

### Deferred to Follow-Up Work

- Adding an automated browser test suite; this repo currently has build/lint scripts but no test runner.
- Extracting all page copy into a CMS/content module; a local panel data object is enough for this redesign.

---

## Context & Research

### Relevant Code and Patterns

- `src/App.tsx` currently composes independent stacked sections; the redesign should recompose this route around a story surface plus contact rather than mutating each old section into scroll behavior.
- `src/components/layout/Layout.tsx` always renders `Header`, `Footer`, and `BackToTop`; those overlays need story-aware behavior.
- `src/components/layout/Header.tsx` currently switches only on `scrollY > 50`; adaptive contrast needs a panel-aware signal.
- `src/components/sections/Contact.tsx` is the visible Netlify form and intentionally lets native submission proceed.
- `index.html` contains the hidden Netlify detection form and already has AI-build-studio metadata/options; preserve matching field names and option values.
- `public/clients/*.png` contains existing logo assets; use only a compact subset/context treatment.
- `src/index.css` sets global smooth scrolling; add reduced-motion handling so users who opt out are not forced into animated scrolling.

### Institutional Learnings

- `docs/plans/2026-06-01-001-feat-ai-consultancy-pivot-plan.md` identified Netlify form synchronization as a load-bearing risk. In this repo's current state, the static detection surface is `index.html`; there is no `public/contact.html` file to synchronize.
- The June pivot intentionally demoted M365/cloud services and established AI Jumpstart as the entry offer. This plan preserves that positioning instead of re-litigating it.

### External References

- 21st.dev Story Scroll registry: `https://21st.dev/r/boudjadjasamira/story-scroll` declares `gsap` and `@gsap/react`, uses GSAP `ScrollTrigger`, and includes `prefers-reduced-motion` detection.

---

## Key Technical Decisions

- **Introduce GSAP only for the story primitive:** The chosen component pattern depends on GSAP ScrollTrigger; keep Framer Motion for existing non-story surfaces rather than rewriting all motion.
- **Build a new story section instead of transforming old sections in place:** A dedicated story experience gives the redesign a clear boundary and keeps old section components available for reference or rollback.
- **Use local story-panel content data:** Centralizing the seven panel beats in one module/component keeps proof language synchronized without a broad content architecture refactor.
- **Mobile/reduced-motion fallback is built into the story component:** The fallback should render the same panels as readable stacked content instead of relying on pinned scroll behavior.
- **Make header adaptation panel-aware:** Use story-panel theme signals or intersection state, not only global scroll position, so the header stays legible over orange/dark/light panels.
- **Preserve native Netlify submission:** Do not introduce client-side form submission or `preventDefault`; keep the existing form-name, field names, honeypot, and `/success` action intact.

---

## Open Questions

### Resolved During Planning

- **Exact panel count:** Plan for seven story panels from the requirements: open, transformation, real-world proof, method, offer, why Arturo, final CTA.
- **Logo/context treatment:** Use a small mixed credibility moment inside the real-operations panel; no full client section on the homepage.
- **Contact placement:** Keep the contact form after the final CTA, outside the pinned story panels.
- **Animation library:** Add GSAP for Story Scroll because the referenced component requires it; keep existing Framer Motion patterns elsewhere.

### Deferred to Implementation

- **Exact panel copy and color sequence:** Implementer should refine wording and color assignments while preserving the required story beats and truthful proof model.
- **Header contrast mechanism:** Implementer may choose a panel-theme callback, intersection observer, or equivalent robust mechanism after integrating the story component.
- **Final logo subset:** Implementer should select only logos/context words that are accurate and visually subordinate.

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```diagram
╭──────────────╮
│ App route    │
╰──────┬───────╯
       ▼
╭──────────────────────╮      panel theme       ╭────────────────╮
│ StoryScrollExperience│───────────────────────▶│ Adaptive Header│
│ 7 narrative panels   │                        │ contrast state │
╰──────────┬───────────╯                        ╰────────────────╯
           ▼
╭──────────────────────╮
│ Contact section      │  native Netlify POST
│ warm, standard form  │───────────────────────▶ /success
╰──────────────────────╯
```

Desktop/tablet uses the Story Scroll primitive with pinned/rotational transitions. Mobile and reduced-motion render the same content as stacked full-width panels with no pinning.

---

## Implementation Units

### U1. Add Story Scroll primitive and animation dependency

**Goal:** Add the GSAP-based Story Scroll foundation in a way that works in Vite React and cleans up ScrollTrigger instances correctly.

**Requirements:** R1, R7, R8; supports F1, F3, AE3, AE4.

**Dependencies:** None.

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/ui/story-scroll.tsx`

**Approach:**
- Install `gsap` and `@gsap/react` as runtime dependencies.
- Adapt the 21st.dev registry component for this Vite app: remove any Next-only assumptions that are not meaningful here, keep browser API usage inside effects, and ensure ScrollTrigger registration is safe.
- Preserve the reduced-motion gate and improve typing as needed for React/TypeScript.
- Ensure each panel can expose a semantic section label and a stable data attribute for animation and header coordination.

**Patterns to follow:**
- `src/components/ui/button.tsx` and `src/components/ui/Section.tsx` for small reusable UI primitives.
- `src/lib/utils.ts` for class merging if conditional classes are needed.

**Test scenarios:**
- Happy path: rendering three story sections creates a normal DOM sequence with accessible section labels and no runtime errors.
- Covers AE3. Desktop/non-reduced-motion mode initializes scroll triggers and cleans them up when the component unmounts.
- Covers AE4. Reduced-motion mode skips pin/rotation setup but still renders every section in order.
- Edge case: zero or one child section renders without throwing or creating invalid ScrollTrigger behavior.

**Verification:** TypeScript build succeeds; lint passes; a local browser render can scroll through sections without console errors or stuck pinned panels.

---

### U2. Build story content and panel component

**Goal:** Create the seven-panel typography-first narrative with the agreed proof model, voice, and CTA progression.

**Requirements:** R2, R3, R4, R5, R6, R9, R10, R11; supports F1, AE1, AE2, AE5.

**Dependencies:** U1.

**Files:**
- Create: `src/components/sections/StoryScrollExperience.tsx`
- Create or modify: `src/components/sections/StoryPanel.tsx` if a separate presentational component keeps the story readable.
- Modify: `src/index.css` if global story typography/utilities are needed.

**Approach:**
- Define panel data for: open, bottlenecks become systems, real operations, method, AI Jumpstart, founder speed, bring me the bottleneck.
- Use blunt, short, manifesto-like headings inside panels; keep support copy concrete and truthful.
- Include proof language that says “public products,” “internal workflows,” and “AI tools in development” generally, without naming unfinished products.
- Add the mixed logo/context moment only in the real-operations panel, visually subordinate to the headline and context words.
- Prefer bold typographic composition, large panel numbers, arrows/symbols, and strong color fields over screenshots/cards.

**Patterns to follow:**
- Existing local arrays in `src/components/sections/Services.tsx`, `Clients.tsx`, and `CaseStudies.tsx` for section-local content data.
- Existing Tailwind-first styling and `container` utility from `src/index.css`.

**Test scenarios:**
- Covers AE1. First panel contains the “working AI” promise and contrast language, not a conventional services hero.
- Covers AE2. Proof panels communicate public products + internal workflows + real operational context + tools in development without implying only two built items.
- Covers AE5. Final panel points toward `#contact` and does not contain the contact form itself.
- Copy audit: no panel uses generic “AI transformation” hype, names unfinished products, or presents logos as a dominant “trusted by” strip.

**Verification:** Story panel sequence can be understood by scanning headlines; proof copy is broader than two products while remaining truthful.

---

### U3. Recompose the homepage route

**Goal:** Replace the old stacked homepage composition with the story experience followed immediately by the warm contact section.

**Requirements:** R1, R11, R12; supports F1, F2, AE5.

**Dependencies:** U2.

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/sections/Contact.tsx`
- Reference only: `src/components/sections/Hero.tsx`, `Services.tsx`, `About.tsx`, `Clients.tsx`, `CaseStudies.tsx`

**Approach:**
- Update `App` so the homepage renders `StoryScrollExperience` and `Contact`, rather than the old stacked sections.
- Keep old section files in the repo unless implementation shows they create build/lint issues; removing them is not required for the redesign and would make rollback harder.
- Rewrite the contact section heading/helper text to be warmer and bottleneck-oriented, while preserving the form structure.
- Keep `id="contact"` stable for header/final CTA anchors.

**Patterns to follow:**
- Existing `App.tsx` route composition.
- Existing `Contact.tsx` controlled form state and native submit behavior.

**Test scenarios:**
- Covers AE5. Homepage DOM order is story experience first, contact section immediately after.
- Old `Hero`, `Services`, `About`, `Clients`, and `CaseStudies` sections do not appear on the main route after recomposition.
- Contact copy shifts warmer/conversational and invites a bottleneck without using the blunt manifesto tone for every form instruction.
- Contact anchor from final story CTA scrolls to the standard form section.

**Verification:** Homepage visually exits the story into the contact form; no duplicate legacy sections remain visible on `/`.

---

### U4. Preserve and verify Netlify contact form reliability

**Goal:** Ensure the warmer contact section and route recomposition do not break Netlify form detection or native submission.

**Requirements:** R11, R12; supports F2, AE5.

**Dependencies:** U3.

**Files:**
- Modify only if needed: `src/components/sections/Contact.tsx`
- Verify: `index.html`
- Verify: `src/components/pages/Success.tsx`
- Verify: `public/_redirects`

**Approach:**
- Preserve visible form attributes: `name="contact"`, `method="POST"`, `action="/success"`, `data-netlify="true"`, honeypot, hidden `form-name`, and existing field names.
- Keep `handleSubmit` non-blocking; do not add `preventDefault` or client-side submission.
- Compare visible `select` options with the hidden form in `index.html`; they already match the AI Jumpstart pivot and should remain synchronized.
- Confirm `/success` still renders through `src/main.tsx` routing.

**Patterns to follow:**
- Existing Contact form implementation.
- Existing hidden Netlify form in `index.html`.

**Test scenarios:**
- Form markup contains all Netlify-required attributes and hidden fields after copy/layout edits.
- Visible form field names match hidden form field names: `name`, `email`, `company`, `service`, `message`, and `bot-field`.
- Visible service option values match `index.html` exactly.
- Submitting does not call `preventDefault`; native form POST can navigate to `/success`.

**Verification:** Static markup inspection confirms Netlify detection compatibility; manual browser form submission in a local/preview environment reaches the success route when network handling allows native navigation.

---

### U5. Make header, footer, and overlays story-compatible

**Goal:** Adapt site chrome so it supports the immersive story without obscuring content or becoming illegible.

**Requirements:** R13; supports F1, F2, AE6.

**Dependencies:** U2, U3.

**Files:**
- Modify: `src/components/layout/Layout.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/ui/Logo.tsx` if variant support needs expansion.
- Modify: `src/components/ui/BackToTop.tsx` if it conflicts visually with story panels.

**Approach:**
- Replace or augment the current `scrollY > 50` header styling with story-aware contrast state.
- Keep the header minimal: logo/name and contact affordance are enough for the story route; avoid resurrecting the old multi-section nav as the primary story chrome.
- Ensure mobile menu behavior does not lock users inside a pinned scroll state; if the homepage header is simplified, the mobile menu can be simplified too.
- Update Footer links so they do not point to removed homepage sections (`#services`, `#about`, `#work`, `#clients`) unless those anchors still exist in the story/contact structure.
- Decide whether `BackToTop` should remain visible over the story; if retained, verify it does not clash with the final CTA/contact area.

**Patterns to follow:**
- Existing `Header` state/effect style, but with panel-aware state rather than only scroll threshold.
- Existing `Logo` light/dark variant.

**Test scenarios:**
- Covers AE6. Header text/logo/contact link remains legible over orange, dark, and light panels.
- Header does not obscure primary panel headlines at desktop or mobile sizes.
- Header contact affordance navigates to `#contact` after the story.
- Footer contains no links to anchors removed from the homepage, or those anchors are intentionally preserved.
- Mobile menu open/close does not leave `document.body.style.overflow` stuck after closing.

**Verification:** Manual scroll review across every panel confirms header contrast and overlay behavior; keyboard users can still reach contact.

---

### U6. Add reduced-motion and mobile fallback behavior

**Goal:** Ensure visitors who use mobile or request reduced motion receive the same story content without pinning, scroll traps, or excessive animation.

**Requirements:** R7, R8; supports F3, AE3, AE4.

**Dependencies:** U1, U2, U3, U5.

**Files:**
- Modify: `src/components/ui/story-scroll.tsx`
- Modify: `src/components/sections/StoryScrollExperience.tsx`
- Modify: `src/index.css`
- Modify if needed: `src/components/ui/BackToTop.tsx`

**Approach:**
- Add CSS `@media (prefers-reduced-motion: reduce)` to disable global smooth scrolling and unnecessary transitions.
- Ensure the Story Scroll primitive can render a static/stacked layout when reduced motion is active.
- Add a mobile breakpoint fallback that avoids pinned panels if the desktop interaction is too constrained on small screens.
- Keep content order identical between animated and fallback modes so the story is not a separate experience.

**Patterns to follow:**
- Existing responsive Tailwind classes and `container` utility.
- 21st.dev component's existing reduced-motion check.

**Test scenarios:**
- Covers AE4. With reduced motion enabled, every panel renders in order as readable stacked content and no ScrollTrigger pinning occurs.
- Covers AE4. On a mobile viewport, the visitor can scroll from first panel to contact without horizontal overflow or trapped scroll.
- Global smooth scroll is disabled under reduced motion.
- Back-to-top behavior, if retained, does not force smooth animated scrolling for reduced-motion users.

**Verification:** Manual desktop, mobile, and reduced-motion browser checks confirm readable story content and reachable contact.

---

### U7. Visual polish, accessibility pass, and verification

**Goal:** Finish the design to the agreed visual thesis and verify the full homepage experience across build, lint, accessibility basics, and browser review.

**Requirements:** R1-R13; supports all flows and AE1-AE6.

**Dependencies:** U1-U6.

**Files:**
- Modify as needed: `src/index.css`
- Modify as needed: `tailwind.config.js`
- Verify: `src/App.tsx`
- Verify: `src/components/sections/StoryScrollExperience.tsx`
- Verify: `src/components/sections/Contact.tsx`
- Verify: `src/components/layout/Header.tsx`

**Approach:**
- Apply final spacing, type scale, color contrast, focus states, and panel rhythm after the functional story is in place.
- Prefer Tailwind classes and existing tokens; use targeted CSS only for global reduced-motion, story-specific typography, or browser quirks that Tailwind cannot express cleanly.
- Validate that there is one clear H1-equivalent opening promise and semantic sections for each story beat.
- Perform a visual review against the thesis: bold kinetic type, not SaaS cards; proof broad but truthful; warm contact finish.

**Patterns to follow:**
- `ce-frontend-design` guidance: poster-like first viewport, cardless where possible, visible focus states, contrast, and visual verification.

**Test scenarios:**
- Covers AE1-AE6. A reviewer can scan the page and map each acceptance example to visible behavior.
- Lint/build: the app compiles with the new dependency and no TypeScript/ESLint errors.
- Accessibility basics: interactive elements have visible focus states; section labels/headings are meaningful; color contrast is legible on each panel.
- Visual desktop: story has controlled kinetic motion with readable settled panels.
- Visual mobile/reduced motion: story is readable, contact is reachable, and no layout overflow is visible.

**Verification:** `npm run lint` and `npm run build` pass; one browser visual pass on desktop and mobile confirms the design thesis and no glaring layout issues.

---

## System-Wide Impact

- **Interaction graph:** `App` route composition changes from many independent sections to story + contact; `Header` needs panel/theme awareness; `Contact` remains the submission endpoint.
- **Error propagation:** GSAP/ScrollTrigger setup failures should not prevent content from rendering; fallback/static content must remain in the DOM.
- **State lifecycle risks:** ScrollTrigger instances and header panel observers must clean up on unmount to avoid stale pinned state during route changes.
- **API surface parity:** No backend API changes. Netlify form field names and `/success` route remain unchanged.
- **Integration coverage:** Manual browser verification is required because no test runner exists and scroll/pinning behavior is visual/integration-heavy.
- **Unchanged invariants:** React Router paths `/` and `/success` remain; contact form semantics remain native POST; public client assets remain available.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Story Scroll adds a second animation library | Scope GSAP to `story-scroll.tsx`; keep Framer Motion for existing non-story animation only. |
| Pinned scroll breaks mobile or reduced-motion users | Build stacked fallback into the story component and verify mobile/reduced-motion as core scenarios. |
| Header becomes illegible over high-contrast panels | Make header state panel-aware and verify contrast per panel. |
| Proof reads like only two products | Use hybrid proof copy and subordinate context/logos; audit copy against R3/R4/R10. |
| Netlify form submission regresses | Preserve native form attributes/field names and verify visible/hidden forms remain synchronized. |
| Design becomes visually loud but vague | Keep each panel to one job with a concrete support line; proof and contact language must stay specific. |

---

## Documentation / Operational Notes

- No public documentation update is required for v1; this is a website implementation.
- PR/demo evidence should include screenshots or a short recording of desktop story scroll plus mobile/reduced-motion fallback.
- If final implementation chooses a different mobile fallback than stacked panels, document that decision in the PR because it affects a core requirement.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md](../brainstorms/2026-06-03-story-scroll-redesign-requirements.md)
- Prior positioning plan: [docs/plans/2026-06-01-001-feat-ai-consultancy-pivot-plan.md](2026-06-01-001-feat-ai-consultancy-pivot-plan.md)
- Homepage composition: `src/App.tsx`
- Layout chrome: `src/components/layout/Layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
- Contact form: `src/components/sections/Contact.tsx`, `index.html`
- 21st.dev Story Scroll registry: `https://21st.dev/r/boudjadjasamira/story-scroll`
