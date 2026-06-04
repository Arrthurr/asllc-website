import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../ui/BackToTop';
import type { StoryTheme } from '../ui/story-scroll';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [storyTheme, setStoryTheme] = useState<StoryTheme>('light');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const contactSection = document.getElementById('contact');
      if (contactSection && contactSection.getBoundingClientRect().top <= 96) {
        setStoryTheme('light');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const theme = (event as CustomEvent<{ theme?: StoryTheme }>).detail?.theme;
      if (theme) setStoryTheme(theme);
    };

    window.addEventListener('story-theme-change', handleThemeChange);
    return () => window.removeEventListener('story-theme-change', handleThemeChange);
  }, []);

  useEffect(() => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStoryTheme('light');
      },
      { threshold: 0.08 }
    );

    observer.observe(contactSection);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header scrolled={scrolled} storyTheme={storyTheme} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Layout;
