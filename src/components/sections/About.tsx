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
    { value: '200+', label: 'Businesses Helped', icon: <Users className="w-6 h-6" /> },
    { value: '98%', label: 'Client Retention', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '10+', label: 'Years Shipping for SMBs', icon: <Briefcase className="w-6 h-6" /> },
  ];

  return (
    <Section id="about" background="white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-full transform translate-x-1/3 -translate-y-1/3 -z-10" />
            <div
              className="relative z-10 w-full aspect-[3/4] bg-muted rounded-lg shadow-xl"
              role="img"
              aria-label="Photo of Arturo — coming soon"
            />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary-100 rounded-full transform -translate-x-1/4 translate-y-1/4 -z-10" />
          </motion.div>
        </div>

        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Hi, I'm Arturo</h2>
            <p className="text-xl text-gray-600 mb-8">
              I build production software with AI tools — and I do it fast enough to surprise
              shops ten times my size.
            </p>
            <div className="space-y-6 mb-10">
              <p className="text-gray-600">
                For over a decade I've helped small businesses run better with technology. I
                spent years deep in Microsoft 365 and Google Workspace, which is how I earned
                the trust of the clients you'll see below — but that was always the means, not
                the mission.
              </p>
              <p className="text-gray-600">
                What changed everything is how AI tools let one focused builder ship real,
                working software at a pace that used to take a whole team. I've used them to
                design, build, and launch my own products — a location-aware attendance app and
                a live public data site — and now I bring that same speed to your business.
              </p>
              <p className="text-gray-600">
                If you have a problem AI could solve but no one to actually build the solution,
                that's exactly where I come in.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default About;
