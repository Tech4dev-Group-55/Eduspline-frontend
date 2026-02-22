import React from 'react';
import Button from '../Button/Button';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          Education, Engineered for Impact.
        </h1>
        
        <p className="hero-description">
          Our AI-Powered learning risk prediction and intervention system transforms 
          raw educational data into actionable, predictive insights that supports 
          timely and effective decision making for institutions.
        </p>

        <div className="hero-buttons">
          <Button variant="secondary" size="medium" outline={true} className="hero-demo-btn">
            Request a Demo
          </Button>
          <Button variant="white" size="medium">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;