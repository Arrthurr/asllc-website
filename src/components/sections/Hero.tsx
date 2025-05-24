import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 lg:pt-64 lg:pb-48 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-100 opacity-60" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-secondary-100 opacity-60" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
              <span className="relative">
                Maximize
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-primary-300 opacity-50"></span>
              </span>{" "}
              your cloud investments
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              We help small businesses optimize their cloud subscriptions, reduce costs, and unlock the full potential of Microsoft 365 and Google Workplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href="#contact">Schedule a Consultation</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#services">
                  Our Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-secondary-100 rounded-full -z-10" />
            <div className="bg-white rounded-xl shadow-xl p-8 transform rotate-3">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary-500" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Microsoft 365</h3>
                  <p className="text-sm text-gray-500">Optimization</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-2">
                <div className="h-2 bg-primary-500 rounded-full w-[70%]" />
              </div>
              <p className="text-sm text-gray-500">70% Optimized</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-8 transform -rotate-2 mt-8 ml-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-secondary-500" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Google Workplace</h3>
                  <p className="text-sm text-gray-500">Utilization</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-2">
                <div className="h-2 bg-secondary-500 rounded-full w-[85%]" />
              </div>
              <p className="text-sm text-gray-500">85% Utilized</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;