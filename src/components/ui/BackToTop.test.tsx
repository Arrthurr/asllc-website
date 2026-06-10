import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import BackToTop from './BackToTop';

const setScroll = (y: number) => {
  Object.defineProperty(window, 'pageYOffset', { configurable: true, value: y });
  fireEvent.scroll(window);
};

// Gates the strand / early-unmount failure modes of the useExitTransition swap
// in CI; the felt scale+fade timing is covered by the manual checklist.
describe('BackToTop exit', () => {
  afterEach(() => {
    Object.defineProperty(window, 'pageYOffset', { configurable: true, value: 0 });
  });

  it('keeps the button mounted while exiting, then unmounts on a qualifying transitionend', () => {
    render(<BackToTop />);

    setScroll(400);
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();

    setScroll(0);
    // Still mounted: the scale+fade out has not completed yet.
    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();

    fireEvent.transitionEnd(button, { propertyName: 'opacity' });
    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
  });

  it('does not unmount when a descendant transition ends', () => {
    render(<BackToTop />);

    setScroll(400);
    const button = screen.getByRole('button', { name: /back to top/i });
    setScroll(0);

    const icon = button.querySelector('svg');
    expect(icon).not.toBeNull();
    fireEvent.transitionEnd(icon as SVGElement, { propertyName: 'opacity' });

    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });
});
