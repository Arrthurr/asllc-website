import React from 'react';
import { clsx } from 'clsx';

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
    <div
      className={clsx(
        'overflow-hidden rounded-lg bg-white shadow-md',
        // Was a Framer whileHover y:-5 (duration 0.2) plus a CSS shadow
        // transition; both are now CSS. -translate-y-[5px] matches 5px exactly
        // (-translate-y-1 would be 4px).
        hover &&
          'transition-[box-shadow,transform] duration-200 ease-out hover:translate-y-[-5px] hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
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
