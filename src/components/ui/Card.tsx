import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  className,
  children,
  hover = true,
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      transition={{ duration: 0.2 }}
      className={clsx(
        'overflow-hidden rounded-lg bg-white shadow-md',
        hover && 'transition-all duration-300 hover:shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
  return (
    <div className={clsx('p-6', className)}>
      {children}
    </div>
  );
};

export default Card;
export { CardContent };
