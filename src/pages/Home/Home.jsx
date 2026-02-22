import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Stat from '../../components/Stat/Stat';  // ← Singular
import About from '../../components/About/About';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Stat />   {/* ← Singular */}
      <About />
    </div>
  );
};

export default Home;
