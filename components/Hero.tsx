'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Highlight } from '@/components/Highlight';
import { usePrefersReducedMotion } from '@/lib/motion';

export default function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-6">
            Arturo Solo LLC · AI build studio
          </p>
          <h1 className="heading-xl mb-8">
            Working AI.<br />
            In your business.
          </h1>
          <div className="grid md:grid-cols-2 gap-16 items-end">
            <div className="space-y-6">
              <p className="text-xl text-gray-600 font-display">
                Not another deck. Not a demo that dies after the meeting. I build the first useful AI system into the way your team already works.
              </p>
              <p className="text-lg text-gray-500 font-display">
                Your messy process is the map. Inbox triage, handoffs, reporting, follow-up, data cleanup — the work people avoid is usually where the first AI win lives.
              </p>
            </div>
            <div className="md:text-right space-y-4">
              <Link href="/contact" className="btn-primary md:w-2/3">
                Bring me a bottleneck <ArrowRight className="inline-block ml-2" />
              </Link>
              <p className="text-sm text-gray-500 md:text-right">
                Built to run · Scoped to one real bottleneck · Delivered as a working workflow
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
