'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { notifyLead } from '@/lib/email/notify-lead';
import { checkContactRateLimit } from '@/lib/rate-limit';
import { contactSchema, formatContactErrors } from '@/lib/validation/contact';

export type ContactActionState = {
  status: 'idle' | 'validation-error' | 'server-error';
  errors?: Record<string, string>;
  message?: string;
};

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const raw = {
    name: formData.get('name')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    company: formData.get('company')?.toString() ?? '',
    service: formData.get('service')?.toString() ?? '',
    message: formData.get('message')?.toString() ?? '',
    website: formData.get('website')?.toString() ?? '',
  };

  // Honeypot: silent success, no DB row
  if (raw.website) {
    redirect('/success');
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'validation-error',
      errors: formatContactErrors(parsed.error),
    };
  }

  const headerStore = await headers();
  const forwarded = headerStore.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';

  const { success, limitConfigured } = await checkContactRateLimit(`contact:${ip}`);
  if (limitConfigured && !success) {
    return {
      status: 'server-error',
      message: 'Too many submissions from this connection. Please wait an hour and try again, or email start@arturosolo.com directly.',
    };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('contact_leads').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      service: parsed.data.service,
      message: parsed.data.message ?? null,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        status: 'server-error',
        message: 'Something went wrong saving your message. Please try again or email start@arturosolo.com directly.',
      };
    }

    await notifyLead(parsed.data);
  } catch (error) {
    console.error('Contact submission error:', error);
    return {
      status: 'server-error',
      message: 'Something went wrong. Please try again or email start@arturosolo.com directly.',
    };
  }

  redirect('/success');
}
