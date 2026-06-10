---
title: "refactor: Drop framer-motion in favor of CSS + GSAP"
type: refactor
status: completed
date: 2026-06-09
---

# refactor: Drop framer-motion in favor of CSS + GSAP

## Summary

Remove the `framer-motion` dependency and reassign its uses to CSS (via the already-installed `tailwindcss-animate`) and a small reusable exit-transition hook. GSAP stays — it is load-bearing for the story-scroll and irreplaceable here. The isolated `framer-motion` chunk measured 40.68 kB gzipped; the *net* bundle saving will be somewhat less (the new hook + CSS classes add a little back, and the isolated-chunk figure is inflated by lost cross-module compression), so the honest expectation is a net cut on the order of ~30–40 kB gzipped, confirmed by before/after measurement in U6. This is a like-for-like swap: no intended change to visual or interaction behavior.

---

## Problem Frame

A bundle measurement (temporary `manualChunks` split, since reverted) showed the production JS splits into three named contributions: `framer-motion` at 40.68 kB gzipped, `gsap` (+`@gsap/react`) at 28.17 kB, and everything else (React, Radix, app code) at 85.27 kB. Framer Motion is the single largest dependency in the bundle — larger than GSAP — yet an audit of all seven import sites found every one is a small, declarative micro-interaction. The seven sites: the app-wide `<MotionConfig>` (`src/App.tsx`), a hover lift (`Card.tsx`), three mount-fades (`Contact.tsx` — which has **two** `motion.div` wrappers with a 0.2 s stagger between columns — `Success.tsx`, and a scroll-in fade in `Section.tsx`), and two `AnimatePresence` enter/exit toggles (`Header.tsx` mobile menu, `BackToTop.tsx`). None of these needs a ~40 kB declarative animation engine.

The two libraries do not overlap in capability — GSAP does the genuinely hard pinned/scrubbed/snapping scroll timeline; Framer Motion does chrome micro-interactions — so the decision is not "merge the two" but "retire the over-powered one." Dropping Framer Motion and reassigning its work to CSS + the GSAP already shipped is the lever that actually deletes bytes (chunk-splitting alone reshuffles them and, as measured, slightly increases total size from lost cross-module compression). One lighter-touch alternative — Framer Motion's `LazyMotion` + `m` API — was considered and rejected; see Alternatives Considered.

This work intentionally supersedes one prior documented decision: `docs/solutions/design-patterns/story-scroll-founder-builder-homepage.md` (2026-06-03) recorded "keep Framer Motion for existing non-story transitions." That guidance is now obsolete; the GSAP-scoping guidance from the same doc (GSAP confined to the story primitive) still holds and is preserved.

---

## Requirements

### Behavior preservation
- R1. No intended change to the visual appearance or interaction behavior of any animated surface (Card hover lift, Section scroll-in fade, Contact/Success mount fades incl. the Contact two-column stagger, Header mobile-menu open/close, BackToTop show/hide). Original Framer parameters are carried forward explicitly per unit (durations, easings, travel distances, scale, stagger).
- R2. The two unmount cases (Header mobile menu, BackToTop button) continue to animate *out* before leaving the DOM — not just snap away on unmount.
- R3. `prefers-reduced-motion` continues to be honored on every former-Framer surface, app-wide. CSS-driven animation is neutralized by the global rule in `src/index.css`; that rule is extended to also zero `animation-delay`/`transition-delay` so staggered enters and delayed exits collapse to near-instant for reduced-motion users.
- R4. The Header mobile-menu contrast treatment (white pill, `accent-deep`/`accent-deeper` tokens for text-on-accent) is preserved.
- R9. Every converted surface's default/resting DOM state is the fully-visible state, with motion expressed only as a transient enter/exit animation or transition — never a persistent hidden class that depends on JS to clear. The one exception, Section's in-view gate, must clear its hidden state within a bounded fallback if the IntersectionObserver never fires, so content can never be permanently stranded invisible.

### Dependency removal
- R5. `framer-motion` is removed from `package.json` dependencies and the lockfile, and no `framer-motion` import remains anywhere under `src/`.
- R6. `gsap`, `@gsap/react`, and the story-scroll machinery (`story-theme-change` event, `activeIndexRef` dedup, snap config, `normalizeScroll(true)`, `inert`/`aria-hidden` invariant) are left untouched.

### Validation
- R7. `npm run lint`, `npm run test` (Vitest), `npm run build`, and Playwright e2e (`npm run test:e2e`) all pass — the same four gates CI runs. Note the gates' limit: the unit suite forces `prefers-reduced-motion: reduce` and jsdom runs no real transitions, so the gates do **not** exercise normal-motion enter/exit timing. R1/R2 acceptance therefore also depends on the written manual checklist (see Manual Acceptance Checklist), plus the RTL exit-path tests added in U4/U5 that gate the strand/early-unmount failure modes via synthetic `transitionend`.
- R8. The production bundle is re-measured after removal: total gzipped JS+CSS of the normal (un-split) build, before vs. after, with the net delta recorded in the PR — not merely a confirmation that the isolated framer chunk is gone.

---

## Key Technical Decisions

- **Exit animations use a CSS-transition + delayed-unmount hook, not GSAP.** The two `AnimatePresence` cases need an element to animate out before unmounting. A small `useExitTransition` hook (render the element, drive enter/exit via a CSS class, unmount on `transitionend`) keeps the exit declarative and inherits the global reduced-motion CSS rule. Driving exits through GSAP would spread GSAP into UI chrome (currently scoped only to the story primitive) *and* require explicit JS reduced-motion guards, because CSS `prefers-reduced-motion` rules cannot stop GSAP's rAF-based transform writes.

- **Hook-driven surfaces use CSS transitions, not `tailwindcss-animate` keyframes.** `transitionend` fires for CSS *transitions*; `animate-in`/`animate-out` are CSS *animations* that fire `animationend`. The two hook consumers (Header menu, BackToTop) therefore toggle between an "out" and "entered" class pair on a `transition-*` element — not `animate-out`. `tailwindcss-animate` utilities (`animate-in fade-in slide-in-from-bottom-*`) are used only for the one-shot mount fades that have no exit (Contact, Success, Section). This split is load-bearing: using `animate-out` on a hook surface would mean `transitionend` never fires and every unmount falls back to the safety timer.

- **The exit hook must defend the edge cases `AnimatePresence` already handled.** Re-implementing presence is only "safer" if these are covered: (1) filter `transitionend` by `event.target === node` and a chosen `propertyName`, so a descendant's transition (e.g. the menu CTA's `transition-colors`) cannot bubble up and unmount the parent early, and so a multi-property transition (opacity + transform) unmounts once rather than twice; (2) attach with `{ once: true }` and remove the listener on re-entry, so rapid open→close→open cannot accumulate stale listeners; (3) a named safety-timeout constant (`EXIT_TRANSITION_FALLBACK_MS`, ~500 ms — longer than any transition here, short enough not to strand a visible element) covers the no-transition / interrupted-transition case; (4) re-entry while mid-exit cancels the pending unmount.

- **The five simple surfaces become pure CSS, with resting state visible.** `src/index.css` already forces `animation-duration`/`transition-duration` to `0.01ms` under `prefers-reduced-motion`; this work extends that block to also zero `animation-delay`/`transition-delay` (R3), so the Contact stagger and any delayed exit collapse correctly. Per R9, every converted surface rests at the visible state — a one-shot `animate-in` (resting = visible) or a transition from an "out" class to an "entered" class — never a class that pins it hidden. Removing `<MotionConfig reducedMotion="user">` drops nothing, because the (extended) global CSS rule provides the same guarantee for CSS-driven motion.

- **Original Framer parameters are carried forward, not re-felt.** Each unit names the exact duration / easing / distance / scale from the current Framer code so the swap is verifiably like-for-like rather than an eyeballed approximation. Where a `tailwindcss-animate` step maps to a pixel value (e.g. `slide-in-from-bottom-5` = 20 px on the default 4 px scale), the unit states the mapping to confirm; `animation-fill-mode: forwards` behavior of the plugin is verified so a one-shot fade doesn't snap back to opacity 0 at animation end.

- **The new hook lives in a new `src/hooks/` directory.** No `src/hooks/` exists today and the only shared helper is `src/lib/utils.ts`. A dedicated `src/hooks/` (one hook per file, imported via the `@/` alias) is the cleanest home for `useExitTransition`. The inline `useMediaQuery` in `story-scroll.tsx` is *not* extracted — the CSS conversions don't need it and the exit hook relies on `transitionend` + the safety timer, so leaving it inline keeps the blast radius off the story machinery.

---

## Implementation Units

### U1. Add the `useExitTransition` hook

- Goal: Provide a small reusable hook that keeps an element mounted through its exit transition, so `AnimatePresence` can be removed without losing exit animations.
- Requirements: R2, R3, R9
- Dependencies: none
- Files:
  - `src/hooks/useExitTransition.ts` (new)
  - `src/hooks/useExitTransition.test.tsx` (new)
- Approach: Hook takes a boolean `show` and returns what the consumer needs to render-and-class the element (e.g. `{ shouldRender, status }` where `status` is `entering`/`entered`/`exiting`, leaving class composition to the consumer). When `show` flips true: mount, then apply the entered class on the next animation frame. When `show` flips false: apply the "out" class and unmount when a qualifying `transitionend` fires. The listener must (a) check `event.target === node` and a chosen `propertyName` so descendant transitions and the second property of a two-property transition don't cause early/double unmount, (b) be attached with `{ once: true }` and torn down on re-entry. A `setTimeout(..., EXIT_TRANSITION_FALLBACK_MS)` (~500 ms, named constant) guarantees unmount if no qualifying `transitionend` arrives (no transition, `display:none`, interrupted). No GSAP; no `matchMedia` read (the extended global CSS rule + the fallback timer handle reduced motion — under reduced motion the ~0 ms transition makes `transitionend` fire near-instantly, and the timer backstops it).
- Patterns to follow: lazy state initializer from `src/components/ui/story-scroll.tsx:18` (`useState(() => ...)`); `@/` import alias (`vite.config.ts`).
- Test scenarios (jsdom runs no real transitions — dispatch synthetic `transitionend`):
  - Happy path: `show=true` on first render renders the element immediately at the entered state.
  - Exit timing: `true → false` keeps the element rendered until a qualifying `transitionend` (matching `target`/`propertyName`) fires, then unmounts.
  - Descendant bubble (negative): a `transitionend` whose `target` is a child node does NOT unmount the element.
  - Multi-property: two `transitionend` events (opacity, then transform) result in exactly one unmount, not a double-fire error.
  - Fallback: with no `transitionend`, the element unmounts after `EXIT_TRANSITION_FALLBACK_MS`.
  - Rapid re-entry: `false → true` before `transitionend`/timeout cancels the pending unmount, removes the stale listener, and keeps the element mounted.
- Verification: hook unit tests pass; the hook imports neither `framer-motion` nor `gsap`.

### U2. Convert simple mount/hover animations to CSS (Card, Contact, Success) and extend the reduced-motion rule

- Goal: Replace `motion.*` mount-fade and hover usages that have no exit semantics with CSS/Tailwind equivalents, carrying the original parameters forward; extend the global reduced-motion rule to cover delays.
- Requirements: R1, R3, R5, R9
- Dependencies: none
- Files:
  - `src/components/ui/Card.tsx`
  - `src/components/sections/Contact.tsx`
  - `src/components/pages/Success.tsx`
  - `src/index.css`
- Approach:
  - Card — replace `motion.div` + `whileHover={{ y: -5 }}` (Framer tween, `duration: 0.2`, default `easeOut`) with a plain `div` using `transition-transform duration-200 ease-out hover:-translate-y-[5px]` (matches 5 px exactly; `-translate-y-1` would be 4 px). The existing `hover:shadow-lg` stays.
  - Contact — two `motion.div` mount fades, the second with `delay: 0.2` (`Contact.tsx:51`, `:89`). Replace both with `animate-in fade-in slide-in-from-bottom-5 duration-[600ms] ease-out`; add `delay-200` to the second column wrapper to preserve the stagger. Verify `tailwindcss-animate` sets `animation-fill-mode: forwards` (or add `fill-mode-forwards`) so content rests visible.
  - Success — same one-shot mount fade as Contact's first wrapper.
  - `src/index.css` — extend the existing `@media (prefers-reduced-motion: reduce)` block to also set `animation-delay: 0.01ms !important; transition-delay: 0.01ms !important;` so the Contact stagger (and any delayed exit) collapses for reduced-motion users.
  - Remove the `framer-motion` import from the three components. Do not touch the Contact form's field structure, options, controlled input, or Netlify form semantics (no `preventDefault`).
- Patterns to follow: existing Tailwind/`cn`/`clsx` composition in these files; `tailwindcss-animate` utilities (`tailwind.config.js`); the existing reduced-motion block in `src/index.css`.
- Test scenarios:
  - Existing `src/components/sections/Contact.test.tsx` passes unchanged (asserts fields, options, controlled input — none touch the wrapper element type).
  - Existing `src/App.test.tsx` passes.
  - No assertion change needed; `motion.div` → `div` preserves children, roles, labels.
- Verification: Vitest + lint pass; no `framer-motion` import in these three files; manual spot-check of hover lift, both mount fades, and the Contact column stagger; reduced-motion check that the stagger collapses.

### U3. Convert Section scroll-in fade to CSS

- Goal: Replace the Section component's Framer `variants` + `inView` fade-up with a CSS animation triggered by the existing intersection-observer hook, without ever stranding content invisible.
- Requirements: R1, R3, R5, R9
- Dependencies: none
- Files:
  - `src/components/ui/Section.tsx`
- Approach: Keep the `useInView` trigger from `react-intersection-observer` (`triggerOnce: true`). Current Framer state: `initial='hidden'` (`opacity:0, y:20`) → `visible` (`duration:0.6, ease:'easeOut'`). Replace the `motion.div` + `variants` with a plain `div` that renders at `opacity-0` initially and, once `inView` is true, applies `animate-in fade-in slide-in-from-bottom-5 duration-[600ms] ease-out` (the animation's resting state is `opacity:1`, so no cleanup class is needed; verify the plugin's `fill-mode` leaves it visible). To honor R9, add a bounded fallback so the hidden state is cleared even if the observer never fires: either start the reveal on a short timer if `inView` has not flipped, or update the jsdom IntersectionObserver mock/test expectation so the test does not depend on a stuck `opacity-0`. Remove the `framer-motion` import.
- Patterns to follow: `tailwindcss-animate` utilities; conditional `cn(...)` composition already in the file; lazy-initializer pattern if a fallback timer is used.
- Test scenarios:
  - Content is reachable, not permanently hidden, under the jsdom IntersectionObserver mock (which never intersects) — i.e. the chosen fallback clears the hidden state, or the test asserts presence rather than visibility, consistent with R9.
  - The e2e heading-visibility assertions (headings render inside Sections) continue to pass — Playwright fires real intersection, so the reveal plays.
- Verification: Vitest + e2e pass; content visible (not stuck at opacity 0) under the test mock; no `framer-motion` import remains.

### U4. Replace Header mobile-menu AnimatePresence with the hook

- Goal: Remove `AnimatePresence`/`motion.div` from the Header mobile menu while preserving its open/close animation, timing, and contrast treatment.
- Requirements: R1, R2, R3, R4, R5, R9
- Dependencies: U1
- Files:
  - `src/components/layout/Header.tsx`
- Approach: Drive the mobile menu's mount/exit with `useExitTransition` keyed on `isMenuOpen`. Current Framer: `initial/exit {opacity:0, y:-20}`, `animate {opacity:1, y:0}`, `duration: 0.2`, default `easeOut`. Express as CSS transition classes: entered `opacity-100 translate-y-0`, out `opacity-0 -translate-y-5` (20 px), on `transition-[opacity,transform] duration-200 ease-out`. Preserve the scroll-lock effect, the resize-to-desktop close behavior, the white-pill button treatment and `accent` tokens, and the `storyTheme`/`logoVariant` logic untouched. Note the click-to-close path: the in-menu CTA is both `href="#contact"` and `onClick={() => setIsMenuOpen(false)}` — with the hook the menu now stays mounted ~200 ms while the scroll-lock releases and the anchor jump fires. Consider keying the scroll-lock `useEffect` off the hook's render state rather than raw `isMenuOpen`; verify the compose in the manual checklist.
- Patterns to follow: `useExitTransition` from U1; existing `cn(...)` conditional classes; the white-pill contrast treatment in `docs/story-scroll-redesign-understanding-checklist.md` (finding S3).
- Test scenarios:
  - RTL: with the menu open, flip the open state false and dispatch a qualifying `transitionend` on the menu wrapper → the menu unmounts; a `transitionend` from a child does NOT unmount it. (Gates the strand/early-unmount failure modes in CI despite forced reduced-motion.)
  - Manual (see checklist): open animates in; close animates out before unmount; rapid double-tap does not strand or double-unmount; closes on resize ≥768 px; body scroll-lock toggles; tapping the in-menu CTA lands on `#contact` and the menu exits cleanly; reduced-motion makes open/close near-instant.
- Verification: lint + build + the new RTL test pass; manual checklist passes at mobile width in normal and reduced-motion modes; no `framer-motion` import remains.

### U5. Replace BackToTop AnimatePresence with the hook

- Goal: Remove `AnimatePresence`/`motion.button` from BackToTop while preserving its show/hide (scale + fade) animation and timing.
- Requirements: R1, R2, R3, R5, R9
- Dependencies: U1
- Files:
  - `src/components/ui/BackToTop.tsx`
- Approach: Drive the button's mount/exit with `useExitTransition` keyed on `isVisible`. Current Framer: `initial/exit {opacity:0, scale:0.5}`, `animate {opacity:1, scale:1}`. Express as CSS transition classes: out `opacity-0 scale-50`, entered `opacity-100 scale-100`, on `transition-[opacity,transform] duration-200 ease-out`. Keep the existing scroll listener and the one-shot reduced-motion `matchMedia` read that selects `scrollTo` behavior (`auto` vs `smooth`). Remove the `framer-motion` import. Note: the scroll listener has no debounce, so the 300 px threshold can oscillate on momentum scroll, flipping `isVisible` rapidly; the U1 re-entry/listener-cleanup handling must absorb this. If manual testing shows jitter, add a ~100 ms debounce (a minor behavior change — note it in the PR).
- Patterns to follow: `useExitTransition` from U1; the existing `window.matchMedia('(prefers-reduced-motion: reduce)')` read at `src/components/ui/BackToTop.tsx:22` (leave as-is).
- Test scenarios:
  - RTL: with the button visible, flip `isVisible` false and dispatch a qualifying `transitionend` → unmounts; a child `transitionend` does not.
  - Manual (see checklist): scroll past 300 px shows it (scale+fade in); scroll back animates it out before unmount; rapid oscillation near 300 px does not strand or thrash; click scrolls to top (smooth normally, instant under reduced motion).
- Verification: lint + build + the new RTL test pass; manual checklist passes in both motion modes; no `framer-motion` import remains.

### U6. Remove MotionConfig and the framer-motion dependency; re-measure net bundle

- Goal: Remove the last Framer usage and the package itself, then confirm the net bundle saving.
- Requirements: R5, R6, R7, R8
- Dependencies: U2, U3, U4, U5 (every consumer must be converted first)
- Files:
  - `src/App.tsx`
  - `package.json`
  - `package-lock.json`
- Approach: Remove `<MotionConfig reducedMotion="user">` and its import from `src/App.tsx` (keep the `Layout`/`StoryScrollExperience`/`Contact` tree intact). Uninstall `framer-motion` (`npm uninstall framer-motion`) so it leaves `package.json` and the lockfile. Grep `src/` to confirm zero remaining `framer-motion` imports (R5). Run the full gate suite (R7). Measure total gzipped JS+CSS of the normal `npm run build` output before (current `main`) and after, and record the net delta in the PR (R8) — the isolated 40.68 kB chunk figure is the gross upper bound, not the net result.
- Patterns to follow: the temporary-`manualChunks`-then-revert split is for the *isolated* figure only; R8 wants the *un-split* total before/after, so just compare normal builds.
- Test scenarios:
  - Full suite: `npm run lint`, `npm run test`, `npm run build`, `npm run test:e2e` all pass.
  - e2e reduced-motion: the `[data-story-mode="stacked"]` assertion in `e2e/homepage.spec.ts:22` still passes (GSAP-owned, must be unaffected).
  - Grep: `grep -r "framer-motion" src/` returns nothing.
- Verification: all four CI gates green; `framer-motion` absent from `package.json` and lockfile; net before/after gzipped total recorded.

---

## Manual Acceptance Checklist

R7's automated gates cannot prove R1/R2 (forced reduced-motion + no real transitions in jsdom). This checklist is the actual guard for the converted surfaces and should be run in a real browser and attached to the PR. For each surface, in **normal motion**: the enter animation plays with the original feel; for the two exit surfaces, the exit plays fully before the element leaves the DOM (no snap, no strand). In **reduced motion** (OS setting on): each surface appears/disappears near-instant with no stranded or frozen element.

- Card: hover lifts ~5 px and settles; un-hover reverses.
- Section(s): fade-up on scroll-into-view; content always present even if the observer is slow/blocked.
- Contact: both columns fade in; second column trails the first (~0.2 s) in normal motion; stagger collapses under reduced motion.
- Success page: mount fade plays.
- Header mobile menu: open animates in; close animates out before unmount; rapid double-tap is stable; in-menu CTA lands on `#contact` and the menu exits cleanly; menu closes on resize to desktop; body scroll-lock toggles.
- BackToTop: appears (scale+fade) past 300 px; animates out before unmount on scroll-up; stable across rapid oscillation at the threshold; click returns to top (smooth normally, instant under reduced motion).

---

## Alternatives Considered

- **`LazyMotion` + `m` (framer-motion's lightweight API).** Framer ships `LazyMotion` with a `domAnimation`/`domMax` feature bundle and an `m` component that tree-shakes to roughly ~5 kB gzipped for exactly this micro-interaction profile, while keeping `AnimatePresence`'s battle-tested exit handling. It would preserve most of the byte saving with near-zero new code and no hand-rolled exit logic. Rejected for this work because: (1) the user's confirmed scope is to remove the dependency entirely, not slim it; (2) it keeps a Framer dependency in `package.json` (the thing being retired) and still requires migrating every `motion.*` to `m.*` under a `LazyMotion` provider; (3) the CSS/hook approach leaves the codebase with a single animation engine (GSAP) plus plain CSS, which is the simpler long-term surface. The trade-off is real — full removal costs more new code and a hand-rolled hook (see Risks). If the net measured saving in U6 turns out marginal over `LazyMotion`, revisit.
- **Chunk-split framer-motion only.** Rejected: measured to slightly *increase* total bytes (lost cross-module compression) and saves nothing on a cold load when the code is on the critical path. Caching-only benefit; does not meet the goal.

---

## Scope Boundaries

In scope: removing `framer-motion` and reassigning its seven import sites; adding one hook; extending the global reduced-motion CSS rule to cover delays; re-measuring the net bundle.

Not in scope:
- Touching the GSAP story-scroll machinery in any way (R6).
- Trimming GSAP itself or changing any GSAP animation.
- Any visual redesign or new animation — this is a behavior-preserving swap. (A debounce on the BackToTop scroll listener is permitted only if needed to keep the hook stable, and must be noted in the PR.)
- Extracting the inline `useMediaQuery` from `story-scroll.tsx` into a shared hook.
- Adding `aria-expanded`/`aria-controls` to the mobile-menu button (a pre-existing a11y gap, not introduced by this refactor).

### Deferred to Follow-Up Work
- Update `docs/solutions/design-patterns/story-scroll-founder-builder-homepage.md` to remove the now-obsolete "keep Framer Motion for non-story surfaces" guidance (best done via `/ce-compound` after this lands, so future agents don't reintroduce the dependency).
- Consider adding `aria-expanded`/`aria-controls` to the mobile-menu toggle (separate a11y improvement).

---

## Risks & Dependencies

- **A hand-rolled exit hook re-implements what `AnimatePresence` solved.** Lower line count is not automatically lower risk: the hook must handle bubbled/duplicate `transitionend`, multi-property completion, interrupted/absent transitions, and rapid re-entry. These are enumerated in the U1 KTD and covered by U1 + U4/U5 tests, but they are the real failure surface of this refactor. Mitigation: the edge-case test scenarios plus the manual checklist.
- **Behavior preservation is only partly CI-verifiable.** The unit suite runs in forced reduced-motion with no real transitions, so enter/exit *timing* is never exercised automatically (R7 note). Mitigation: RTL tests gate the strand/early-unmount logic via synthetic events; the Manual Acceptance Checklist guards the felt behavior.
- **Net saving < gross chunk figure.** The 40.68 kB is the isolated-chunk gross (inflated by lost cross-module compression); net of the new hook + CSS is smaller. Mitigation: R8 measures the un-split before/after total. If net is marginal, the `LazyMotion` alternative is the fallback to revisit.
- **GSAP must remain untouched.** The story-scroll, `story-theme-change` event, `inert`/`aria-hidden` invariant, and snap tuning are independent of Framer Motion; the e2e reduced-motion test guards the stacked fallback. Risk: low — no changed file touches GSAP.
- **Lint enforcement on new classes.** `eslint-plugin-tailwindcss` runs in CI and fails on invalid/misordered/unrecognized utility classes — confirm it recognizes the `tailwindcss-animate` utilities (`animate-in`, `slide-in-from-bottom-*`) and the arbitrary values (`duration-[600ms]`, `-translate-y-[5px]`). Mitigation: run `npm run lint` after each unit.

---

## Documentation / Operational Notes

- PR description should state the net before/after gzipped total (per R8), include the completed Manual Acceptance Checklist (or a short recording) since those interactions lack full automated coverage, and note any added scroll debounce.
- Commit/PR style follows the repo's Conventional Commits convention with scopes (e.g., `refactor(deps): remove framer-motion in favor of CSS + GSAP`).

---

## Sources / Research

- Bundle measurement (this session): `framer-motion` 122.86 kB raw / 40.68 kB gzipped; `gsap`+`@gsap/react` 71.50 kB / 28.17 kB; rest 248.71 kB / 85.27 kB — via temporary `manualChunks` split in `vite.config.ts`, since reverted. (Isolated-chunk gross; net is smaller — see R8.)
- Seven framer-motion import sites: `src/App.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Section.tsx`, `src/components/sections/Contact.tsx` (two `motion.div`s, `:47` and `:85`, second has `delay: 0.2`), `src/components/pages/Success.tsx`, `src/components/layout/Header.tsx`, `src/components/ui/BackToTop.tsx`.
- Original Framer parameters carried forward: Card `whileHover y:-5, duration:0.2`; Section `y:20, duration:0.6, ease:easeOut`; Header menu `y:-20, duration:0.2`; BackToTop `scale:0.5` enter/exit; Contact second column `delay:0.2`.
- Global reduced-motion CSS rule (zeroes `*-duration` but NOT `*-delay` today — extended in U2): `src/index.css`.
- `tailwindcss-animate` installed and configured (`animate-in`/`fade-in`/`slide-in-from-bottom-*`/`duration-*`/`delay-*`): `package.json`, `tailwind.config.js`.
- Reusable media-query / lazy-initializer pattern: `src/components/ui/story-scroll.tsx:18`.
- Test setup (mocks `gsap`/`@gsap/react`; `matchMedia` returns reduced-motion=true for all queries; stubs `IntersectionObserver` to never intersect; framer-motion not mocked): `src/test/setup.ts`.
- e2e reduced-motion stacked-mode assertion: `e2e/homepage.spec.ts:22`.
- Documented story-scroll constraints this refactor must preserve (and the one it supersedes): `docs/solutions/design-patterns/story-scroll-founder-builder-homepage.md`, `docs/story-scroll-redesign-understanding-checklist.md` (findings S2 "CSS rules do not stop JS/GSAP animations", S3 mobile-menu contrast).
- CI gate order (lint → test → build → e2e): `.github/workflows/ci.yml`.
- `transitionend`/`animationend` distinction and event bubbling/multi-property behavior underpin the U1 hook design and the transition-vs-`animate-out` KTD.
