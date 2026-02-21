import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about">
      <div className="about-container">
        
        <div className="about-image">
          <img src="/images/aboutimage.png" alt="About EduSpline" />
        </div>

        <div className="about-content">
          <h2>About EduSpline</h2>
          <div className="orange-line"></div>
          
          <p className="about-subtitle">Reimagining Education Infrastructure.</p>
          
          <p>EduSpline was founded on a simple principle: learning systems should empower learners, educators and administrators, not overwhelm them.</p>
          
          <p>We combine deep research, product thinking, analytical models, platform infrastructure and responsible AI system to build a solution that supports quality education and learning outcomes.</p>
          
          <p>We do not build tools, we build scalable learning systems that empower and evolve.</p>
        </div>

      </div>
    </section>
  );
};

export default About;