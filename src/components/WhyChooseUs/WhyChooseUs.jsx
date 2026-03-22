import React from 'react';
import './WhyChooseUs.css';

const renderRibbon = (lines, basePhase, freq, centerAmp, spreadAmp, colorParams) => {
    return Array.from({ length: lines }).map((_, i) => {
        const linePhase = (i / lines) * Math.PI * 2 + basePhase;
        let d = '';
        for (let x = 0; x <= 1440; x += 15) {
            const nx = x / 1440;
            const centerY = 400 + Math.sin(nx * Math.PI * 1.5) * centerAmp + Math.cos(nx * Math.PI * 2) * centerAmp * 0.5;
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

const WavyBackground = () => (
    <svg
        className="wavy-bg-svg"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                <stop offset="25%" stopColor="rgba(59, 130, 246, 0.2)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
                <stop offset="75%" stopColor="rgba(59, 130, 246, 0.2)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                <stop offset="30%" stopColor="rgba(99, 102, 241, 0.15)" />
                <stop offset="60%" stopColor="rgba(99, 102, 241, 0.3)" />
                <stop offset="90%" stopColor="rgba(99, 102, 241, 0)" />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(147, 197, 253, 0)" />
                <stop offset="40%" stopColor="rgba(147, 197, 253, 0.2)" />
                <stop offset="80%" stopColor="rgba(147, 197, 253, 0.4)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0)" />
            </linearGradient>
        </defs>
        {renderRibbon(15, 0, 3, -100, 120, { stroke: 'url(#grad1)', weight: 1.5, opacity: 0.8 })}
        {renderRibbon(12, Math.PI / 4, 4, 150, 90, { stroke: 'url(#grad2)', weight: 1, opacity: 0.6 })}
        {renderRibbon(20, Math.PI / 2, 2.5, 50, 150, { stroke: 'url(#grad3)', weight: 0.8, opacity: 0.7 })}
    </svg>
);

const WhyChooseUs = () => {
    return (
        <section id="why-choose" className="why-choose-us-section">
            <div className="wavy-bg-container">
                <WavyBackground />
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