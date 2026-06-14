# Story Scroll Stacked Scroll Debug Understanding Checklist

Use this as the running checklist for this debugging session.

## Problem

- [x] Desktop has three story-scroll branches: pinned kinetic, stacked kinetic, and stacked static.
- [x] Mobile intentionally uses stacked static behavior for visual consistency and performance.
- [x] Typical desktop laptop viewports often enter stacked kinetic mode because at least one panel is taller than the viewport.
- [x] The reported "bounce inward" is not missing GSAP; it is GSAP scaling the full panel wrapper during stacked kinetic scrub.
- [x] Scaling the wrapper scales the panel background too, exposing page gutters on the left and right.

## Solution

- [x] Keep stacked kinetic motion, but remove wrapper `scale` from the stacked scrub timelines.
- [x] Preserve vertical `yPercent` and opacity scrub so panels still feel kinetic.
- [x] Leave pinned mode unchanged, where panels are absolute, pinned, snapped, and allowed to use stronger 3D-style transforms.
- [x] Add E2E coverage that proves animated stacked panels remain viewport-width during scrub.

## Animation Library Context

- [x] Framer Motion was intentionally removed because its remaining use cases were CSS-level micro-interactions.
- [x] GSAP is the only runtime animation engine in this repo.
- [x] GSAP ScrollTrigger supports scroll-linked scrub, pinning, snapping, triggers, timelines, and responsive/reduced-motion setups.
- [x] The current design uses those capabilities in one scoped place: `src/components/ui/story-scroll.tsx`.

## Broader Context

- [x] The story scroll is the persuasion surface; Contact remains the normal, reliable conversion surface.
- [x] The fix affects desktop stacked kinetic presentation only.
- [x] Reduced-motion and mobile behavior should remain GSAP-free/static.
- [x] Edge-to-edge section backgrounds are part of the intended story-panel visual contract, not incidental styling.

## Human Verification

- [ ] Restate why desktop stacked mode exists instead of forcing pinned mode on all desktop screens.
- [ ] Restate why scaling the panel wrapper caused page gutters.
- [ ] Restate why removing scale is safer than relaxing overflow measurement or reintroducing Framer Motion.
- [ ] Explain which behavior the new E2E assertion protects.
