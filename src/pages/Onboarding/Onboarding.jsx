import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import './Onboarding.css';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'University',
    estimatedLearners: '100',
    country: 'Nigeria'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const institutionTypes = [
    'Corporate Learning & Development',
    'Certification Body',
    'EdTech',
    'Other'
  ];

  const learnerRanges = [
    'Below 100',
    '100 - 500',
    '501 - 1000',
    'Above 1000'
  ];

  const countries = [
    'Ghana',
    'South Africa',
    'Botswana',
    'Kenya',
    'Uganda'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/onboarding/step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institution_name: formData.institutionName,
          institution_type: formData.institutionType,
          estimated_learners: formData.estimatedLearners,
          country: formData.country
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Institution registered successfully!');
        window.location.href = '/';
      } else {
        setErrors({ form: data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.log('Backend not connected. Demo mode active.');
      alert('Step 1 completed! (Demo mode)');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        
        <div className="welcome-section">
          <h1 className="onboarding-title">Welcome back!</h1>
          <p className="onboarding-subtitle">
            Let's set up your learning ecosystem.<br />
            We'll guide you through two quick steps to get your institution ready.
          </p>
        </div>

        <div className="form-section">
          <div className="step-indicator">
            <span className="step-label">Step 1:</span>
            <span className="step-name">Register</span>
          </div>

          {errors.form && (
            <div className="error-banner">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="onboarding-form">
            
            <div className="form-group">
              <label htmlFor="institutionName">Institution's name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  placeholder="Enter here"
                  className={errors.institutionName ? 'error' : ''}
                />
                <span className="info-icon">ⓘ</span>
              </div>
              {errors.institutionName && (
                <span className="error-text">{errors.institutionName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="institutionType">Institution type</label>
              <div className="select-wrapper">
                <select
                  id="institutionType"
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                >
                  <option value="University" disabled>University</option>
                  {institutionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="estimatedLearners">Estimated number of learners</label>
              <div className="select-wrapper">
                <select
                  id="estimatedLearners"
                  name="estimatedLearners"
                  value={formData.estimatedLearners}
                  onChange={handleChange}
                >
                  <option value="100" disabled>100</option>
                  {learnerRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <div className="select-wrapper">
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="Nigeria" disabled>Nigeria</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button 
              variant="primary" 
              size="large" 
              type="submit"
              disabled={loading}
              className="continue-button"
            >
              {loading ? 'Saving...' : '← Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;