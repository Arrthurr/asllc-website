'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { ArrowRight } from 'lucide-react';
import {
  submitContact,
  type ContactActionState,
} from '@/app/actions/submit-contact';

const initialState: ContactActionState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? 'Sending...' : 'Send the bottleneck'}{' '}
      <ArrowRight className="inline ml-2" />
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContact, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {/* Honeypot — hidden from users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field
          id="name"
          label="Full Name*"
          error={state.errors?.name}
        >
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            className={inputClass(state.errors?.name)}
          />
        </Field>
        <Field
          id="email"
          label="Email Address*"
          error={state.errors?.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass(state.errors?.email)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field
          id="company"
          label="Company Name*"
          error={state.errors?.company}
        >
          <input
            id="company"
            name="company"
            type="text"
            required
            className={inputClass(state.errors?.company)}
          />
        </Field>
        <Field
          id="service"
          label="What are you interested in?*"
          error={state.errors?.service}
        >
          <select
            id="service"
            name="service"
            required
            defaultValue=""
            className={inputClass(state.errors?.service)}
          >
            <option value="" disabled>Select an option</option>
            <option value="ai-jumpstart">AI Jumpstart</option>
            <option value="custom-ai-build">Custom AI build / implementation</option>
            <option value="not-sure">Not sure yet — let&apos;s talk</option>
          </select>
        </Field>
      </div>

      <Field
        id="message"
        label="What's the work you want off your plate?"
        error={state.errors?.message}
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass(state.errors?.message)}
        />
      </Field>

      <SubmitButton />

      {state.status === 'validation-error' && !state.errors && (
        <p className="text-red-600 text-center text-sm" role="alert">
          Please fix the errors above and try again.
        </p>
      )}

      {state.status === 'server-error' && state.message && (
        <p className="text-red-600 text-center text-sm" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError?: string) {
  return [
    'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors',
    hasError ? 'border-red-400' : 'border-gray-200',
  ].join(' ');
}
