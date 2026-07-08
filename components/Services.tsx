'use client';

import { motion } from 'framer-motion';
import { Zap, Wrench } from 'lucide-react';
import Link from 'next/link';
import { Highlight } from '@/components/Highlight';
import { usePrefersReducedMotion } from '@/lib/motion';

export default function Services() {
  const reduced = usePrefersReducedMotion();

  const services = [
    {
      icon: <Zap className="h-12 w-12" />,
      title: 'AI Jumpstart',
      description:
        'A focused first engagement for operators who need a working AI workflow, not a strategy fog. You bring the bottleneck. I build the first running version.',
      bullets: [
        'One high-leverage workflow',
        'Clear build boundary',
        'A real handoff, not a PDF',
      ],
    },
    {
      icon: <Wrench className="h-12 w-12" />,
      title: 'Custom AI Build',
      description:
        'When the first workflow proves value, we expand. Custom integrations, multi-step automations, and AI systems built into how your team actually operates.',
      bullets: [
        'Evidence-driven scope',
        'Built on what already works',
        'Shipped into daily operations',
      ],
    },
  ];

  return (
    <section id="services" className="section-padding bg-black text-white">
      <div className="container mx-auto">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-24 mb-24">
            <h2 className="heading-lg">
              Start with what <Highlight>runs</Highlight>.
            </h2>
            <p className="text-xl text-gray-400 font-display">
              Two ways to work together — both scoped to real bottlenecks, both delivered as working systems your team can use on day one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-t border-gray-800 pt-8"
              >
                {service.icon}
                <h3 className="text-2xl font-bold mt-6 mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2 text-gray-500 text-sm">
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>· {bullet}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-black">
              Start AI Jumpstart
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
