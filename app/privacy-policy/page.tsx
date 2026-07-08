import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Arturo Solo LLC collects, stores, and protects contact information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32">
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose">
              <p>Last updated: July 5, 2026</p>

              <h2>1. Who we are</h2>
              <p>
                Arturo Solo LLC (&ldquo;we,&rdquo; &ldquo;us&rdquo;) operates arturosolo.com. For privacy questions or deletion requests, contact{' '}
                <a href="mailto:start@arturosolo.com">start@arturosolo.com</a>.
              </p>

              <h2>2. Information we collect</h2>
              <p>When you submit the contact form, we collect:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-600 font-display">
                <li>Full name</li>
                <li>Email address</li>
                <li>Company name</li>
                <li>Service interest (AI Jumpstart, Custom AI Build, or not sure)</li>
                <li>Optional message describing your bottleneck or project</li>
              </ul>

              <h2>3. How we store your information</h2>
              <p>
                Contact submissions are stored in Supabase (managed PostgreSQL) hosted in the United States. Only the operator (Arthur Turnbull) can access submitted leads through authenticated admin access. Anonymous visitors cannot read contact submissions.
              </p>

              <h2>4. How we use your information</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600 font-display">
                <li>Respond to your inquiry personally</li>
                <li>Scope potential AI build engagements</li>
                <li>Send operator notification emails when you submit the form</li>
              </ul>
              <p>We do not sell your personal information.</p>

              <h2>5. Retention</h2>
              <p>
                Contact submissions are retained for up to 24 months, then deleted unless an active engagement requires longer retention. You may request deletion at any time by emailing{' '}
                <a href="mailto:start@arturosolo.com">start@arturosolo.com</a>.
              </p>

              <h2>6. Third-party services</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600 font-display">
                <li><strong>Supabase</strong> — contact lead storage</li>
                <li><strong>Vercel</strong> — website hosting</li>
                <li><strong>Resend</strong> — operator email notifications (no marketing lists)</li>
                <li><strong>Upstash</strong> — rate limiting (IP-based, no PII stored beyond rate-limit counters)</li>
              </ul>

              <h2>7. Your rights</h2>
              <p>You may request access to, correction of, or deletion of your personal information by contacting{' '}
                <a href="mailto:start@arturosolo.com">start@arturosolo.com</a>.
              </p>

              <h2>8. Changes</h2>
              <p>We may update this policy. The &ldquo;Last updated&rdquo; date at the top reflects the most recent revision.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
