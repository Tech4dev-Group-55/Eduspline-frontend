import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Signup.css';

// ── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: 'length',    label: 'At least 8 characters',          test: (v) => v.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter (A–Z)',      test: (v) => /[A-Z]/.test(v) },
  { id: 'lowercase', label: 'One lowercase letter (a–z)',      test: (v) => /[a-z]/.test(v) },
  { id: 'number',    label: 'One number (0–9)',                test: (v) => /[0-9]/.test(v) },
  { id: 'special',   label: 'One special character (* or #)',  test: (v) => /[*#]/.test(v) },
];

const getPasswordStrength = (password) => {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (passed <= 1) return { level: 'weak',   label: 'Weak',   width: '20%' };
  if (passed === 2) return { level: 'fair',   label: 'Fair',   width: '40%' };
  if (passed === 3) return { level: 'good',   label: 'Good',   width: '60%' };
  if (passed === 4) return { level: 'strong', label: 'Strong', width: '80%' };
  return               { level: 'great',  label: 'Great',  width: '100%' };
};

// ── Field-level validation ────────────────────────────────────────────────────
const validateField = (name, value, formData) => {
  switch (name) {
    case 'email':
      if (!value.trim())               return 'Institution email is required.';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address.';
      return null;

    case 'password': {
      if (!value) return 'Password is required.';
      const failedRules = PASSWORD_RULES.filter((r) => !r.test(value));
      if (failedRules.length > 0)
        return `Password must include: ${failedRules.map((r) => r.label.toLowerCase()).join(', ')}.`;
      return null;
    }

    case 'confirmPassword':
      if (!value)                          return 'Please confirm your password.';
      if (value !== formData.password)     return 'Passwords do not match.';
      return null;

    default:
      return null;
  }
};

const validateAll = (formData) => {
  const errors = {};
  ['email', 'password', 'confirmPassword'].forEach((field) => {
    const err = validateField(field, formData[field], formData);
    if (err) errors[field] = err;
  });
  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────
const Signup = () => {
  const { signup, loginWithGoogle, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [successMsg, setSuccessMsg]   = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate the changed field on the fly (only if it already had an error)
    if (fieldErrors[name]) {
      const err = validateField(name, value, { ...formData, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }

    // If password changes, re-validate confirmPassword too if it was touched
    if (name === 'password' && fieldErrors.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, { ...formData, [name]: value });
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }

    if (submitError) setSubmitError('');
    if (error) clearError();
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value, formData);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    if (name === 'password') setPasswordFocused(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAll(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const result = await signup({ email: formData.email, password: formData.password });

    if (result.success) {
      setSuccessMsg(result.message);
      setFormData({ email: '', password: '', confirmPassword: '' });
    } else {
      setSubmitError(result.message || 'Something went wrong. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleError('');
    try {
      const result = await loginWithGoogle();
      if (!result?.success && result?.message) {
        setGoogleError(result.message || 'Google sign-in failed. Please try again.');
      }
    } catch (err) {
      setGoogleError(err?.message || 'Google sign-in failed. Please try again.');
    }
  };

  const bannerError = submitError || (error || '');

  // ── Success state ───────────────────────────────────────────────────────────
  if (successMsg) {
    return (
      <div className="signup-page">
        <div className="signup-card signup-card--success">
          <div className="success-icon" aria-hidden="true">✉️</div>
          <h1 className="signup-title">Check your email</h1>
          <p className="success-message">{successMsg}</p>
          <p className="helper-text" style={{ marginTop: '8px' }}>
            Didn't receive it? Check your spam folder or{' '}
            <button type="button" className="link-button" onClick={() => setSuccessMsg('')}>
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

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Sign up</h1>

        {bannerError && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} className="error-banner-icon" />
            {bannerError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form" noValidate>

          {/* Email */}
          <div className={`form-group${fieldErrors.email ? ' form-group--error' : ''}`}>
            <label htmlFor="email">Institution's email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="globaluniversity@gmail.com"
              autoComplete="email"
              aria-describedby={fieldErrors.email ? 'email-error' : 'email-hint'}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email ? (
              <span className="error-text" id="email-error" role="alert">
                <AlertCircle size={13} /> {fieldErrors.email}
              </span>
            ) : (
              <span className="helper-text" id="email-hint">Do not use your personal email</span>
            )}
          </div>

          {/* Password */}
          <div className={`form-group${fieldErrors.password ? ' form-group--error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => setPasswordFocused(true)}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-describedby="password-rules"
                aria-invalid={!!fieldErrors.password}
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

            {/* Strength meter — visible once user starts typing */}
            {formData.password.length > 0 && (
              <div className="strength-meter" aria-live="polite">
                <div className="strength-track">
                  <div
                    className={`strength-fill strength-fill--${strength.level}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <span className={`strength-label strength-label--${strength.level}`}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Rule checklist — visible while input is focused or has an error */}
            {(passwordFocused || fieldErrors.password) && (
              <ul className="password-rules" id="password-rules" role="list">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(formData.password);
                  return (
                    <li
                      key={rule.id}
                      className={`password-rule ${passed ? 'password-rule--pass' : 'password-rule--fail'}`}
                    >
                      {passed
                        ? <CheckCircle2 size={13} className="rule-icon rule-icon--pass" />
                        : <XCircle      size={13} className="rule-icon rule-icon--fail" />
                      }
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div className={`form-group${fieldErrors.confirmPassword ? ' form-group--error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-error' : undefined}
                aria-invalid={!!fieldErrors.confirmPassword}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {fieldErrors.confirmPassword ? (
              <span className="error-text" id="confirm-error" role="alert">
                <AlertCircle size={13} /> {fieldErrors.confirmPassword}
              </span>
            ) : formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password ? (
              <span className="success-text">
                <CheckCircle2 size={13} /> Passwords match
              </span>
            ) : null}
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
          onClick={handleGoogleSignup}
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

        <p className="signup-link" style={{ marginTop: '16px' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;