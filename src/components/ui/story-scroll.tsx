import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

export type StoryTheme = 'light' | 'dark' | 'accent';

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
  const shouldStack = prefersReducedMotion || isMobile || panels.length <= 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(-1);

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
    if (!shouldStack || !containerRef.current) return;

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
  }, [shouldStack, panels.length, setActiveTheme]);

  useGSAP(
    () => {
      if (shouldStack || !containerRef.current || panels.length <= 1) return;

      gsap.registerPlugin(ScrollTrigger);
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
        gsap.set(panelElements, { clearProps: 'all' });
      };
    },
    { scope: containerRef, dependencies: [shouldStack, panels.length], revertOnUpdate: true }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'story-scroll relative overflow-hidden',
        shouldStack ? 'story-scroll--stacked' : 'min-h-screen [perspective:1200px]',
        className
      )}
      data-story-mode={shouldStack ? 'stacked' : 'pinned'}
    >
      {panels.map((panel, index) => {
        const element = React.isValidElement(panel) ? panel : null;
        const theme = isStoryTheme(element?.props?.theme ?? null) ? element.props.theme : 'light';
        const label = typeof element?.props?.label === 'string' ? element.props.label : `Story panel ${index + 1}`;
        const isInactivePinnedPanel = !shouldStack && index !== activeIndex;

        return (
          <div
            key={element?.key ?? index}
            ref={(node) => {
              if (node) panelRefs.current[index] = node;
            }}
            className={cn(
              'story-scroll-panel min-h-screen w-full',
              shouldStack ? 'relative' : 'absolute inset-0'
            )}
            data-story-panel={index + 1}
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
