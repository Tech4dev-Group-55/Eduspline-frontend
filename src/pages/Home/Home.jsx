import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Stat from '../../components/Stat/Stat';  // ← Singular
import About from '../../components/About/About';
import Testimonial from '../../components/Testimonial/Testimonials';
import ContactUs from '../../components/aboutus/ContactUs';


const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Stat />   {/* ← Singular */}
      <About />
      <Testimonial />
      <ContactUs />
    </div>
  );
};

export default Home;
