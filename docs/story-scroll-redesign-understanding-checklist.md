# Story Scroll Redesign Understanding Checklist

Use this as the running checklist for what the human should understand about this implementation.

## Problem

- [ ] Why the old homepage read like a conventional stacked brochure.
- [ ] Why the redesign needs a narrative scroll surface instead of restyling old sections.
- [ ] Why proof language must be broader than two public examples but still truthful.
- [ ] Why mobile and reduced-motion behavior are core requirements, not polish.

## Solution

- [ ] How the GSAP Story Scroll primitive pins and transitions panels on desktop.
- [ ] How the same panels fall back to a normal stacked story on mobile/reduced motion.
- [ ] How panel theme state keeps the fixed header legible.
- [ ] Why the contact form remains a native Netlify POST with matching hidden detection fields.
- [ ] Why old sections stay in the repo but are no longer composed on the homepage.

## Broader Context

- [ ] How the new page positions Arturo Solo LLC as an AI build studio, not a generic consultancy.
- [ ] How AI Jumpstart becomes the concrete commercial entry point.
- [ ] What this impacts: route composition, header/footer anchors, scroll behavior, and contact conversion.
- [ ] What remains deferred: named in-development products, case-study system (Vitest + Playwright + CI added Jun 2026).
- [ ] How the durable solution doc in `docs/solutions/design-patterns/story-scroll-founder-builder-homepage.md` captures the reusable pattern for future agents and redesign work.

---

## Review Findings — Understanding Tracker

### B1 — Inactive pinned panels remain keyboard/screen-reader reachable (Blocker) ✅ FIXED

- [x] **Why it's a blocker, not polish:** functional regression for a specific population (keyboard/screen-reader users), not a perception issue for everyone.
- [x] **Why mouse users never see it:** focus order is invisible to pointer-based interaction; pinning hides panels *visually* but not *semantically*.
- [x] **Why pinned mode only:** stacked mode renders all panels as a normal scrolling page — hiding non-current panels would break the experience for the very users we're protecting.
- [x] **State vs. ref for active index:** state drives the re-render that toggles `aria-hidden` / `inert`; ref guards against 60fps-redundant `setState` calls from GSAP's `onUpdate`.
- [x] **Invariant after fix:** in pinned mode, exactly `panels.length - 1` panels carry `inert` at any moment — *which* changes with scroll, *how many* never does.
- [x] **React 18 quirk:** `inert` is not in JSX prop types until React 19; spread `{...(cond ? { inert: '' } : {})}` to bypass.

### S1 — No snap on ScrollTrigger (Should-fix) ✅ FIXED & VERIFIED (mouse + touch + trackpad)

- [x] **Surface effect:** users can park between panels, leaving partial overlap.
- [x] **Compounding effect:** `Math.round(self.progress * (panels.length - 1))` flips the header theme at the 50% mark, before the dominant panel finishes transitioning — directly causing the S3 contrast clash.
- [x] **Why viewport-relative `end`:** `+=850 * n` is fixed-pixel and rushes transitions on tall/wide screens; `(n-1) * window.innerHeight` gives "one viewport-swipe per panel" rhythm at every resolution.
- [x] **Why `panels.length - 1`:** N panels = N − 1 transitions; the first panel is the starting state, not a transition.
- [x] **The `snapTo` formula:** `1 / (n - 1)` produces exactly `n` evenly-spaced snap points across [0, 1]. The math is universal — 2 panels → snapTo 1.0 → {0, 1}, 7 panels → snapTo 0.167 → 7 evenly spaced points.
- [x] **`duration` and `delay`:** duration scales with how far the snap travels (min/max bounds); delay gates how long to wait after the user stops scrolling before snap fires. Compounds with S3 by ensuring the header theme switches *at* panel boundaries, not mid-transition.
- [x] **Tuning round (verification finding):** initial `delay: 0.05`, `directional: true` (default), high `scrub: 0.85` made snap fire on flicks but not on slow trackpad stops — trackpad inertia tails kept ScrollTrigger from detecting "scroll ended." Final config: `scrub: 0.4`, `delay: 0.1`, `directional: false`, plus `ScrollTrigger.normalizeScroll(true)` to standardize wheel/touch event timing. Trade-off: normalizeScroll affects all scrolling on the page, not just the pinned section — verified Contact section below still feels normal.

### S2 — Reduced-motion handling is incomplete (Should-fix) ✅ FIXED

- [x] **Lazy initializer fixes the flicker:** `useState(() => window.matchMedia(...).matches)` evaluates once at first render before any effect, so reduced-motion users get `shouldStack=true` immediately — no wasted GSAP mount cycle.
- [x] **CSS rules don't stop JS animations:** GSAP uses `requestAnimationFrame` + direct `transform` writes, bypassing CSS `transition`/`animation` properties entirely. The global `prefers-reduced-motion` rule in `index.css` only neutralizes CSS-driven motion, so it cannot disable the pinned story scroll on its own.
- [x] **Two-layer reduced-motion strategy (post-Framer removal):** all non-story micro-interactions are now CSS transitions/animations, so the global `index.css` rule (zeroing `animation`/`transition` duration *and* delay) disables them app-wide in one place — replacing the old `MotionConfig reducedMotion="user"` wrapper, which was deleted along with Framer Motion. The story scroll is the one rAF-driven exception: `prefersReducedMotion` feeds `forceStack`, so GSAP pinning never mounts for reduced-motion users.

### S3 — Contrast failures on accent panels (Should-fix) ✅ FIXED

- [x] **WCAG thresholds:** 4.5:1 for normal text, 3:1 for large text (≥18.66px bold or ≥24px) and UI components. Formula is `(L1 + 0.05) / (L2 + 0.05)`.
- [x] **Why `text-white/78` is *worse* than `text-white`:** opacity blends foreground with background, reducing luminance distance. Transparency on text always reduces contrast unless the background is also transparent.
- [x] **The fix strategy:** introduce `accent-deep` (#C2410C, ~6.4:1 vs white) and `accent-deeper` (#9A3412, ~8.5:1 vs white) tokens. Use them anywhere text sits on accent. Keep bright `accent` (#FF6E35) only for decorative/non-text surfaces.
- [x] **Why opacity on muted text was still safe to raise (70%→85%, 72%→90%):** the *background* in those cases was solid, so higher opacity simply moves the text closer to pure white/primary — pure contrast win, no visual regression on hierarchy.
- [x] **Mobile menu button on accent panels:** previously `text-primary` directly on orange (~3.9:1 even after the bg darkening — borderline for icons). Now a white pill, matching the logo treatment — ~6.8:1.

### S4 — Missing Tailwind classes (Should-fix) ✅ FIXED (live components)

- [x] **Why it fails silently:** Tailwind generates, it doesn't validate. Unknown classes are indistinguishable from intentional non-Tailwind class strings.
- [x] **Cheapest signals to catch it:** Tailwind IntelliSense (red underline on unknown utilities) + visual browser testing. `eslint-plugin-tailwindcss` for CI.
- [x] **Replacement mapping:** since `primary` has only `DEFAULT`, shade utilities map to the base token + opacity. `primary-500` → `primary`; `primary-600` → `primary/90`; lighter footer hover → `text-white` (since footer bg is dark, "lighter" = higher luminance, not a shade ramp).
- [x] **Live-component scope:** Contact, BackToTop, Footer, Header, Success all clean. Legacy Hero/About/Services/CaseStudies/Clients sections removed from the repo (were not rendered from `App.tsx`).

### S5 — Global `window` event for theme propagation (Should-fix) ✅ FIXED

- [x] **Dedup came for free with B1:** the `activeIndexRef` early-return in `setActiveTheme` now suppresses duplicate dispatches without any new code. ScrollTrigger still fires `onUpdate` at ~60fps, but only real index changes propagate a `story-theme-change` event.
- [x] **Dead prop removed:** `onActiveThemeChange` was declared, destructured, and called, but no caller ever passed it (`StoryScrollExperience` doesn't supply it). Removing it also lets `setActiveTheme`'s `useCallback` deps be `[]`, making the function reference stable across renders and avoiding a small re-run in the `useEffect` that depends on it.
- [x] **Why keep the window event:** `Layout` mounts above `StoryScrollExperience` in the tree, and the `Header` is a sibling, not a descendant of the story scroll. A window event is a pragmatic decoupled bus when the data has to travel "sideways" across the tree without lifting state up. A cleaner long-term shape would be a context provider in `Layout`, but the event is fine for one consumer.

### B2 — Pinned panels clip content taller than one viewport (Blocker) ✅ FIXED

- [x] **Why pinned mode clips:** panel wrappers are `absolute inset-0` (viewport-sized) and `.story-scroll` uses `overflow-hidden`, so section content that naturally grows past 100vh is cut off.
- [x] **Why stacked mode does not:** panel wrappers are `relative` with no height cap; sections expand to fit bullets, logos, and CTAs.
- [x] **Measured impact (1512×856 desktop):** all 7 panels clip some content when pinned — e.g. panel 1 last bullet, panel 3 body + tags + logos, panel 7 CTA (159–419px overflow per panel).
- [x] **Layers involved:** `story-scroll.tsx` (pin + absolute panels + overflow hidden) and `StoryPanel.tsx` (`min-h-screen overflow-hidden` section).
- [x] **Fix shipped:** desktop now measures each panel section’s natural `scrollHeight` against `clientHeight` before enabling GSAP pin. If any panel exceeds the viewport, the entire story falls back to stacked mode (one-way for the session). `ResizeObserver` re-escalates if fonts/logos grow after load. Trade-off: kinetic pinned UX is sacrificed on viewports where content is taller than one screen — mode changes interaction, not message.
