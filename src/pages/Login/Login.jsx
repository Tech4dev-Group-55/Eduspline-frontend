import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

// Maps API/network error messages to human-readable descriptions
const normalizeApiError = (message = '') => {
  const msg = message.toLowerCase();

  if (msg.includes('invalid credentials') || msg.includes('wrong password') || msg.includes('incorrect password'))
    return 'Incorrect email or password. Please try again.';
  if (msg.includes('user not found') || msg.includes('no account') || msg.includes('not registered'))
    return 'No account found with this email. Please sign up first.';
  if (msg.includes('too many') || msg.includes('rate limit') || msg.includes('too many attempts'))
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  if (msg.includes('email not verified') || msg.includes('unverified'))
    return 'Please verify your email before logging in. Check your inbox for the verification link.';
  if (msg.includes('account disabled') || msg.includes('account suspended') || msg.includes('blocked'))
    return 'Your account has been disabled. Please contact support for help.';
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch'))
    return 'Network error. Please check your connection and try again.';
  if (msg.includes('timeout'))
    return 'The request timed out. Please try again.';
  if (msg.includes('server') || msg.includes('500') || msg.includes('internal'))
    return 'Something went wrong on our end. Please try again in a moment.';

  // Fall back to the raw message if it's already user-facing, or a generic fallback
  return message || 'Something went wrong. Please try again.';
};

const normalizeGoogleError = (message = '') => {
  const msg = message.toLowerCase();

  if (msg.includes('popup_closed') || msg.includes('popup closed'))
    return 'Google sign-in was cancelled. Please try again.';
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Network error during Google sign-in. Please check your connection.';
  if (msg.includes('not registered') || msg.includes('no account'))
    return 'No account is linked to this Google profile. Please sign up first.';
  if (msg.includes('access_denied'))
    return 'Google sign-in was denied. Please allow access and try again.';

  return message || 'Google sign-in failed. Please try again.';
};

// Client-side validation — returns an object so each field can show its own error
const validate = (formData) => {
  if (!formData.email.trim())
    return { field: 'email', message: 'Email is required.' };
  if (!/\S+@\S+\.\S+/.test(formData.email))
    return { field: 'email', message: 'Please enter a valid email address.' };
  if (!formData.password)
    return { field: 'password', message: 'Password is required.' };
  if (formData.password.length < 8)
    return { field: 'password', message: `Password must be at least 8 characters (${formData.password.length}/8 so far).` };
  return null;
};

const Login = () => {
  const { login, loginWithGoogle, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState(null);   // { field, message }
  const [submitError, setSubmitError] = useState('');   // banner-level error
  const [googleError, setGoogleError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors on the field being edited
    if (fieldError?.field === name) setFieldError(null);
    if (submitError) setSubmitError('');
    if (googleError) setGoogleError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate(formData);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    const result = await login({ email: formData.email, password: formData.password });

    if (result.success) {
      navigate(result.redirectTo, { replace: true });
    } else {
      setSubmitError(normalizeApiError(result.message));
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleError('');
    try {
      const result = await loginWithGoogle();
      if (result?.success) {
        navigate(result.redirectTo, { replace: true });
      } else if (result?.message) {
        setGoogleError(normalizeGoogleError(result.message));
      }
    } catch (err) {
      setGoogleError(normalizeGoogleError(err?.message));
    }
  };

  // Auth context errors (e.g. session expiry surfaced externally)
  const bannerError = submitError || (error ? normalizeApiError(error) : '');

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Log in</h1>

        {bannerError && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} className="error-banner-icon" />
            {bannerError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>

          {/* Email */}
          <div className={`form-group${fieldError?.field === 'email' ? ' form-group--error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="globaluniversity@gmail.com"
              autoComplete="email"
              aria-describedby={fieldError?.field === 'email' ? 'email-error' : 'email-hint'}
              aria-invalid={fieldError?.field === 'email'}
            />
            {fieldError?.field === 'email' ? (
              <span className="error-text" id="email-error" role="alert">
                <AlertCircle size={13} />
                {fieldError.message}
              </span>
            ) : (
              <span className="helper-text" id="email-hint">Do not use your personal email</span>
            )}
          </div>

          {/* Password */}
          <div className={`form-group${fieldError?.field === 'password' ? ' form-group--error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-describedby={fieldError?.field === 'password' ? 'password-error' : 'password-hint'}
                aria-invalid={fieldError?.field === 'password'}
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
              <span className="error-text" id="password-error" role="alert">
                <AlertCircle size={13} />
                {fieldError.message}
              </span>
            ) : (
              <div className="password-requirements" id="password-hint">
                <span className="helper-text">Must be 8 characters or more</span>
                <span className={`char-counter${formData.password.length >= 8 ? ' char-counter--valid' : ''}`}>
                  {formData.password.length}/8
                </span>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={loading}
            className="continue-button"
          >
            {loading ? 'Logging in…' : 'Continue'}
          </Button>
        </form>

        <div className="divider"><span>Or</span></div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        {googleError && (
          <div className="error-banner error-banner--google" role="alert">
            <AlertCircle size={16} className="error-banner-icon" />
            {googleError}
          </div>
        )}

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;