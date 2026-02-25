import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const { signup, loginWithGoogle, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError]   = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
    if (error) clearError();
  };

  const validate = () => {
    if (!formData.email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Email is invalid';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be 8 characters or more';
    if (!formData.confirmPassword) return 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const result = await signup({ email: formData.email, password: formData.password });

    if (result.success) {
      setSuccessMsg(result.message);
      setFormData({ email: '', password: '', confirmPassword: '' });
    } else {
      setFormError(result.message);
    }
  };

  const displayError = formError || error;

  // ── Success state ──────────────────────────────────────────────────────────
  if (successMsg) {
    return (
      <div className="signup-page">
        <div className="signup-card signup-card--success">
          <div className="success-icon" aria-hidden="true">✉️</div>
          <h1 className="signup-title">Check your email</h1>
          <p className="success-message">{successMsg}</p>
          <p className="helper-text" style={{ marginTop: '8px' }}>
            Didn't receive it? Check your spam folder or{' '}
            <button
              type="button"
              className="link-button"
              onClick={() => setSuccessMsg('')}
            >
              try again
            </button>
            .
          </p>
          <p className="signup-link" style={{ marginTop: '24px' }}>
            Already verified? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Sign up</h1>

        {displayError && (
          <div className="error-banner" role="alert">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form" noValidate>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Institution's email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="globaluniversity@gmail.com"
              autoComplete="email"
            />
            <span className="helper-text">Do not use your personal email</span>
          </div>

          {/* Password */}
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
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <img
                  src={showPassword ? '/icons/eye-open.png' : '/icons/eye-closed.png'}
                  alt=""
                  className="eye-icon"
                />
              </button>
            </div>
            <div className="password-requirements">
              <span className="helper-text">Must be 8 characters or more</span>
              <span className="char-counter">{formData.password.length}/8</span>
            </div>
          </div>

          {/* Confirm Password */}
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
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <img
                  src={showConfirmPassword ? '/icons/eye-open.png' : '/icons/eye-closed.png'}
                  alt=""
                  className="eye-icon"
                />
              </button>
            </div>
            <div className="password-requirements">
              <span className="helper-text">Must be 8 characters or more</span>
              <span className="char-counter">{formData.confirmPassword.length}/8</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={loading}
            className="continue-button"
          >
            {loading ? 'Creating account…' : 'Continue'}
          </Button>
        </form>

        <div className="divider"><span>Or</span></div>

        <button
          type="button"
          className="google-button"
          onClick={loginWithGoogle}
          disabled={loading}
        >
          Continue with Google
        </button>

        <p className="signup-link" style={{ marginTop: '16px' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;