import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button/Button';
import './AcceptInvite.css';

const BASE_URL = 'https://eduspline-backend-0y8n.onrender.com/api';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldError, setFieldError] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="accept-invite-page">
        <div className="accept-invite-card">
          <AlertCircle size={48} className="error-icon" />
          <h1>Invalid Invitation Link</h1>
          <p>This invitation link is missing or invalid. Please check your email for the correct link.</p>
          <Link to="/login" className="back-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    if (!formData.password) return { field: 'password', message: 'Password is required.' };
    if (formData.password.length < 8)
      return { field: 'password', message: `Password must be at least 8 characters (${formData.password.length}/8).` };
    if (!formData.confirmPassword) return { field: 'confirmPassword', message: 'Please confirm your password.' };
    if (formData.password !== formData.confirmPassword)
      return { field: 'confirmPassword', message: 'Passwords do not match.' };
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldError?.field === name) setFieldError(null);
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const res = await fetch(`${BASE_URL}/team/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || 'Failed to set password. Please try again.');
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch {
      setSubmitError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="accept-invite-page">
        <div className="accept-invite-card">
          <CheckCircle size={48} className="success-icon" />
          <h1>Password Set Successfully!</h1>
          <p>Your account is ready. Redirecting you to login...</p>
          <Link to="/login" className="back-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-invite-page">
      <div className="accept-invite-card">
        <h1 className="accept-invite-title">Set Your Password</h1>
        <p className="accept-invite-subtitle">
          Welcome! Create a password to complete your account setup.
        </p>

        {submitError && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} />
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="accept-invite-form" noValidate>
          <div className={`form-group${fieldError?.field === 'password' ? ' form-group--error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldError?.field === 'password' ? (
              <span className="error-text" role="alert">
                <AlertCircle size={13} />
                {fieldError.message}
              </span>
            ) : (
              <div className="password-requirements">
                <span className="helper-text">Must be 8 characters or more</span>
                <span className={`char-counter${formData.password.length >= 8 ? ' char-counter--valid' : ''}`}>
                  {formData.password.length}/8
                </span>
              </div>
            )}
          </div>

          <div className={`form-group${fieldError?.field === 'confirmPassword' ? ' form-group--error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldError?.field === 'confirmPassword' && (
              <span className="error-text" role="alert">
                <AlertCircle size={13} />
                {fieldError.message}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={loading}
            className="continue-button"
          >
            {loading ? 'Setting password...' : 'Set Password'}
          </Button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default AcceptInvite;
