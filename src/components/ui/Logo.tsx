import React from 'react';
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark', className }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-foreground';

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("font-normal text-xl tracking-tighter", textColor)}>
        <span>Arturo Solo</span>
        <span className="text-accent ml-1">LLC</span>
      </div>
    </div>
  );
};

export default Logo;