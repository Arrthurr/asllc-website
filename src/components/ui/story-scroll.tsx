import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { anyPanelExceedsViewport } from './story-scroll-measurement';

gsap.registerPlugin(ScrollTrigger);

export type StoryTheme = 'light' | 'dark' | 'accent';

type StackReason = 'mobile' | 'reduced-motion' | 'overflow' | 'single-panel';

interface StoryScrollProps {
  children: React.ReactNode;
  className?: string;
}

const isStoryTheme = (value: string | null): value is StoryTheme =>
  value === 'light' || value === 'dark' || value === 'accent';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

const StoryScroll: React.FC<StoryScrollProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const panels = useMemo(() => React.Children.toArray(children), [children]);
  const forceStack = prefersReducedMotion || isMobile || panels.length <= 1;
  const [contentExceedsViewport, setContentExceedsViewport] = useState(false);
  const [measurementComplete, setMeasurementComplete] = useState(false);
  const useStackedLayout =
    forceStack || contentExceedsViewport || !measurementComplete;
  const stackedKineticActive =
    useStackedLayout && !forceStack && measurementComplete;
  const stackReason = useMemo((): StackReason | undefined => {
    if (prefersReducedMotion) return 'reduced-motion';
    if (isMobile) return 'mobile';
    if (panels.length <= 1) return 'single-panel';
    if (contentExceedsViewport) return 'overflow';
    return undefined;
  }, [prefersReducedMotion, isMobile, panels.length, contentExceedsViewport]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(-1);

  const escalateIfExceeds = useCallback(() => {
    if (anyPanelExceedsViewport(panelRefs.current)) {
      setContentExceedsViewport(true);
    }
  }, []);

  const setActiveTheme = useCallback((index: number) => {
    if (activeIndexRef.current === index) return;
    activeIndexRef.current = index;
    setActiveIndex(index);

    const panel = panelRefs.current[index];
    const theme = isStoryTheme(panel?.dataset.storyTheme ?? null)
      ? panel.dataset.storyTheme
      : 'light';

    window.dispatchEvent(
      new CustomEvent('story-theme-change', { detail: { theme } })
    );
  }, []);

  useEffect(() => {
    activeIndexRef.current = -1;
    setActiveTheme(0);
  }, [panels.length, setActiveTheme]);

  useEffect(() => {
    if (!useStackedLayout) return;

    activeIndexRef.current = -1;
    setActiveTheme(0);
  }, [useStackedLayout, setActiveTheme]);

  useEffect(() => {
    if (forceStack) {
      setMeasurementComplete(true);
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let innerRafId = 0;
    let debounceTimer: ReturnType<typeof setTimeout>;

    const measure = () => {
      if (cancelled) return;
      escalateIfExceeds();
      setMeasurementComplete(true);
    };

    const scheduleMeasure = () => {
      if (cancelled) return;
      rafId = requestAnimationFrame(() => {
        innerRafId = requestAnimationFrame(measure);
      });
    };

    const fontsReady =
      typeof document !== 'undefined' && document.fonts?.ready
        ? document.fonts.ready
        : Promise.resolve();

    void fontsReady.then(scheduleMeasure);

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(escalateIfExceeds, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(innerRafId);
      clearTimeout(debounceTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [forceStack, panels.length, escalateIfExceeds]);

  useEffect(() => {
    if (useStackedLayout || !measurementComplete || forceStack) return;

    const sections = panelRefs.current
      .map((panel) => panel?.querySelector('section'))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    const observer = new ResizeObserver(escalateIfExceeds);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [useStackedLayout, measurementComplete, forceStack, panels.length, escalateIfExceeds]);

  useEffect(() => {
    if (!useStackedLayout || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const index = panelRefs.current.indexOf(visibleEntry.target as HTMLDivElement);
        if (index >= 0) setActiveTheme(index);
      },
      { threshold: [0.45, 0.7] }
    );

    panelRefs.current.forEach((panel) => observer.observe(panel));

    return () => observer.disconnect();
  }, [useStackedLayout, panels.length, setActiveTheme]);

  useGSAP(
    () => {
      if (
        !stackedKineticActive ||
        !containerRef.current ||
        panels.length <= 1
      ) {
        return;
      }

      const panelElements = panelRefs.current.filter(Boolean);
      const timelines: gsap.core.Timeline[] = [];

      panelElements.forEach((panel, index) => {
        const isProofPanel = panel.dataset.storyVariant === 'proof';
        const enterYPercent = isProofPanel ? 4 : 8;
        const exitYPercent = isProofPanel ? -4 : -8;
        const minScale = isProofPanel ? 0.98 : 0.96;
        const enterOpacity = isProofPanel ? 0.9 : 0.88;
        const exitOpacity = isProofPanel ? 0.82 : 0.76;
        const isHeroPanel = index === 0;

        gsap.set(panel, { transformOrigin: '50% 80%' });

        if (isHeroPanel) {
          gsap.set(panel, { yPercent: 0, opacity: 1, scale: 1 });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });
          timeline.to(panel, {
            yPercent: exitYPercent,
            opacity: exitOpacity,
            scale: minScale,
            ease: 'none',
            duration: 1,
          });
          timelines.push(timeline);
          return;
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            end: 'top 15%',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            panel,
            { yPercent: enterYPercent, opacity: enterOpacity, scale: minScale },
            { yPercent: 0, opacity: 1, scale: 1, ease: 'none', duration: 0.4 }
          )
          .to(panel, {
            yPercent: exitYPercent,
            opacity: exitOpacity,
            scale: minScale,
            ease: 'none',
            duration: 0.6,
          });

        timelines.push(timeline);
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        timelines.forEach((timeline) => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        });
        gsap.set(panelElements, { clearProps: 'transform,opacity' });
      };
    },
    {
      scope: containerRef,
      dependencies: [stackedKineticActive, measurementComplete, panels.length],
      revertOnUpdate: true,
    }
  );

  useGSAP(
    () => {
      if (
        useStackedLayout ||
        !measurementComplete ||
        !containerRef.current ||
        panels.length <= 1
      ) {
        return;
      }

      ScrollTrigger.normalizeScroll(true);

      const panelElements = panelRefs.current.filter(Boolean);
      gsap.set(panelElements, {
        position: 'absolute',
        inset: 0,
        transformOrigin: '50% 80%',
      });
      gsap.set(panelElements.slice(1), { yPercent: 105, opacity: 0.88, rotateX: 7 });
      gsap.set(panelElements[0], { yPercent: 0, opacity: 1, rotateX: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${(panels.length - 1) * window.innerHeight}`,
          pin: true,
          scrub: 0.4,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.3, max: 0.6 },
            delay: 0.1,
            ease: 'power2.inOut',
            directional: false,
          },
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              panels.length - 1,
              Math.max(0, Math.round(self.progress * (panels.length - 1)))
            );
            setActiveTheme(index);
          },
        },
      });

      panelElements.slice(1).forEach((panel, index) => {
        const previousPanel = panelElements[index];

        timeline
          .to(previousPanel, {
            yPercent: -14,
            opacity: 0.24,
            scale: 0.9,
            rotateX: -10,
            duration: 0.9,
            ease: 'power2.inOut',
          })
          .to(
            panel,
            {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.9,
              ease: 'power2.inOut',
            },
            '<'
          );
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        ScrollTrigger.normalizeScroll(false);
        gsap.set(panelElements, { clearProps: 'all' });
      };
    },
    {
      scope: containerRef,
      dependencies: [useStackedLayout, measurementComplete, panels.length],
      revertOnUpdate: true,
    }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'story-scroll relative',
        useStackedLayout
          ? 'story-scroll--stacked overflow-visible'
          : 'min-h-screen overflow-hidden [perspective:1200px]',
        className
      )}
      data-story-mode={useStackedLayout ? 'stacked' : 'pinned'}
      data-story-stack-reason={useStackedLayout ? stackReason : undefined}
      data-story-kinetic={stackedKineticActive ? 'stacked-scrub' : undefined}
    >
      {panels.map((panel, index) => {
        const element = React.isValidElement(panel) ? panel : null;
        const theme = isStoryTheme(element?.props?.theme ?? null) ? element.props.theme : 'light';
        const variant =
          typeof element?.props?.variant === 'string' ? element.props.variant : undefined;
        const label = typeof element?.props?.label === 'string' ? element.props.label : `Story panel ${index + 1}`;
        const isInactivePinnedPanel = !useStackedLayout && index !== activeIndex;

        return (
          <div
            key={element?.key ?? index}
            ref={(node) => {
              if (node) panelRefs.current[index] = node;
            }}
            className={cn(
              'story-scroll-panel min-h-screen w-full',
              useStackedLayout ? 'relative' : 'absolute inset-0'
            )}
            data-story-panel={index + 1}
            data-story-variant={variant}
            data-story-theme={theme}
            aria-label={label}
            aria-hidden={isInactivePinnedPanel || undefined}
            {...(isInactivePinnedPanel ? { inert: '' } : {})}
          >
            {panel}
          </div>
        );
      })}
    </div>
  );
};

export default StoryScroll;
