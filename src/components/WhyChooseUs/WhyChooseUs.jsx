import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
    return (
        <section className="why-choose-us-section">
            <div className="bg-pattern-placeholder">
                {/* Placeholder for the curved line background image */}
            </div>

            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Why Choose Us
                        <span className="title-underline"></span>
                    </h2>
                </div>

                <div className="features-grid">
                    {/* Item 1 */}
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                <polyline points="16 7 22 7 22 13"></polyline>
                            </svg>
                        </div>
                        <h3 className="feature-title">Designed for Scale</h3>
                        <p className="feature-desc">From 100 learners to 100,000+, our architecture supports growth without performance trade-offs.</p>
                    </div>

                    {/* Item 2 */}
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                        </div>
                        <h3 className="feature-title">Student-first Engineering</h3>
                        <p className="feature-desc">Every feature is grounded in instructional design principles, not mere feature bloat.</p>
                    </div>

                    {/* Item 3 */}
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                            </svg>
                        </div>
                        <h3 className="feature-title">Data you can Act on</h3>
                        <p className="feature-desc">Insights are translated into actionable recommendations, not raw dashboards.</p>
                    </div>

                    {/* Item 4 */}
                    <div className="feature-item width-half">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </div>
                        <h3 className="feature-title">Operational Efficiency</h3>
                        <p className="feature-desc">Reduce administrative overhead through automation, structured workflows, and centralized visibility.</p>
                    </div>

                    {/* Item 5 */}
                    <div className="feature-item width-half">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <h3 className="feature-title">Entreprise-Grade Security</h3>
                        <p className="feature-desc">SOC-Compliant infrastructure, role-based permission, and encrypted data storage.</p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
