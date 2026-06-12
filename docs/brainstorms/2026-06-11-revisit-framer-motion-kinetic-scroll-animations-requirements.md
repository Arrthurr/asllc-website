---
date: 2026-06-11
topic: revisit-framer-motion-kinetic-scroll-animations
---

# Revisit Framer Motion (or Equivalent) to Restore Kinetic Scroll-Section Animations

## Summary

Decide whether to restore Framer Motion (or a minimal equivalent) to recover perceptible animated transitions when scrolling through the homepage story sections, or to close the gap between the current implementation and the "bold, kinetic" experience the redesign was built around—while treating the no-regression-on-performance constraint as hard and preserving the single-runtime-engine architecture.

## Problem Frame

The June 2026 story-scroll redesign (see `docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md`) intentionally made the homepage a full-page, scroll-driven founder-builder narrative. R6 and R7 explicitly required a "bold, kinetic, and typography-first" visual language with "controlled kinetic" motion: energetic transitions that still let each panel settle into a readable state. Success criteria included the site feeling "visibly distinct" from generic templates, with the dramatic persuasion happening inside the StoryScrollExperience.

Framer Motion was later removed (eeb5fc1) after a series of refactors that ported its seven micro-interaction sites to CSS + `tailwindcss-animate` + the new `useExitTransition` hook, leaving GSAP scoped exclusively to the story-scroll primitive. The stated reasons were overlap with the already-present GSAP engine and the bundle having reached the optimal size limit before performance would be affected. The drop plan and resulting solutions doc (`docs/solutions/tooling-decisions/drop-framer-motion-for-css-and-gsap.md`) treated the change as behavior-preserving ("like-for-like") and recorded the explicit rule: do not reintroduce Framer Motion or another general-purpose runtime animation dependency for non-story surfaces.

Commit fbf0bc8 (the focus of this brainstorm) synced the story-scroll solutions doc and understanding checklist with the removal and performed a small refactor of the viewport measurement logic (extract `escalateIfExceeds`, improved rAF cleanup, simplified `useStackedLayout` condition). That logic, combined with `forceStack` (reduced-motion || mobile || overflow), makes the full GSAP pinned/scrub panel transitions (yPercent, opacity, scale, rotateX, snap) intentionally conditional. On viewports where any panel content exceeds the viewport height, or on mobile/reduced-motion, the experience falls back to normal stacked scrolling with no special animation.

The user now observes that the site "no longer has any animation effect when we scroll through the sections" and that the redesign was based on the animated transitions that are gone. The tension is real: the product bet (distinctive, memorable kinetic first impression for cold visitors) appears to be in conflict with the engineering constraints (perf, bundle, content integrity, reduced-motion correctness, maintainability) that drove the removal and the fbf0bc8 robustness work.

## Actors

- A1. Cold discovery visitor: lands on the homepage and forms an immediate impression from the scroll experience; the "builder who ships working systems" positioning depends on the kinetic, typography-first feel landing before they reach the contact form.
- A2. Business operator with a real bottleneck: needs to absorb the proof narrative while scrolling; broken or absent motion must not hide or fatigue the content.
- A3. The site (Arturo Solo LLC): must deliver the redesign's distinctiveness promise without regressing load performance or accessibility invariants that would hurt first impressions or SEO/conversion.

## Key Flows

- F1. Desktop non-reduced-motion visitor scrolling the story
  - Trigger: visitor reaches the homepage on a qualifying desktop viewport.
  - Steps: StoryScroll measures panels, enables GSAP pin + scrub if no overflow; panels transition with transforms/opacity/scale/rotate as scroll progresses; header theme updates per panel; visitor reaches final CTA and exits into Contact.
  - Outcome: the scroll feels energetic and controlled-kinetic per R7; each panel settles readable; visitor leaves with the intended "working AI in your business" conviction.
  - Covered by: R1, R2, R3 (from redesign), plus the new decision criteria here.
- F2. Mobile, reduced-motion, or overflow viewport visitor scrolling the story
  - Trigger: any of the forceStack conditions or post-measurement escalation.
  - Steps: all panels render as normal relative stacked content; no GSAP pin or scrub; global CSS reduced-motion rule (if applicable) collapses any remaining transitions; visitor reads the full narrative in linear order and reaches Contact.
  - Outcome: same narrative and proof, fully accessible and non-fatiguing, even if the kinetic layer is absent.
  - Covered by: R8 (redesign), the two-layer reduced-motion strategy, and fbf0bc8 one-way stacked fallback.
- F3. Scroll into supporting surfaces (Contact, etc.)
  - Trigger: visitor continues past the story or arrives via direct anchor.
  - Steps: Section/Contact wrappers use intersection-observer + tailwindcss-animate fade/slide entrances (with documented stagger); micro-interactions (Card hover, BackToTop, Header menu) use CSS or useExitTransition.
  - Outcome: consistent, lightweight motion that respects the global reduced-motion rule and does not require a second runtime engine.
  - Covered by: the post-removal parity mappings.

## Requirements

**Core decision constraints (perf and architecture are non-negotiable)**

- R1. Any path that restores animation effects for scroll sections must not increase the production gzipped JS bundle size or introduce measurable layout/jank costs on first load or during the scroll experience.
- R2. GSAP remains the single runtime animation engine and is scoped exclusively to `src/components/ui/story-scroll.tsx` (and its direct consumers inside the story primitive). No general-purpose runtime animation library is reintroduced for non-story surfaces or for additional story content orchestration.
- R3. The one-way stacked fallback, `forceStack` rules (reduced-motion, mobile, overflow), `inert`/`aria-hidden` invariants for inactive pinned panels, and the global `prefers-reduced-motion` CSS rule (zeroing both duration and delay) remain unchanged. Kinetic animation is deliberately unavailable when it would clip content or violate a11y.

**Redesign kinetic intent must be honored or explicitly adjusted**

- R4. If the current implementation (GSAP scrub/pin when active + CSS in-view for supporting sections) is not producing the "bold, kinetic" scroll-through effect that the redesign requirements and success criteria were based on, the gap must be closed—either by faithful enhancements within the existing constraints or by an explicit, documented adjustment to the redesign vision.
- R5. "Animation effect when we scroll through the sections" is defined in the context of the seven story panels (the primary homepage sections) plus the immediate supporting scroll-in surfaces (Contact). The decision must name which specific behaviors are required (panel transitions, per-element reveals inside panels, scroll-triggered entrances, etc.) so downstream work has a clear target.
- R6. The Contact section and other non-story surfaces that received CSS ports during the removal must continue to receive the documented entrance/stagger/hover behaviors (or better) without a runtime library.

**Evaluation and durability**

- R7. The decision must be durable: it either produces a concrete remediation plan (within constraints) that planning can execute, or it produces explicit updates to `docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md`, `docs/solutions/design-patterns/story-scroll-founder-builder-homepage.md`, and/or the tooling decision doc so future agents do not re-fight the same tension from stale guidance.
- R8. Success is measured by the original redesign success criteria still being achievable: a cold visitor describes the site with builder/shipped/systems language, and the page feels visibly distinct without hidden content or perf regressions.

## Key Decisions

- **Kinetic motion is a product feature of the redesign, not implementation polish.** R6/R7 and the "visibly distinct" success criteria make the animated scroll experience load-bearing for positioning. Treating the loss as "just how the stack is now" would silently abandon a stated differentiator.
- **The fbf0bc8 measurement changes are a feature, not a bug for this decision.** They protect content and a11y by forcing stacked when panels would clip. Any "restore animation" path must either accept that many real desktops will still see stacked (and therefore needs strong stacked-mode personality) or change the measurement rules only if content integrity is preserved.
- **Like-for-like port was the removal contract; perceived loss means either a fidelity gap or a vision/execution mismatch.** The drop plan and solutions doc documented exact Framer parameters carried forward. If the story GSAP (which was never FM) plus the CSS ports do not deliver the redesign's kinetic promise, the right remedy is diagnosed within the current architecture first.
- **Perf is a hard floor, not a preference.** The user's opening and the entire removal record treat "do not sacrifice performance" as non-negotiable. Approaches that re-add ~30-40 kB gz (or equivalent) are out of scope unless they demonstrably deliver net-negative cost (e.g. via tree-shaking or removal of other weight)—which is unlikely for a marketing site.

## Scope Boundaries

### Deferred for later

- Named treatment or deeper visuals for the two in-development products (already deferred in the original redesign).
- A full portfolio/case-study system or additional pages that might justify richer animation tooling.
- Extracting shared animation utilities beyond the current `useExitTransition` and the inline media-query in story-scroll (if a future need arises).
- Performance budgets or bundle analysis tooling beyond what was used in the drop plan.

### Outside this product's identity

- Re-adding Framer Motion (or any general-purpose runtime animation library) as a broad dependency for micro-interactions or non-story surfaces.
- Accepting any increase in cold-load JS weight or introducing rAF-driven motion outside the explicitly scoped story primitive.
- Creating separate mobile or reduced-motion "stories" with different content (the redesign and solutions doc require the same narrative, just different presentation).
- Trapping conversion or essential content behind animation (the Contact form must remain native and immediately usable after the story).

## Dependencies / Assumptions

- The existing stack (Vite/React/Tailwind, GSAP + @gsap/react for story, react-intersection-observer + tailwindcss-animate for one-shot enters, useExitTransition for presence) remains the baseline.
- The homepage route composition (StoryScrollExperience followed immediately by Contact, no re-introduction of old brochure sections) is unchanged.
- "Performance" here means primarily production gzipped JS bundle size and perceived first-load/scroll jank on the marketing site; other metrics (e.g. INP during scrub) are relevant but secondary to the size limit cited in the removal.
- The user's observation of "no animation effect" is on real or representative viewports (not an artificial narrow desktop that would always stack).

## Acceptance Examples

- AE1. (Covers R1, R3, R5) Given a desktop visitor on a viewport where all panels fit, when they scroll the story, they experience the GSAP-driven panel transitions (or an approved equivalent within constraints) that feel energetic yet settle into readable states; the same visitor on a slightly taller viewport or with reduced-motion enabled sees the fully readable stacked version with no clipped content and no stranded elements.
- AE2. (Covers R2, R4) The solutions/design-patterns and tooling-decision docs are updated (or left unchanged with clear rationale) so a future agent scanning for "animation" guidance sees a single consistent story: GSAP scoped to story, CSS + hook everywhere else, kinetic intent either achieved within those rules or explicitly adjusted.
- AE3. (Covers R1, R8) After any remediation, a production build measurement shows no increase in total gzipped JS+CSS versus the post-removal baseline, and the four CI gates (lint, test, build, e2e) plus the manual kinetic/stacked/reduced-motion checklist continue to pass.
- AE4. (Covers redesign R7 + new R4) When a panel transition (or stacked scroll) completes, the primary headline and supporting copy are stationary and readable long enough for a cold visitor to absorb the key claim before the next beat; no essential proof or CTA is hidden behind motion.

## Success Criteria

- The requirements doc enables a planner to produce an implementation (or a "no change + doc update") plan without inventing whether the kinetic feel is still a must-have or what "scroll through the sections" animation means.
- Future agents (or the same team in 3 months) can look at the homepage and the linked redesign + tooling docs and immediately understand the current trade-off state and why.
- The cold-visitor first-impression goal from the redesign remains credible: either the site still feels distinctively kinetic where it can, or the docs make the deliberate choice visible.

## Outstanding Questions

### Resolve Before Planning

- What exact animation behaviors are missing or insufficient when the user scrolls the story panels on their test/viewport setup? (E.g. pinned GSAP panel transitions never activate because of the fbf0bc8 escalate logic; GSAP transitions are active but the scrub/easing/settle feel is not "kinetic" enough; content inside panels never animates on progress; the Contact/Section scroll-ins are the primary loss.)
- On representative production viewports (e.g. 1440×900 or 1512×982 laptop screens with default fonts), does the story ever enter pinned kinetic mode, or does the measurement almost always escalate to stacked?

### Deferred to Planning

- If the gap is "pinned mode too rarely active," what (if any) safe adjustments to measurement timing, thresholds, or panel content height are acceptable while preserving the one-way stacked and no-clip invariants?
- If the gap is fidelity of the existing GSAP or CSS ports, which specific parameters/effects from the original FM-era prototypes (or the redesign vision) should be recovered using only the allowed mechanisms?
- Whether a small amount of additional GSAP usage *inside* the story panels (still in the same file) to orchestrate child elements would be in or out of the "scope GSAP to the story primitive" rule.

## Sources / Research

- `docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md` — origin of kinetic requirements (R6, R7), success criteria, and cold-visitor flow.
- `docs/solutions/design-patterns/story-scroll-founder-builder-homepage.md` — binding pattern: GSAP scoped to story-scroll.tsx only; no general runtime lib; two-layer reduced-motion; stacked fallback as core behavior.
- `docs/solutions/tooling-decisions/drop-framer-motion-for-css-and-gsap.md` — the decision record, per-surface migration map, ~30-40 kB net target, "do not reintroduce" guidance, and why CSS rules do not stop GSAP.
- `docs/plans/2026-06-09-001-refactor-drop-framer-motion-plan.md` — detailed like-for-like contract, bundle measurement numbers (framer chunk 40.68 kB gz), manual checklist, and explicit statement that GSAP was left untouched.
- Commit `fbf0bc8` — the focused commit: doc sync removing stale MotionConfig references + story-scroll refactor (escalateIfExceeds, inner rAF cancel, simplified useStackedLayout) that directly controls when the kinetic pinned animation is allowed.
- `src/components/ui/story-scroll.tsx` (current) — GSAP ScrollTrigger pin/scrub/snap + forceStack + measurement + stacked fallback.
- `src/components/ui/Section.tsx`, `src/components/sections/Contact.tsx`, `src/hooks/useExitTransition.ts`, `src/index.css` — the post-removal CSS + intersection + hook implementations.
- `package.json` — current deps confirm framer-motion absent, gsap/@gsap/react + react-intersection-observer + tailwindcss-animate present.
- `e2e/homepage.spec.ts` and test mocks — reduced-motion always stacks; IntersectionObserver and gsap are stubbed in unit tests.

---

**Note on process:** This brainstorm was initiated with a richly-specified prompt focused on a specific commit and the tension between redesign intent and the removal constraints. The scoping synthesis above was derived from that prompt plus direct verification of the linked artifacts and current source. No durable decisions beyond the framing and boundaries were forced without user confirmation.