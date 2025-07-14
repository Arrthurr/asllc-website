import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, Cloud, Users, Zap, LineChart } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';

const services = [
  {
    title: 'Microsoft 365 Optimization',
    description: 'Get the most out of your Microsoft 365 subscription with our expert configuration and training services.',
    icon: <Cloud className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Google Workplace Management',
    description: 'Maximize productivity and collaboration with optimized Google Workplace tools and integrations.',
    icon: <Users className="w-12 h-12 text-primary" />,
  },
  {
    title: 'License Optimization',
    description: 'Reduce costs by ensuring you have the right licenses for your actual usage and needs.',
    icon: <Zap className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Cloud Migration',
    description: 'Seamlessly transition your business operations to the cloud with minimal disruption.',
    icon: <LineChart className="w-12 h-12 text-primary" />,
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
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We help small businesses maximize their cloud investments through expert guidance and hands-on optimization.
        </p>
      </div>
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {services.map((service, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full p-8">
              <div className="mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  Assessment & Strategy
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  Implementation
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  Training & Support
                </li>
              </ul>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Services;