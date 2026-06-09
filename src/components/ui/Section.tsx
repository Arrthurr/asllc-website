import React from 'react';
import { cn } from "@/lib/utils"
import { useInView } from 'react-intersection-observer';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  background?: 'white' | 'light' | 'dark' | 'primary' | 'secondary';
}

const Section: React.FC<SectionProps> = ({
  id,
  className,
  children,
  fullWidth = false,
  background = 'white',
}) => {
  // fallbackInView reveals content immediately when IntersectionObserver is
  // unavailable, so the fade-up never permanently strands content invisible
  // (R9). A wall-clock fallback timer is avoided deliberately: the only Section
  // below the fold sits behind the long pinned story scroll, so any timer short
  // enough to recover a broken observer would reveal it early and kill the fade.
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    fallbackInView: true,
  });

  const bgClasses = {
    white: 'bg-background',
    light: 'bg-muted',
    dark: 'bg-primary text-primary-foreground',
    primary: 'bg-primary/5',
    secondary: 'bg-secondary/5',
  };

  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24',
        bgClasses[background],
        className
      )}
    >
      <div
        ref={ref}
        className={cn(
          fullWidth ? 'w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8',
          // Carries forward Framer's y:20 / 0.6s / easeOut. Rests hidden until
          // in view, then the enter animation ends at the natural visible state.
          inView
            ? 'animate-in fade-in slide-in-from-bottom-5 ease-out [animation-duration:600ms]'
            : 'opacity-0'
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;