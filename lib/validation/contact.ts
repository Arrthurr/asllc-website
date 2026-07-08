import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(1, 'Company name is required'),
  service: z.enum(['ai-jumpstart', 'custom-ai-build', 'not-sure'], {
    errorMap: () => ({ message: 'Please select a service option' }),
  }),
  message: z.string().optional(),
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function formatContactErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}
