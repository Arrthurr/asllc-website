import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Message sent',
  description: 'Thanks for reaching out. Arthur will reply personally.',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32">
        <section className="section-padding">
          <div className="container mx-auto max-w-2xl text-center">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-6">
              Message received
            </p>
            <h1 className="heading-lg mb-8">
              Thanks — I&apos;ll read this personally.
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-display">
              Most replies go out within one business day. If your bottleneck is urgent, email{' '}
              <a href="mailto:start@arturosolo.com" className="text-black underline hover:no-underline">
                start@arturosolo.com
              </a>{' '}
              directly.
            </p>
            <p className="text-gray-500 mb-12 font-display">
              While you wait: think about where the work actually gets stuck — the handoff, the spreadsheet, the follow-up that keeps slipping. That detail helps us scope the first build faster.
            </p>
            <Link href="/" className="btn-primary">
              Back to homepage
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
