import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoryTheme } from '../ui/story-scroll';

interface StoryPanelProps {
  label: string;
  eyebrow: string;
  heading: string;
  body: string;
  number: string;
  theme: StoryTheme;
  variant?: 'split' | 'center' | 'proof' | 'offer' | 'final';
  bullets?: string[];
  proofLogos?: Array<{ name: string; logo: string }>;
  contextWords?: string[];
  cta?: { label: string; href: string };
  isOpening?: boolean;
}

const themeClasses: Record<StoryTheme, string> = {
  light: 'bg-white text-primary',
  dark: 'bg-primary text-white',
  accent: 'bg-accent text-white',
};

const mutedTextClasses: Record<StoryTheme, string> = {
  light: 'text-primary/70',
  dark: 'text-white/72',
  accent: 'text-white/78',
};

const lineClasses: Record<StoryTheme, string> = {
  light: 'bg-primary/18',
  dark: 'bg-white/20',
  accent: 'bg-white/28',
};

const StoryPanel: React.FC<StoryPanelProps> = ({
  label,
  eyebrow,
  heading,
  body,
  number,
  theme,
  variant = 'split',
  bullets = [],
  proofLogos = [],
  contextWords = [],
  cta,
  isOpening = false,
}) => {
  const HeadingTag = isOpening ? 'h1' : 'h2';

  return (
    <section
      aria-label={label}
      className={cn(
        'relative flex min-h-screen items-center overflow-hidden px-5 py-28 sm:px-8 md:px-12 lg:px-16',
        themeClasses[theme]
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className={cn('absolute left-6 top-24 h-px w-[calc(100%-3rem)]', lineClasses[theme])} />
        <div className={cn('absolute bottom-20 left-6 h-px w-[calc(100%-3rem)]', lineClasses[theme])} />
        <span className="absolute -right-8 top-16 select-none text-[32vw] font-bold leading-none tracking-tighter opacity-[0.08] md:text-[24vw]">
          {number}
        </span>
      </div>

      <div
        className={cn(
          'relative z-10 mx-auto grid w-full max-w-7xl gap-10',
          variant === 'center' || variant === 'final'
            ? 'place-items-center text-center'
            : 'lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.58fr)] lg:items-end'
        )}
      >
        <div className={cn(variant === 'center' || variant === 'final' ? 'max-w-5xl' : 'max-w-4xl')}>
          <p className={cn('mb-5 text-xs font-bold uppercase tracking-[0.35em]', mutedTextClasses[theme])}>
            {eyebrow}
          </p>
          <HeadingTag className="mb-7 break-words text-[clamp(2.65rem,14vw,5.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.095em] md:text-[clamp(3.6rem,12vw,10.5rem)] md:leading-[0.82]">
            {heading}
          </HeadingTag>
          <p className={cn('max-w-3xl text-xl leading-snug md:text-2xl lg:text-3xl', mutedTextClasses[theme])}>
            {body}
          </p>
        </div>

        {(bullets.length > 0 || proofLogos.length > 0 || contextWords.length > 0 || cta) && (
          <aside
            className={cn(
              'w-full',
              variant === 'center' || variant === 'final' ? 'max-w-3xl' : 'lg:pb-8'
            )}
          >
            {bullets.length > 0 && (
              <ul className={cn('space-y-3', variant === 'center' || variant === 'final' ? 'mx-auto max-w-2xl text-center' : 'text-left')}>
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className={cn(
                      'text-lg font-medium leading-snug md:text-xl',
                      variant === 'center' || variant === 'final' ? 'border-t-2 px-3 pt-3' : 'border-l-2 py-1 pl-4',
                      theme === 'light' ? 'border-accent text-primary' : 'border-white/45 text-white'
                    )}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {contextWords.length > 0 && (
              <div className="flex flex-wrap gap-2 text-left">
                {contextWords.map((word) => (
                  <span
                    key={word}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]',
                      theme === 'light'
                        ? 'border-primary/15 text-primary/70'
                        : 'border-white/25 text-white/78'
                    )}
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}

            {proofLogos.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {proofLogos.map((client) => (
                  <div key={client.name} className="flex h-16 items-center justify-center rounded-md bg-white/90 p-3 shadow-sm">
                    <img src={client.logo} alt={client.name} className="max-h-full max-w-full object-contain grayscale" />
                  </div>
                ))}
              </div>
            )}

            {cta && (
              <a
                href={cta.href}
                className={cn(
                  'group inline-flex items-center justify-center rounded-full px-6 py-4 text-base font-bold transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:text-lg',
                  theme === 'accent'
                    ? 'bg-white text-accent focus-visible:ring-white focus-visible:ring-offset-accent'
                    : 'bg-accent text-white focus-visible:ring-accent focus-visible:ring-offset-primary'
                )}
              >
                {cta.label}
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </aside>
        )}
      </div>
    </section>
  );
};

export default StoryPanel;
