import type { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Highlight } from '@/components/Highlight';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell me where the work gets stuck. Start with an AI Jumpstart or describe the bottleneck you want off your plate.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32">
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-24 mb-24">
                <div>
                  <h1 className="heading-lg mb-8">
                    Tell me where the work gets <Highlight>stuck</Highlight>.
                  </h1>
                  <p className="text-xl text-gray-600 mb-12 font-display">
                    You do not need a polished AI idea. Send the annoying process, the repeated handoff, the report nobody wants to clean, or the follow-up that keeps slipping. I&apos;ll reply personally and help find the right first build — usually an AI Jumpstart.
                  </p>

                  <div className="space-y-8 mb-10">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-black mt-1 shrink-0" />
                      <div>
                        <h2 className="font-bold mb-2">Email</h2>
                        <a
                          href="mailto:start@arturosolo.com"
                          className="text-gray-600 hover:text-black transition-colors"
                        >
                          start@arturosolo.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-black mt-1 shrink-0" />
                      <div>
                        <h2 className="font-bold mb-2">Based in</h2>
                        <p className="text-gray-600">Phoenix, AZ</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-6">
                    <h2 className="text-lg font-bold mb-4">A good first message is simple</h2>
                    <div className="space-y-3 text-gray-600 text-sm font-display">
                      <p className="mb-0">&ldquo;We spend three hours every Friday reconciling this spreadsheet.&rdquo;</p>
                      <p className="mb-0">&ldquo;Leads get lost between the form and follow-up.&rdquo;</p>
                      <p className="mb-0">&ldquo;We bought AI tools but nobody knows what to automate first.&rdquo;</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold mb-8">Start with the bottleneck</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
