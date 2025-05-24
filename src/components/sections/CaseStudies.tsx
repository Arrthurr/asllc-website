import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const caseStudies = [
  {
    title: 'Retail Chain Saves $45,000 Annually on Cloud Costs',
    description: 'How we helped a 12-store retail operation optimize their Microsoft 365 and Azure services.',
    category: 'Microsoft 365',
    result: '32% Cost Reduction',
  },
  {
    title: 'Accounting Firm Improves Client Collaboration',
    description: 'Implementation of Google Workplace with custom workflows for better client service.',
    category: 'Google Workplace',
    result: '40% Faster Document Processing',
  },
];

const CaseStudies: React.FC = () => {
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
    <Section id="case-studies" background="white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Success Stories</h2>
            <p className="text-xl text-muted-foreground mb-8">
              See how we've helped businesses like yours achieve measurable results through strategic cloud service optimization.
            </p>
            <Button variant="outline">
              View All Case Studies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <div className="lg:col-span-8">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {study.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                    <p className="text-muted-foreground mb-6">{study.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-bold">{study.result}</span>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default CaseStudies;