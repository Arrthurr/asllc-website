import { Resend } from 'resend';
import type { ContactFormData } from '@/lib/validation/contact';

const serviceLabels: Record<ContactFormData['service'], string> = {
  'ai-jumpstart': 'AI Jumpstart',
  'custom-ai-build': 'Custom AI build / implementation',
  'not-sure': 'Not sure yet — let\'s talk',
};

export async function notifyLead(data: ContactFormData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL ?? 'start@arturosolo.com';

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set; skipping lead notification email');
    return;
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: 'Arturo Solo LLC <notifications@arturosolo.com>',
    to,
    replyTo: data.email,
    subject: `New contact: ${data.name} (${data.company})`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company}`,
      `Service: ${serviceLabels[data.service]}`,
      '',
      data.message ? `Message:\n${data.message}` : 'No message provided.',
    ].join('\n'),
  });
}
