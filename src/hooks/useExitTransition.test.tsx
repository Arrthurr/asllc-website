import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EXIT_TRANSITION_FALLBACK_MS,
  useExitTransition,
} from './useExitTransition';

interface HarnessProps {
  show: boolean;
  propertyName?: string;
}

function Harness({ show, propertyName }: HarnessProps) {
  const { shouldRender, status, ref } = useExitTransition<HTMLDivElement>(show, {
    propertyName,
  });

  if (!shouldRender) return null;

  return (
    <div ref={ref} data-testid="el" data-status={status}>
      <span data-testid="child">child</span>
    </div>
  );
}

describe('useExitTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders immediately at the entered state when shown on first render', () => {
    render(<Harness show />);

    const el = screen.getByTestId('el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-status', 'entered');
  });

  it('does not render when hidden on first render', () => {
    render(<Harness show={false} />);
    expect(screen.queryByTestId('el')).not.toBeInTheDocument();
  });

  it('keeps the element mounted until a qualifying transitionend, then unmounts', () => {
    const { rerender } = render(<Harness show />);
    const el = screen.getByTestId('el');

    act(() => {
      rerender(<Harness show={false} />);
    });

    // Still mounted while exiting.
    expect(screen.getByTestId('el')).toBeInTheDocument();
    expect(screen.getByTestId('el')).toHaveAttribute('data-status', 'exiting');

    act(() => {
      fireEvent.transitionEnd(el, { propertyName: 'opacity' });
    });

    expect(screen.queryByTestId('el')).not.toBeInTheDocument();
  });

  it('ignores a transitionend bubbling up from a descendant', () => {
    const { rerender } = render(<Harness show />);
    const child = screen.getByTestId('child');

    act(() => {
      rerender(<Harness show={false} />);
    });

    act(() => {
      // Child's transition (e.g. a CTA's transition-colors) must not unmount us.
      fireEvent.transitionEnd(child, { propertyName: 'opacity' });
    });

    expect(screen.getByTestId('el')).toBeInTheDocument();
  });

  it('unmounts exactly once for a multi-property transition', () => {
    const { rerender } = render(<Harness show />);
    const el = screen.getByTestId('el');

    act(() => {
      rerender(<Harness show={false} />);
    });

    act(() => {
      // The non-gating property arrives first and must be ignored.
      fireEvent.transitionEnd(el, { propertyName: 'transform' });
    });
    expect(screen.getByTestId('el')).toBeInTheDocument();

    act(() => {
      fireEvent.transitionEnd(el, { propertyName: 'opacity' });
    });
    expect(screen.queryByTestId('el')).not.toBeInTheDocument();

    // A late transform event on the now-detached node must not throw or re-fire.
    expect(() =>
      act(() => {
        fireEvent.transitionEnd(el, { propertyName: 'transform' });
      })
    ).not.toThrow();
    expect(screen.queryByTestId('el')).not.toBeInTheDocument();
  });

  it('unmounts via the fallback timer when no transitionend arrives', () => {
    const { rerender } = render(<Harness show />);

    act(() => {
      rerender(<Harness show={false} />);
    });
    expect(screen.getByTestId('el')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(EXIT_TRANSITION_FALLBACK_MS);
    });

    expect(screen.queryByTestId('el')).not.toBeInTheDocument();
  });

  it('cancels the pending unmount when re-entered mid-exit', () => {
    const { rerender } = render(<Harness show />);

    act(() => {
      rerender(<Harness show={false} />);
    });
    expect(screen.getByTestId('el')).toBeInTheDocument();

    // Re-enter before the fallback timer or any transitionend fires.
    act(() => {
      rerender(<Harness show />);
    });

    // Advance well past the fallback window: the stale unmount must not fire.
    act(() => {
      vi.advanceTimersByTime(EXIT_TRANSITION_FALLBACK_MS * 2);
    });

    expect(screen.getByTestId('el')).toBeInTheDocument();
  });
});
