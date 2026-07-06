'use client';

import { motion } from 'framer-motion';
import { Highlight } from '@/components/Highlight';
import { usePrefersReducedMotion } from '@/lib/motion';

export default function Process() {
  const reduced = usePrefersReducedMotion();

  const steps = [
    {
      number: '01',
      title: 'Map the bottleneck',
      description:
        'Find the repeatable drag — inbox triage, handoffs, reporting, follow-up, data cleanup. Pick one job worth automating first.',
    },
    {
      number: '02',
      title: 'Build until it runs',
      description:
        'Design the smallest useful workflow, ship it into the business, and put it in front of real use — not a slide deck.',
    },
    {
      number: '03',
      title: 'Expand from evidence',
      description:
        'Use the result — not guesses — to choose the next system. Scope small, build real, learn fast.',
    },
  ];

  return (
    <section id="process" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="heading-lg mb-24 max-w-3xl">
            Scope small. Build real. <Highlight>Learn fast.</Highlight>
          </h2>
          <div className="grid md:grid-cols-3 gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-t border-gray-200 pt-8"
              >
                <span className="text-sm text-gray-400">{step.number}</span>
                <h3 className="text-2xl font-bold mt-4 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
