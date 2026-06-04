import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Section from '../ui/Section';
import { Button } from '../ui/button';

const Success: React.FC = () => {
  return (
    <Section background="secondary">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-lg bg-white p-8 shadow-xl"
        >
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 text-primary">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h1 className="mb-4 text-3xl font-bold">Thank You!</h1>
            <p className="mb-8 text-center text-lg text-gray-600">
              Your message has been sent successfully. We'll get back to you shortly.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              size="lg"
            >
              Return to Home
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Success;
