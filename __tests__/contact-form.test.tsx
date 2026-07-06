import { describe, expect, it } from 'vitest';
import { contactSchema, formatContactErrors } from '@/lib/validation/contact';

describe('contactSchema', () => {
  const valid = {
    name: 'Jane Operator',
    email: 'jane@example.com',
    company: 'Acme Co',
    service: 'ai-jumpstart' as const,
    message: 'We reconcile spreadsheets every Friday.',
  };

  it('accepts valid contact data', () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatContactErrors(result.error).email).toBeTruthy();
    }
  });

  it('rejects missing company', () => {
    const result = contactSchema.safeParse({ ...valid, company: '' });
    expect(result.success).toBe(false);
  });

  it('requires valid service enum', () => {
    const result = contactSchema.safeParse({ ...valid, service: 'strategy-deck' });
    expect(result.success).toBe(false);
  });
});
