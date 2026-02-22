import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Must be 8 characters or more';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to login page
        alert('Account created successfully! Please log in.');
        window.location.href = '/login';
      } else {
        setErrors({ form: data.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      // Backend not ready - simulate success for testing
      console.log('Backend not connected. Simulating signup...');
      alert('Account created! (Demo mode - backend not connected)\n\nRedirecting to login page...');
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth when ready
    console.log('Google signup clicked');
    alert('Google Sign-up will be implemented when backend is ready!');
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Sign up</h1>

        {errors.form && (
          <div className="error-banner">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Institution's email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="globaluniversity@gmail.com"
              className={errors.email ? 'error' : ''}
            />
            <span className="helper-text">Do not use your personal email</span>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img 
                  src={showPassword ? "/icons/eye-open.png" : "/icons/eye-closed.png"} 
                  alt="toggle password visibility"
                  className="eye-icon"
                />
              </button>
            </div>
            <div className="password-requirements">
              <span className="helper-text">Must be 8 characters or more</span>
              <span className="char-counter">{formData.password.length}/8</span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img 
                  src={showConfirmPassword ? "/icons/eye-open.png" : "/icons/eye-closed.png"} 
                  alt="toggle password visibility"
                  className="eye-icon"
                />
              </button>
            </div>
            <div className="password-requirements">
              <span className="helper-text">Must be 8 characters or more</span>
              <span className="char-counter">{formData.confirmPassword.length}/8</span>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            variant="primary" 
            size="large" 
            type="submit"
            disabled={loading}
            className="continue-button"
          >
            {loading ? 'Creating Account...' : 'Continue'}
          </Button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Or</span>
        </div>

        {/* Google Signup */}
        <button 
          type="button"
          className="google-button"
          onClick={handleGoogleSignup}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;