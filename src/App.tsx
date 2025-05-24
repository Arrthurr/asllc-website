import React from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import About from './components/sections/About';
import Clients from './components/sections/Clients';
import CaseStudies from './components/sections/CaseStudies';
import Contact from './components/sections/Contact';

function App() {
  return (
    <Layout>
      <Hero />
      <Services />
      <About />
      <Clients />
      <CaseStudies />
      <Contact />
    </Layout>
  );
}

export default App;