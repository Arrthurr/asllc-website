import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, TrendingUp, Briefcase } from 'lucide-react';
import Section from '../ui/Section';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { value: '200+', label: 'Clients Served', icon: <Users className="w-6 h-6" /> },
    { value: '98%', label: 'Client Retention', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '10+', label: 'Years Experience', icon: <Briefcase className="w-6 h-6" /> },
  ];

  return (
    <Section id="about" background="white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10 bg-white shadow-xl rounded-lg p-6 md:p-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-full transform translate-x-1/3 -translate-y-1/3 -z-10" />
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h3>
              <p className="text-gray-600 mb-6">
                Arturo Solo LLC was founded in 2018 with a mission to help small businesses navigate the complex world of cloud services. We saw firsthand how many organizations were paying for cloud subscriptions they weren't fully utilizing.
              </p>
              <p className="text-gray-600 mb-6">
                Our team brings together decades of experience in IT consulting, cloud services, and business operations to provide practical solutions that deliver real value.
              </p>
              <p className="text-gray-600">
                Today, we're proud to have helped our small business clients optimize their cloud investments, reduce costs, and improve productivity through better use of their cloud infrastructure.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary-100 rounded-full transform -translate-x-1/4 translate-y-1/4 -z-10" />
          </motion.div>
        </div>
        
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Arturo Solo</h2>
            <p className="text-xl text-gray-600 mb-8">
              We're cloud optimization specialists helping small businesses get more value from their software subscriptions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary-100 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Our Approach</h3>
                <p className="text-gray-600">
                  We take a consultative approach, working closely with you to understand your business needs before recommending solutions that will deliver the most value.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Our Values</h3>
                <p className="text-gray-600">
                  We believe in transparent pricing, practical solutions, and building long-term relationships with our clients through excellent service and results.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default About;