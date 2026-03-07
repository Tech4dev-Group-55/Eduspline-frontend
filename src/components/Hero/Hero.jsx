import React from 'react';
import Button from '../Button/Button';
import './Hero.css';

const renderHeroRibbon = (lines, basePhase, freq, centerAmp, spreadAmp, colorParams) => {
  return Array.from({ length: lines }).map((_, i) => {
    const linePhase = (i / lines) * Math.PI * 2 + basePhase;
    let d = '';
    for (let x = 0; x <= 2880; x += 15) {
      const nx = x / 1440; // Normalize based on single viewport width for matching wavelength
      const centerY = 300 + Math.sin(nx * Math.PI * 1.5) * centerAmp + Math.cos(nx * Math.PI * 2) * centerAmp * 0.5;
      const spread = spreadAmp * (0.8 + 0.4 * Math.sin(nx * Math.PI * 3));
      const y = centerY + Math.sin(nx * Math.PI * freq + linePhase) * spread;
      d += `${x === 0 ? 'M' : 'L'} ${x} ${y.toFixed(2)} `;
    }
    return (
      <path
        key={`${freq}-${linePhase}`}
        d={d}
        fill="none"
        stroke={colorParams.stroke}
        strokeWidth={colorParams.weight}
        opacity={colorParams.opacity}
      />
    );
  });
};

const HeroWavyBackground = () => (
  <div className="hero-wavy-container">
    <svg
      className="hero-wavy-svg"
      viewBox="0 0 2880 600"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hero-grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
          <stop offset="25%" stopColor="rgba(59, 130, 246, 0.2)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
          <stop offset="75%" stopColor="rgba(59, 130, 246, 0.2)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
        </linearGradient>
        <linearGradient id="hero-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
          <stop offset="30%" stopColor="rgba(99, 102, 241, 0.15)" />
          <stop offset="60%" stopColor="rgba(99, 102, 241, 0.3)" />
          <stop offset="90%" stopColor="rgba(99, 102, 241, 0)" />
        </linearGradient>
        <linearGradient id="hero-grad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(147, 197, 253, 0)" />
          <stop offset="40%" stopColor="rgba(147, 197, 253, 0.2)" />
          <stop offset="80%" stopColor="rgba(147, 197, 253, 0.4)" />
          <stop offset="100%" stopColor="rgba(147, 197, 253, 0)" />
        </linearGradient>
      </defs>
      {renderHeroRibbon(15, 0, 3, -80, 100, { stroke: 'url(#hero-grad1)', weight: 1.5, opacity: 0.8 })}
      {renderHeroRibbon(12, Math.PI / 4, 4, 120, 70, { stroke: 'url(#hero-grad2)', weight: 1, opacity: 0.6 })}
      {renderHeroRibbon(20, Math.PI / 2, 2.5, 40, 120, { stroke: 'url(#hero-grad3)', weight: 0.8, opacity: 0.7 })}
    </svg>
  </div>
);

const Hero = () => {
  return (
    <section className="hero">
      <HeroWavyBackground />
      <div className="hero-container">
        <div className="hero-title-wrapper">
          <h1 className="hero-title">
            Education, Engineered for Impact.
          </h1>
          <div className="glowing-slit-container">
            <div className="glowing-slit"></div>
            <div className="slit-shadow"></div>
          </div>
        </div>

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