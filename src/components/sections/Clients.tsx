import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Section from '../ui/Section';
import Card from '../ui/Card';

const Clients: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const clients = [
    {
      name: 'HG Jones Associates',
      logo: '/clients/hg-jones.png',
    },
    {
      name: 'DMDL',
      logo: '/clients/dmdl.png',
    },
    {
      name: 'Joy for Books',
      logo: '/clients/joy-for-books.png',
    },
    {
      name: 'Darklight',
      logo: '/clients/darklight.png',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <Section id="clients" background="primary">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by businesses like yours</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Small businesses have trusted me with their technology for years. Now I'm bringing
          that same hands-on approach to building AI that actually works for them.
        </p>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16"
      >
        {clients.map((client, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <Card className="h-24 flex items-center justify-center p-4">
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-full max-w-full object-contain"
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-wide text-primary mb-4">
            Who I help
          </div>
          <p className="text-lg text-muted-foreground">
            Picture a CEO who was handed a Copilot license and told to "use AI" — but has no
            roadmap, no time, and no one to actually build anything. That's exactly who I help.
            You don't need another tool or another strategy deck. You need someone to ship the
            first working thing.
          </p>
        </Card>
      </motion.div>
    </Section>
  );
};

export default Clients;
