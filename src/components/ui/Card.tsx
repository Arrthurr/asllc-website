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
        'bg-white rounded-lg shadow-md overflow-hidden',
        hover && 'transition-all duration-300 hover:shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;