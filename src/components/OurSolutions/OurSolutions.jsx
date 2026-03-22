import React from 'react';
import './OurSolutions.css';
import image1 from '/images/image 1.png';
import image2 from '/images/image 2.png';
import image3 from '/images/image 3.png';

const OurSolutions = () => {
  return (
    <section id="solutions" className="solutions-section">
      <div className="container">
        <h2 className="section-title">
          Our Solutions
          <span className="title-underline"></span>
        </h2>

        <div className="solutions-list">
          {/* Solution 1 */}
          <div className="solution-item">
            <div className="solution-image-container">
              <img src={image1} alt="Analysis & Insight Engine" className="solution-image" />
            </div>

            <div className="solution-text-card">
              <div className="solution-header">
                <h3 className="solution-heading">Analysis & Insight Engine</h3>
                <div className="icon chart-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
              </div>
              <p className="solution-subtitle">Move beyond attendance tracking:</p>
              <ul className="solution-features">
                <li>Real-time learner progress monitoring.</li>
                <li>Skill mastery heatmaps.</li>
                <li>Cohort performance analysis.</li>
                <li>Institutional-level reporting.</li>
              </ul>
              <p className="solution-footer">Make data-informed academic decisions with clarity.</p>
            </div>
          </div>

          {/* Solution 2 */}
          <div className="solution-item reverse">
            <div className="solution-text-card">
              <div className="solution-header">
                <h3 className="solution-heading">Enterprise & Institutional Integrations</h3>
                <div className="icon building-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M9 8h1"></path>
                    <path d="M9 12h1"></path>
                    <path d="M9 16h1"></path>
                    <path d="M14 8h1"></path>
                    <path d="M14 12h1"></path>
                    <path d="M14 16h1"></path>
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                  </svg>
                </div>
              </div>
              <p className="solution-subtitle">Seamless compatibility with:</p>
              <ul className="solution-features">
                <li>LMS systems.</li>
                <li>SIS platforms.</li>
                <li>HR systems.</li>
                <li>Credentialing platforms.</li>
              </ul>
              <p className="solution-footer">EduSpline works with your existing infrastructure, not against it.</p>
            </div>

            <div className="solution-image-container">
              <img src={image2} alt="Enterprise & Institutional Integrations" className="solution-image" />
            </div>
          </div>

          {/* Solution 3 */}
          <div className="solution-item">
            <div className="solution-image-container">
              <img src={image3} alt="Early warning & Intervention model" className="solution-image" />
            </div>

            <div className="solution-text-card">
              <div className="solution-header">
                <h3 className="solution-heading">Early warning & Intervention model</h3>
                <div className="icon shield-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
              </div>
              <p className="solution-subtitle">Move beyond static data using machine learning model:</p>
              <ul className="solution-features">
                <li>Predict dropout risk.</li>
                <li>Explain what factors contributed to risk.</li>
                <li>Provides personalized areas for improvement.</li>
                <li>Tutor or Mentor intervention.</li>
              </ul>
              <p className="solution-footer">AI supports evidence-based intervention before risk occurs.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurSolutions;