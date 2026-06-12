---
title: Drop Framer Motion for CSS Animations + Scoped GSAP
date: 2026-06-09
category: docs/solutions/tooling-decisions
module: Frontend animation architecture
problem_type: tooling_decision
component: tooling
severity: medium
related_components:
  - useExitTransition hook
  - StoryScroll
  - Header
  - BackToTop
  - Card
  - Section
  - Contact
applies_when:
  - A React app pulls in a general-purpose animation library for a handful of declarative micro-interactions.
  - Two animation engines coexist and one of them can be retired without losing behavior.
  - Mount/unmount (enter/exit) transitions were the only reason an animation library was kept.
  - Reduced-motion handling is split between a runtime library config and CSS.
tags: [framer-motion, css-animations, gsap, reduced-motion, exit-transition, react-hooks, dependency-removal, tailwindcss-animate]
---

# Drop Framer Motion for CSS Animations + Scoped GSAP

## Context

The homepage already ran two animation engines. GSAP (`gsap` + `@gsap/react`) drove the story-scroll primitive (pinned pin/scrub when panels fit; since Jun 2026 also stacked scroll-progress scrub when desktop panels overflow). Framer Motion (`framer-motion`, ~40 kB gzipped) was carried only for a handful of trivial, declarative micro-interactions on non-story surfaces: a card hover lift, a section scroll-in fade, the mobile menu open/close, a back-to-top button, and the two-column stagger on the Contact section.

That is a large runtime dependency earning its keep on about seven sites, none of which needed a physics/spring engine or layout animation — each was a fixed-duration opacity/transform tween that CSS expresses natively. The one genuinely non-trivial thing Framer provided was `AnimatePresence`: keeping an element mounted through its exit animation before unmounting. Everything else was a `transition`/`@keyframes` in disguise.

This learning records the decision to remove Framer Motion entirely and converge on **one runtime animation engine (GSAP, scoped to story-scroll) plus plain CSS** for everything else, including a small `useExitTransition` hook to replace `AnimatePresence`.

## Guidance

**Run a single runtime animation engine, and reach for CSS first.** In this repo that means: GSAP stays confined to `src/components/ui/story-scroll.tsx` and is the only runtime animation library. Every non-story micro-interaction is a CSS transition or a `tailwindcss-animate` keyframe utility. Do not reintroduce Framer Motion — or any general-purpose runtime animation library — for these surfaces.

Map each interaction to the cheapest mechanism that reproduces it:

- **Hover / state tweens** → a CSS `transition` on the animated properties. Match the original numbers exactly (e.g. Framer `whileHover y:-5` → `hover:translate-y-[-5px]`, not `hover:-translate-y-1` which is 4px).
- **One-shot enter-on-scroll** → a `tailwindcss-animate` keyframe (`animate-in fade-in slide-in-from-bottom-5`) gated on an in-view boolean, resting at `opacity-0` until triggered.
- **Staggered enters** → the same, plus `[animation-delay:200ms] fill-mode-both`. `fill-mode-both` holds the hidden start state through the delay so the element does not flash visible before its turn (this is what Framer's `initial` gave you for free).
- **Mount/unmount with an exit animation** → the `useExitTransition` hook (below), which keeps the element in the DOM until its CSS exit transition finishes.

**Handle reduced motion in one place: a global CSS rule, not a runtime config.** Because all non-story motion is now CSS, a single `@media (prefers-reduced-motion: reduce)` block in `src/index.css` neutralizes every former-Framer surface at once. It must zero **both** `*-duration` and `*-delay` for animations and transitions — otherwise a `transition-delay`-based stagger (Contact) still ticks for reduced-motion users:

```css
/* src/index.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0.01ms !important;
  }
}
```

GSAP is the deliberate exception: CSS cannot stop it (see below), so the story-scroll handles reduced motion separately via `forceStack` (it never mounts pinned or stacked-scrub timelines). Mobile visitors get stacked static mode. The two layers together cover the whole app.

**GSAP’s dual role in story-scroll (Jun 2026):** pinned mode uses container pin + scrub + snap; stacked overflow mode uses per-panel scrub timelines without pin (`data-story-kinetic="stacked-scrub"`). Both paths stay inside `src/components/ui/story-scroll.tsx` — do not spread GSAP to Contact, Header, or other chrome.

**Use `useExitTransition` to replace `AnimatePresence`.** Re-implementing presence is only safe if it covers the edge cases the library already handled. The hook (`src/hooks/useExitTransition.ts`) keeps an element mounted through its exit transition and:

- filters `transitionend` by `event.target === node` **and** a chosen `propertyName` (default `opacity`), so a descendant's transition can't unmount the parent early and a multi-property transition (e.g. opacity + transform) unmounts exactly once;
- tears the listener down and cancels the pending unmount on re-entry (effect cleanup keyed on `show`), so a rapid open→close→open can't strand the element or leak listeners;
- backstops every exit with a named fallback timer (`EXIT_TRANSITION_FALLBACK_MS`) for the no-transition / `display:none` / interrupted-transition case;
- uses a deliberate **double `requestAnimationFrame`** to commit the "out" state before flipping to "entered", because a single frame can coalesce the mount and the entered commit into one paint and skip the enter transition entirely.

```tsx
// consumer pattern (Header mobile menu, BackToTop, ...)
const menu = useExitTransition<HTMLDivElement>(isMenuOpen);
if (!menu.shouldRender) return null;
return (
  <div
    ref={menu.ref}
    className={cn(
      'transition-[opacity,transform] duration-200 ease-out',
      menu.isEntered ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0 pointer-events-none'
    )}
  />
);
```

The `pointer-events-none` on the out-state is load-bearing: without it, an interrupted enter (closing within a couple of frames) can leave an invisible-but-clickable, focusable strip on screen until the fallback timer fires. `inert`/`aria-hidden` while `!isEntered` is the more complete version of the same guard.

## Why This Matters

The win is not only the ~40 kB bundle reduction. It is **removing a class of confusion that comes from two engines with overlapping responsibilities**, while keeping each engine where it is actually the right tool.

The non-obvious trap is that **CSS rules do not stop JS-driven animations**. GSAP (like Framer) writes transforms via `requestAnimationFrame`, bypassing CSS `transition`/`animation` properties entirely. A global `prefers-reduced-motion` CSS rule therefore silently fails to disable the story-scroll pin — that surface must be gated in JS (`forceStack`). Conflating "we have a reduced-motion CSS rule" with "reduced motion is handled everywhere" is exactly the kind of mistake this split prevents once it is written down: CSS owns CSS motion, `forceStack` owns GSAP motion.

Re-implementing `AnimatePresence` is cheap to get 80% right and easy to get subtly wrong. The failure modes that surfaced during this work are the reason the hook is worth more than its line count: an untracked inner `requestAnimationFrame` leaks (the same bug existed in story-scroll's measurement effect and had to be fixed there too — cancel *every* rAF handle you create); a `transitionend` that isn't filtered by target+property unmounts on the wrong event; a missing fallback timer strands elements that never transition; and a missing `pointer-events-none` creates an invisible interactive element. Capturing the contract means the next presence-style animation reuses the hook instead of re-discovering these one at a time.

## When to Apply

- A general-purpose animation library is present but every consumer is a fixed-duration opacity/transform tween CSS can express.
- A second, better-fit engine already exists for the genuinely complex animation (here, GSAP for scroll-kinetics), so retiring the first does not leave a capability gap.
- You need enter/exit (mount/unmount) animation without a library — reach for `useExitTransition` rather than re-adding one.
- Reduced-motion correctness matters and motion is (or can become) all-CSS, so it collapses to one media query.

Do **not** apply when the library is doing work CSS can't: layout/shared-element transitions, gesture-driven or spring/physics animation, or orchestrated sequences with interruption and velocity hand-off. That is when a runtime engine earns its bundle cost.

## Examples

Per-surface migration map (all numbers carried forward exactly from the Framer originals):

| Surface | Was (Framer) | Now (CSS) |
|---------|--------------|-----------|
| `Card` hover | `whileHover y:-5`, 0.2s | `transition-[box-shadow,transform] duration-200 ease-out hover:translate-y-[-5px] hover:shadow-lg` |
| `Section` scroll-in | `initial y:20` → `y:0`, 0.6s easeOut | `animate-in fade-in slide-in-from-bottom-5 ease-out [animation-duration:600ms]`, resting at `opacity-0` until in view |
| `Contact` 2nd column | staggered ~0.2s | adds `[animation-delay:200ms] fill-mode-both` so the hidden start state holds through the delay |
| `Header` mobile menu | `AnimatePresence`, `{opacity:0, y:-20} ⇄ {opacity:1, y:0}`, 0.2s | `useExitTransition` + `transition-[opacity,transform]`, `-translate-y-5 opacity-0 pointer-events-none` out-state |
| `BackToTop` | `AnimatePresence`, `{opacity:0, scale:0.5} ⇄ {opacity:1, scale:1}` | `useExitTransition` + `transition-[opacity,transform,background-color]`, `scale-50 opacity-0` out-state |
| root `App` | `<MotionConfig reducedMotion="user">` wrapper | removed; reduced motion via the global `index.css` rule |

`Section`'s enter, resting hidden until in view:

```tsx
<div
  ref={ref}
  className={cn(
    inView
      ? 'animate-in fade-in slide-in-from-bottom-5 ease-out [animation-duration:600ms]'
      : 'opacity-0'
  )}
>
```

Note on leftover "Framer" strings in source: the migrated components keep one-line comments naming the original Framer values (e.g. `// Carries forward Framer's {opacity:0, y:-20} ⇄ {opacity:1, y:0}, 0.2s.`). These are intentional migration breadcrumbs documenting the parity target, not live imports — a grep for "framer" will hit them.

## Related

- `docs/plans/2026-06-09-001-refactor-drop-framer-motion-plan.md` — the implementation plan (R1–R9): import-site inventory, hook design, bundle measurement, and the explicit note deferring the doc update to `/ce-compound`. Primary historical record.
- `docs/solutions/design-patterns/story-scroll-founder-builder-homepage.md` — the homepage story-scroll pattern; holds the binding "scope GSAP to the story primitive" constraint and the story-scroll reduced-motion (`forceStack`) and accessibility invariants this decision must preserve.
- `docs/plans/2026-06-09-002-fix-story-scroll-viewport-truncation-plan.md` — the stacked-mode viewport-truncation fallback; shares the "CSS can't stop GSAP" and rAF-cleanup learnings.
- `docs/story-scroll-redesign-understanding-checklist.md` — S2 documents the post-removal two-layer reduced-motion strategy (global CSS rule + GSAP `forceStack`).
- Stale-as-operational (historical only): `docs/plans/2026-06-03-001-feat-story-scroll-redesign-plan.md` and `docs/plans/2026-06-01-001-feat-ai-consultancy-pivot-plan.md` still say "keep Framer Motion for non-story surfaces" — superseded by this decision.
