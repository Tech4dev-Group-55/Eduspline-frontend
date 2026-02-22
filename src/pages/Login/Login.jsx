import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await fetch('/api/auth/login', {
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
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on user role
        const role = data.user?.role || 'learner';
        if (role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else if (role === 'educator') {
          window.location.href = '/educator/dashboard';
        } else {
          window.location.href = '/learner/dashboard';
        }
      } else {
        setErrors({ form: data.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      // Backend not ready - simulate success for testing
      console.log('Backend not connected. Simulating login...');
      alert('Login successful! (Demo mode - backend not connected)\n\nRedirecting to dashboard...');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth when ready
    console.log('Google login clicked');
    alert('Google Login will be implemented when backend is ready!');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Log in</h1>

        {errors.form && (
          <div className="error-banner">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
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

          {/* Continue Button */}
          <Button 
            variant="primary" 
            size="large" 
            type="submit"
            disabled={loading}
            className="continue-button"
          >
            {loading ? 'Logging in...' : 'Continue'}
          </Button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Or</span>
        </div>

        {/* Google Login */}
        <button 
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        {/* Sign up link */}
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;