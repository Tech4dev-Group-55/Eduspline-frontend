import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login, loginWithGoogle, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

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
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const result = await login({ email: formData.email, password: formData.password });

    if (result.success) {
      navigate(result.redirectTo, { replace: true });
    } else {
      setFormError(result.message);
    }
  };

  const displayError = formError || error;

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Log in</h1>

        {displayError && (
          <div className="error-banner" role="alert">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
                autoComplete="current-password"
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
          onClick={loginWithGoogle}
          disabled={loading}
        >
          Continue with Google
        </button>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;