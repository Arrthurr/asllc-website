import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the story experience and contact conversion path', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /working ai/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /tell me where the work gets stuck/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start the conversation/i })).toHaveAttribute('href', '#contact');
  });
});