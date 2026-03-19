import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Stat from '../../components/Stat/Stat';  // ← Singular
import About from '../../components/About/About';
import Testimonial from '../../components/Testimonial/Testimonials';
import  Footer from "../../components/Footer/Footer"


const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Stat />   {/* ← Singular */}
      <About />
      <Testimonial />
     <Footer />
    </div>
  );
};

export default Home;
