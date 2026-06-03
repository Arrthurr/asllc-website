import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Section from '../ui/Section';
import { Button } from '../ui/button';

const Success: React.FC = () => {
  return (
    <Section background="secondary">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-primary mb-4">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-gray-600 text-center mb-8 text-lg">
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
