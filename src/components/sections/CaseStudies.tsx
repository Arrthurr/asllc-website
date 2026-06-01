import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Section from '../ui/Section';
import Card, { CardContent } from '../ui/Card';
import { Button } from '../ui/button';

const work = [
  {
    title: 'Location-aware staff attendance app',
    description:
      "A mobile app that lets staff check in based on where they are, built end-to-end on Expo. I designed, built, and shipped it solo with AI-native tools — it's currently in beta.",
    category: 'Mobile · In beta',
    link: null,
  },
  {
    title: 'Texas Head Start data-viz site',
    description:
      'A public site that makes Texas Head Start and Early Head Start grantee data explorable and clear. Designed and shipped solo, AI-assisted from data to deploy — and live today.',
    category: 'Web · Live',
    link: 'https://texasheadstartgrantees.online',
  },
];

const CaseStudies: React.FC = () => {
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
    <Section id="work" background="white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Things I've built</h2>
            <p className="text-xl text-muted-foreground mb-8">
              The best proof I can offer isn't a case study about someone else — it's
              software I've designed, built, and shipped myself with AI tools. Here are two.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {work.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div
                      className="mb-6 w-full aspect-video bg-muted rounded-md"
                      role="img"
                      aria-label={`${project.title} — screenshot coming soon`}
                    />
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                    <p className="text-muted-foreground mb-6">{project.description}</p>
                    {project.link && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          Visit the live site
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
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
