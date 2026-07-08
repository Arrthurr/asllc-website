import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of the Arturo Solo LLC website.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32">
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

            <div className="prose">
              <p>Last updated: July 5, 2026</p>

              <h2>1. Agreement</h2>
              <p>
                By accessing arturosolo.com, you agree to these Terms of Service. If you do not agree, please do not use this site.
              </p>

              <h2>2. Services described</h2>
              <p>
                This website describes AI build and consulting services offered by Arturo Solo LLC. Content on this site is informational and does not constitute a binding offer until a separate written agreement is signed.
              </p>

              <h2>3. Contact submissions</h2>
              <p>
                Submitting the contact form does not create a client relationship. We will respond in good faith but reserve the right to decline engagements that are not a fit.
              </p>

              <h2>4. Intellectual property</h2>
              <p>
                Site content, branding, and copy are owned by Arturo Solo LLC unless otherwise noted. You may not reproduce site content for commercial purposes without written permission.
              </p>

              <h2>5. Disclaimer</h2>
              <p>
                Information on this site is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee specific business outcomes from AI implementations described on this site.
              </p>

              <h2>6. Limitation of liability</h2>
              <p>
                To the fullest extent permitted by law, Arturo Solo LLC is not liable for indirect, incidental, or consequential damages arising from use of this website.
              </p>

              <h2>7. Governing law</h2>
              <p>
                These terms are governed by the laws of the State of Arizona, United States.
              </p>

              <h2>8. Contact</h2>
              <p>
                Questions about these terms:{' '}
                <a href="mailto:start@arturosolo.com">start@arturosolo.com</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
