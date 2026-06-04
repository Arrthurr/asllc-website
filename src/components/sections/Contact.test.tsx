import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Contact from './Contact';

describe('Contact', () => {
  it('exposes a native Netlify form with expected fields and action', () => {
    render(<Contact />);

    const contactForm = document.querySelector('form[name="contact"]');
    expect(contactForm).not.toBeNull();
    expect(contactForm).toHaveAttribute('method', 'POST');
    expect(contactForm).toHaveAttribute('action', '/success');
    expect(contactForm).toHaveAttribute('data-netlify', 'true');

    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/email address/i)).toBeRequired();
    expect(screen.getByLabelText(/company name/i)).toBeRequired();
    expect(screen.getByLabelText(/what are you interested in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what's the work you want off your plate/i)).toBeInTheDocument();

    expect(screen.getByDisplayValue('contact')).toHaveAttribute('name', 'form-name');
    expect(screen.getByRole('button', { name: /send the bottleneck/i })).toHaveAttribute('type', 'submit');
  });

  it('includes AI Jumpstart as the primary service option', () => {
    render(<Contact />);
    expect(screen.getByRole('option', { name: /ai jumpstart/i })).toHaveValue('ai-jumpstart');
  });

  it('updates controlled fields on input', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/full name/i), 'Alex');
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Alex');
  });
});