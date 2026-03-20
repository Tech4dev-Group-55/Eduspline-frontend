import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Stat from '../../components/Stat/Stat';  // ← Singular
import About from '../../components/About/About';
<<<<<<< Updated upstream
import Testimonial from '../../components/Testimonial/Testimonials';
import  Footer from "../../components/Footer/Footer"

=======
import Testimonials from '../../components/Testimonial/testimonials'; // ← New import
>>>>>>> Stashed changes

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Stat />   {/* ← Singular */}
      <About />
<<<<<<< Updated upstream
      <Testimonial />
     <Footer />
=======
      <Testimonials /> {/* ← New component added */}
>>>>>>> Stashed changes
    </div>
  );
};

export default Home;
