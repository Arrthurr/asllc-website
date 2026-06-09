import { useEffect, useRef, useState } from 'react';

/**
 * Longer than any transition this hook drives (~200 ms here), short enough
 * never to leave a visible element stranded. Guarantees an unmount when no
 * qualifying `transitionend` arrives — no transition, `display: none`, or an
 * interrupted/cancelled transition.
 */
export const EXIT_TRANSITION_FALLBACK_MS = 500;

export interface UseExitTransitionOptions {
  /**
   * Which `transitionend` property gates the unmount. Defaults to `opacity`,
   * which every current consumer transitions and which is always present, so a
   * second animated property (e.g. `transform`) can't trigger a double unmount.
   */
  propertyName?: string;
}

export interface ExitTransitionResult<T extends HTMLElement> {
  /** Whether the element should be in the DOM (true through the exit animation). */
  shouldRender: boolean;
  /** True at the visible resting state; false drives the "out" (enter/exit) classes. */
  isEntered: boolean;
  /** Attach to the transitioning element so its `transitionend` can be filtered. */
  ref: React.RefObject<T>;
}

/**
 * Keeps an element mounted through its CSS exit transition, so an
 * `AnimatePresence`-style enter/exit can be expressed with plain CSS classes
 * and no animation library.
 *
 * Re-implementing presence is only safe if the edge cases `AnimatePresence`
 * already handled are covered, so this hook:
 *  - filters `transitionend` by `event.target === node` and a chosen
 *    `propertyName`, so a descendant's transition can't unmount the parent
 *    early and a multi-property transition unmounts exactly once;
 *  - tears the listener down (and cancels the pending unmount) on re-entry via
 *    the effect cleanup keyed on `show`, so rapid open→close→open can't strand
 *    the element or accumulate stale listeners;
 *  - backstops every exit with a named fallback timer for the
 *    no-/interrupted-transition case.
 *
 * Reduced motion needs no `matchMedia` read here: the global rule in
 * `index.css` collapses the transition to ~0 ms, so `transitionend` fires
 * near-instantly and the fallback timer backstops it.
 */
export function useExitTransition<T extends HTMLElement = HTMLElement>(
  show: boolean,
  { propertyName = 'opacity' }: UseExitTransitionOptions = {}
): ExitTransitionResult<T> {
  const ref = useRef<T>(null);
  const [shouldRender, setShouldRender] = useState(show);
  const [isEntered, setIsEntered] = useState(show);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout>>();
  const isInitialRun = useRef(true);

  useEffect(() => {
    const wasInitialRun = isInitialRun.current;
    isInitialRun.current = false;

    const clearFallback = () => {
      if (fallbackTimer.current !== undefined) {
        clearTimeout(fallbackTimer.current);
        fallbackTimer.current = undefined;
      }
    };

    if (show) {
      // (Re)enter: cancel any pending exit and reveal the element.
      clearFallback();
      setShouldRender(true);

      // An element shown on first render rests at its visible state — no enter
      // animation replays on mount.
      if (wasInitialRun) {
        setIsEntered(true);
        return;
      }

      // Render the "out" state first, then flip to "entered" next frame so the
      // browser registers a start state and animates the transition.
      setIsEntered(false);
      const raf = requestAnimationFrame(() => setIsEntered(true));
      return () => cancelAnimationFrame(raf);
    }

    // Exit: nothing mounted means nothing to animate out.
    if (!shouldRender) return;

    setIsEntered(false);

    const unmount = () => {
      clearFallback();
      setShouldRender(false);
    };

    // Backstop: unmount even if no qualifying transitionend ever arrives.
    fallbackTimer.current = setTimeout(unmount, EXIT_TRANSITION_FALLBACK_MS);

    const node = ref.current;
    if (!node) {
      return clearFallback;
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      // Ignore transitions bubbling from descendants and any property other
      // than the gating one, so the exit unmounts once, on the right element.
      if (event.target !== node) return;
      if (event.propertyName !== propertyName) return;
      unmount();
    };

    node.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      node.removeEventListener('transitionend', handleTransitionEnd);
      clearFallback();
    };
    // `shouldRender` is read but intentionally excluded: this effect must run
    // only when `show` flips, and `shouldRender` is always current at that point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return { shouldRender, isEntered, ref };
}
