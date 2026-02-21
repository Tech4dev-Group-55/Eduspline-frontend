import React from 'react';
import './Stat.css';

const Stat = () => {
  return (
    <section className="stat">
      <div className="stat-container">
        <img src="../../images/learnersrating.png" alt="9000+ Learners" className="stat-image" />
        <img src="/images/successrating.png" alt="8000+ Success Stories" className="stat-image" />
        <img src="/images/institutionrating.png" alt="100+ Institutions" className="stat-image" />
        <img src="/images/fivestar.png" alt="4.8 Rating" className="stat-image" />
      </div>
    </section>
  );
};

export default Stat;