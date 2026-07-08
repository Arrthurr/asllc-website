'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/motion';

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export default function Logo({ className = '', animate = true }: LogoProps) {
  const reduced = usePrefersReducedMotion();
  const shouldAnimate = animate && !reduced;
  const LogoWrapper = shouldAnimate ? motion.div : 'div';

  return (
    <LogoWrapper
      className={`inline-flex items-center ${className}`}
      whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
    >
      <motion.span
        className="text-2xl font-bold tracking-tight"
        initial={shouldAnimate ? { x: -10, opacity: 0 } : undefined}
        animate={shouldAnimate ? { x: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Arturo Solo
      </motion.span>
    </LogoWrapper>
  );
}
