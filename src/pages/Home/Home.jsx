import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Stat from '../../components/Stat/Stat';
import About from '../../components/About/About';
import Testimonials from '../../components/Testimonial/Testimonials';
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Stat />
      <About />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;