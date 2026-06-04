import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';
import { cn } from '@/lib/utils';
import type { StoryTheme } from '../ui/story-scroll';

interface HeaderProps {
  scrolled: boolean;
  storyTheme: StoryTheme;
}

const Header: React.FC<HeaderProps> = ({ scrolled, storyTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  
  const isLightHeader = storyTheme === 'dark';
  const logoVariant = isLightHeader && !isMenuOpen ? 'light' : 'dark';
  const contactLabel = scrolled ? 'Start AI Jumpstart' : 'Bring me a bottleneck';

  return (
    <header 
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'py-3' : 'py-6',
        scrolled && storyTheme === 'light' && 'bg-white shadow-sm',
        scrolled && storyTheme !== 'light' && 'bg-primary/92 shadow-sm',
        !scrolled && 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <a
          href="#top"
          aria-label="Arturo Solo LLC home"
          className={cn(
            'rounded-full px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            storyTheme === 'dark' && !isMenuOpen ? 'bg-transparent' : 'bg-white/95 shadow-sm backdrop-blur-sm'
          )}
        >
          <Logo variant={logoVariant} />
        </a>
        
        {/* Desktop Menu */}
        <nav className="hidden items-center space-x-4 md:flex" aria-label="Primary navigation">
          <a
            href="#contact"
            className={cn(
              'rounded-full px-5 py-2 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              isLightHeader
                ? 'bg-white text-primary hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-primary'
                : 'bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary focus-visible:ring-offset-white'
            )}
          >
            {contactLabel}
          </a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className={cn(
            'rounded-full p-2 transition-colors md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            isLightHeader && !isMenuOpen
              ? 'bg-transparent text-white'
              : 'bg-white/95 text-primary shadow-sm backdrop-blur-sm'
          )}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full bg-white shadow-lg md:hidden"
          >
            <div className="container flex flex-col space-y-4 py-6">
              <p className="text-sm uppercase tracking-[0.24em] text-primary/60">Ready when the bottleneck is</p>
              <a
                href="#contact"
                className="rounded-full bg-primary px-5 py-3 text-center font-bold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Start your AI Jumpstart
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
