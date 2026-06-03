import React from 'react';
import { MotionConfig } from 'framer-motion';
import Layout from './components/layout/Layout';
import StoryScrollExperience from './components/sections/StoryScrollExperience';
import Contact from './components/sections/Contact';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Layout>
        <StoryScrollExperience />
        <Contact />
      </Layout>
    </MotionConfig>
  );
}

export default App;
