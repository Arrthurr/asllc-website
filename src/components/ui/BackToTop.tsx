import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExitTransition } from '@/hooks/useExitTransition';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const button = useExitTransition<HTMLButtonElement>(isVisible);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!button.shouldRender) return null;

  // Carries forward Framer's {opacity:0, scale:0.5} ⇄ {opacity:1, scale:1}.
  return (
    <button
      ref={button.ref}
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50 rounded-full bg-primary p-3 text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'transition-[opacity,transform,background-color] duration-200 ease-out',
        button.isEntered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      )}
      aria-label="Back to top"
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default BackToTop;
