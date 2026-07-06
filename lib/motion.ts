'use client';

import { useReducedMotion } from 'framer-motion';

export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}

export function motionProps(reduced: boolean) {
  if (reduced) {
    return {
      initial: false as const,
      animate: undefined,
      whileInView: undefined,
      whileHover: undefined,
      whileTap: undefined,
      transition: undefined,
    };
  }
  return {};
}
