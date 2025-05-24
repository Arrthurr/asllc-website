import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Section from '../ui/Section';
import { Card } from '../ui/card';

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
      name: 'Nex',
      logo: '/clients/nex.png',
    },
    { 
      name: 'Waveform',
      logo: '/clients/waveform.png',
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

  const testimonials = [
    {
      quote: "Arturo Solo helped us reduce our Microsoft 365 costs by 30% while actually improving how our team uses the tools. Their guidance was invaluable.",
      author: "Mark Ingram",
      position: "Operations Manager",
      company: "DMDL, Inc.",
    },
    {
      quote: "Working with Arturo Solo transformed how we use Google Workplace. Our team's collaboration and productivity have improved significantly.",
      author: "Joy Triche",
      position: "Founder",
      company: "Joy for Books",
    },
  ];

  return (
    <Section id="clients" background="primary">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses Like Yours</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We've helped companies across industries optimize their cloud services and achieve tangible results.
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
          >
            <Card className="p-8">
              <svg className="w-12 h-12 text-primary/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
              </svg>
              <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-muted rounded-full mr-4"></div>
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.position}, {testimonial.company}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Clients;