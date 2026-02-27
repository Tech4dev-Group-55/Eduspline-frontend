import React from 'react';
import './Pricing.css';

const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    features: [
      "For small institutions and pilot programs",
      "Standard analytics and intervention model",
      "Up to 500 learners",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    features: [
      "For expanding institutions.",
      "API integrations.",
      "Advanced analytics.",
      "Up to 10,000 learners.",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    features: [
      "For large-scale organizations.",
      "Unlimited learners.",
      "Custom integrations.",
      "SLA-backed uptime.",
    ],
  },
];

const Pricing = () => {
  return (
    <section className="pricing-section">
      <div className="pricing-top-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Pricing
              <span className="title-underline"></span>
            </h2>
          </div>

          <div className="pricing-cards">
            {PRICING_PLANS.map((plan) => (
              <div key={plan.id} className="pricing-card">
                <h3 className="pricing-tier-name">{plan.name}</h3>
                <div className="card-divider"></div>
                <ul className="pricing-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="pricing-cta-banner">
        <div className="container banner-container">
          <div className="banner-text-content">
            <p className="banner-heading">If learning outcomes matter to your organization, EduSpline is built for you.</p>
            <p className="banner-subheading">Contact us for custom pricing tailored to your institution.</p>
          </div>
          <div className="banner-button-container">
            <button className="btn-get-pricing">Get Pricing Details</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;