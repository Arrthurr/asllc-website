'use client';

import { motion } from 'framer-motion';
import { Highlight } from '@/components/Highlight';
import { usePrefersReducedMotion } from '@/lib/motion';

const proofLogos = [
  { name: 'HG Jones Associates', logo: '/clients/hg-jones.png' },
  { name: 'DMDL', logo: '/clients/dmdl.png' },
  { name: 'Joy for Books', logo: '/clients/joy-for-books.png' },
  { name: 'Darklight', logo: '/clients/darklight.png' },
];

const proofItems = [
  { label: 'Public products shipped', detail: 'Live tools in the wild' },
  { label: 'Internal workflows built', detail: 'Ops systems that run daily' },
  { label: 'Real client contexts', detail: 'Small business operations' },
  { label: 'AI builds in development', detail: 'Carefully scoped, not oversold' },
];

export default function Stats() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            <h2 className="heading-lg">
              Products, workflows, <Highlight>operations</Highlight>.
            </h2>
            <p className="text-xl text-gray-400 font-display">
              The evidence is not one portfolio tile. It is public products shipped, internal workflows built, real client contexts, and AI tools currently being developed carefully — not oversold.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {proofItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-t border-gray-800 pt-6"
              >
                <div className="text-lg font-bold mb-2">{item.label}</div>
                <div className="text-sm text-gray-500">{item.detail}</div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-12">
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-wider">
              Client contexts (subordinate proof)
            </p>
            <div className="flex flex-wrap items-center gap-10 opacity-70">
              {proofLogos.map((client) => (
                <div key={client.name} className="relative h-10 w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-10 w-auto object-contain brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
