'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { usePrefersReducedMotion } from '@/lib/motion';

const MOBILE_MENU_ID = 'mobile-nav-menu';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  const getNavLink = (href: string) => {
    if (isHomePage) {
      return href;
    }
    return `/${href.replace(/^\//, '')}`;
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <motion.div
      initial={reduced ? false : { y: -20, opacity: 0 }}
      animate={reduced ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-6 px-4">
          <Link href="/" onClick={closeMobile}>
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-12 text-sm" aria-label="Main navigation">
            <NavLink href={getNavLink('#services')}>Services</NavLink>
            <NavLink href={getNavLink('#process')}>Process</NavLink>
            <NavLink href={getNavLink('#team')}>About</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <Link href="/contact" className="btn-primary">Bring me a bottleneck</Link>
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id={MOBILE_MENU_ID}
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={reduced ? undefined : { opacity: 1, height: 'auto' }}
            exit={reduced ? undefined : { opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <MobileLink href={getNavLink('#services')} onClick={closeMobile}>Services</MobileLink>
              <MobileLink href={getNavLink('#process')} onClick={closeMobile}>Process</MobileLink>
              <MobileLink href={getNavLink('#team')} onClick={closeMobile}>About</MobileLink>
              <MobileLink href="/blog" onClick={closeMobile}>Blog</MobileLink>
              <MobileLink href="/contact" onClick={closeMobile}>Contact</MobileLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isHashLink = href.startsWith('#') || href.includes('#');
  const Component = isHashLink ? 'a' : Link;
  const props = isHashLink ? { href } : { href };

  return (
    <Component
      {...props}
      className="hover:text-gray-500 transition-colors relative"
    >
      {children}
    </Component>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const isHashLink = href.startsWith('#') || href.includes('#');
  const className = 'text-lg font-medium py-2 hover:text-gray-600 transition-colors';

  if (isHashLink) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
