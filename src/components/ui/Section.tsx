import React from 'react';
import { cn } from "@/lib/utils"
import { motion } from 'framer-motion';
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      }
    },
  };

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
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className={cn(
          fullWidth ? 'w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8'
        )}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Section;