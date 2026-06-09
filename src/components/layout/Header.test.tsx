import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header';

// Gates the strand / early-unmount failure modes of the useExitTransition swap
// in CI, despite the unit suite running in forced reduced-motion with no real
// transitions (jsdom). Real enter/exit feel is covered by the manual checklist.
describe('Header mobile menu exit', () => {
  const renderOpen = () => {
    render(<Header scrolled={false} storyTheme="light" />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    return screen.getByTestId('mobile-menu');
  };

  it('keeps the menu mounted while exiting, then unmounts on a qualifying transitionend', () => {
    const menu = renderOpen();
    expect(menu).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    // Still mounted: the exit animation has not completed yet.
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    fireEvent.transitionEnd(menu, { propertyName: 'opacity' });
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('does not unmount when a descendant transition (the CTA) ends', () => {
    renderOpen();
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));

    const cta = screen.getByRole('link', { name: /start your ai jumpstart/i });
    fireEvent.transitionEnd(cta, { propertyName: 'color' });

    // The CTA's transition-colors must not bubble up and unmount the menu early.
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });
});
