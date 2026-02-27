import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Stat from '../../components/Stat/Stat';  // ← Singular
import About from '../../components/About/About';
import OurSolutions from '../../components/OurSolutions/OurSolutions';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import Pricing from '../../components/Pricing/Pricing';
const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Stat />   {/* ← Singular */}
      <About />
      <OurSolutions />
      <WhyChooseUs />
      <Pricing />
    </div>
  );
};

export default Home;
