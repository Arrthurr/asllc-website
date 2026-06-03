import React from 'react';
import Layout from './components/layout/Layout';
import StoryScrollExperience from './components/sections/StoryScrollExperience';
import Contact from './components/sections/Contact';

function App() {
  return (
    <Layout>
      <StoryScrollExperience />
      <Contact />
    </Layout>
  );
}

export default App;
