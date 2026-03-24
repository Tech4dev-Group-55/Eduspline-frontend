import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, XCircle, X, Info } from 'lucide-react';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Signup.css';

// ── Toast system ──────────────────────────────────────────────────────────────
let _toastId = 0;
const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'error', title, message, duration = 5000 }) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

const TOAST_ICONS = {
  error:   <AlertCircle size={18} />,
  success: <CheckCircle2 size={18} />,
  info:    <Info size={18} />,
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container" aria-live="assertive" aria-atomic="false">
    {toasts.map((t) => (
      <div key={t.id} className={`toast toast--${t.type}`} role="alert">
        <span className="toast-icon">{TOAST_ICONS[t.type]}</span>
        <div className="toast-body">
          {t.title && <strong className="toast-title">{t.title}</strong>}
          {t.message && <span className="toast-message">{t.message}</span>}
        </div>
        <button
          type="button"
          className="toast-close"
          onClick={() => removeToast(t.id)}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

// ── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: 'length',    label: 'At least 8 characters',              test: (v) => v.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter (A–Z)',          test: (v) => /[A-Z]/.test(v) },
  { id: 'lowercase', label: 'One lowercase letter (a–z)',          test: (v) => /[a-z]/.test(v) },
  { id: 'number',    label: 'One number (0–9)',                    test: (v) => /[0-9]/.test(v) },
  { id: 'special',   label: 'One special character (@, *, #, !…)', test: (v) => /[@*#!$%^&()\-_=+[\]{};:'",.<>?/\\|`~]/.test(v) },
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
        return `Missing: ${failedRules.map((r) => r.label.toLowerCase()).join(', ')}.`;
      return null;
    }

    case 'confirmPassword':
      if (!value)                      return 'Please confirm your password.';
      if (value !== formData.password) return 'Passwords do not match.';
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
  const { signup, loginWithGoogle, error, clearError } = useAuth();
  const { toasts, addToast, removeToast } = useToasts();

  const [formData, setFormData]                       = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors]                 = useState({});
  const [successMsg, setSuccessMsg]                   = useState('');
  const [passwordFocused, setPasswordFocused]         = useState(false);
  const [submitting, setSubmitting]                   = useState(false);
  // Track which fields have been touched (blurred at least once)
  const [touched, setTouched]                         = useState({});

  // Refs for focusing first error field on submit
  const emailRef          = useRef(null);
  const passwordRef       = useRef(null);
  const confirmRef        = useRef(null);
  const fieldRefs         = { email: emailRef, password: passwordRef, confirmPassword: confirmRef };

  // Show rules when focused OR when the field has been touched + has an error
  const showPasswordRules = passwordFocused || (touched.password && !!fieldErrors.password);

  const strength = getPasswordStrength(formData.password);

  // Sync AuthContext errors → toast
  useEffect(() => {
    if (error) {
      addToast({ type: 'error', title: 'Authentication error', message: error });
      clearError();
    }
  }, [error, addToast, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live re-validate only if field was already touched
    if (touched[name]) {
      const err = validateField(name, value, { ...formData, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }

    // Re-validate confirmPassword cross-field dependency
    if (name === 'password' && touched.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, { ...formData, [name]: value });
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value, formData);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    if (name === 'password') setPasswordFocused(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched so errors become visible
    setTouched({ email: true, password: true, confirmPassword: true });

    const errors = validateAll(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      // Focus first errored field
      const firstField = ['email', 'password', 'confirmPassword'].find((f) => errors[f]);
      fieldRefs[firstField]?.current?.focus();

      // Toast summarising what's wrong
      const summary = Object.values(errors).join(' • ');
      addToast({
        type: 'error',
        title: 'Please fix the following',
        message: summary,
        duration: 7000,
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await signup({ email: formData.email, password: formData.password });

      if (result.success) {
        setSuccessMsg(result.message);
        setFormData({ email: '', password: '', confirmPassword: '' });
        setTouched({});
        setFieldErrors({});
        addToast({
          type: 'success',
          title: 'Account created!',
          message: result.message,
          duration: 0, // persist until dismissed
        });
      } else {
        addToast({
          type: 'error',
          title: 'Sign up failed',
          message: result.message || 'Something went wrong. Please try again.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result?.success && result?.message) {
        addToast({
          type: 'error',
          title: 'Google sign-in failed',
          message: result.message || 'Please try again.',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Google sign-in failed',
        message: err?.message || 'Please try again.',
      });
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (successMsg) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
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
      </>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="signup-page">
        <div className="signup-card">
          <h1 className="signup-title">Sign up</h1>

          <form onSubmit={handleSubmit} className="signup-form" noValidate>

            {/* Email */}
            <div className={`form-group${fieldErrors.email ? ' form-group--error' : ''}`}>
              <label htmlFor="email">Institution's email</label>
              <input
                ref={emailRef}
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
                  ref={passwordRef}
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

              {/* Strength meter */}
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

              {/* Rule checklist — visible while focused OR after a failed submit/blur */}
              {showPasswordRules && (
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

              {/* Inline error only shown after blur / submit when rules list is hidden */}
              {fieldErrors.password && !showPasswordRules && (
                <span className="error-text" id="password-error" role="alert">
                  <AlertCircle size={13} /> {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className={`form-group${fieldErrors.confirmPassword ? ' form-group--error' : ''}`}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="password-input-wrapper">
                <input
                  ref={confirmRef}
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
              disabled={submitting}
              className="continue-button"
            >
              {submitting ? 'Creating account…' : 'Continue'}
            </Button>
          </form>

          <div className="divider"><span>Or</span></div>

          <button
            type="button"
            className="google-button"
            onClick={handleGoogleSignup}
            disabled={submitting}
          >
            Continue with Google
          </button>

          <p className="signup-link" style={{ marginTop: '16px' }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;