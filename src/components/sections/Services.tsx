import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Hammer, Rocket } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';

const steps = [
  {
    title: 'We find your first AI win',
    description:
      "We start with a short, focused conversation to pinpoint one high-leverage workflow in your business that AI can actually move the needle on — no boil-the-ocean strategy decks.",
    icon: <Target className="w-10 h-10 text-primary" />,
  },
  {
    title: 'I build it',
    description:
      "Then I build it. Using the same AI-native tools I use to ship my own products, I design and develop a working AI workflow — fast, and tailored to how you actually operate.",
    icon: <Hammer className="w-10 h-10 text-primary" />,
  },
  {
    title: 'You walk away with it running',
    description:
      "At the end you have a real, running AI workflow in your hands — not a report telling you what you could do. From there we have a clear path to the next build.",
    icon: <Rocket className="w-10 h-10 text-primary" />,
  },
];

const Services: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <Section id="services" background="light">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary rounded-full">
          The AI Jumpstart
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your first AI win, actually built
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The AI Jumpstart is how we start working together. In a few weeks I build and
          hand you one working AI workflow running in your business — and it's the first
          step into bigger builds, not a one-off.
        </p>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {steps.map((step, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="relative h-full p-8 overflow-hidden">
              <span
                className="pointer-events-none absolute -top-4 right-2 text-8xl font-bold text-primary/10 select-none"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="relative">
                <div className="mb-6">
                  {step.icon}
                </div>
                <div className="text-sm font-semibold text-primary mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Services;
