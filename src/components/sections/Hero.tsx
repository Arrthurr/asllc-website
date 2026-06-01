import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, BarChart3 } from 'lucide-react';
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
              I build{" "}
              <span className="relative">
                working AI
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-primary-300 opacity-50"></span>
              </span>{" "}
              into your business
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Not slide decks or strategy memos — real, running software. I'm Arturo, and I ship production AI tools at a speed traditional shops can't match. I've already built and launched two of my own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href="#services">Start your AI Jumpstart</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#work">
                  See what I've built
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
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Attendance App</h3>
                  <p className="text-sm text-gray-500">Location-aware · in beta</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">A staff check-in app I built end-to-end with AI tools.</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 transform -rotate-2 mt-8 ml-12">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Head Start Data Site</h3>
                  <p className="text-sm text-gray-500">Live · Texas grantees</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">A public data-viz site, designed and shipped solo.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;