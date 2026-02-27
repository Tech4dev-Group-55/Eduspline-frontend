import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './GoogleCallback.css';

/**
 * Handles Google OAuth redirects from the backend.
 *
 * Backend uses two routes for the same pattern (?token=JWT):
 *   - /auth/google/callback  → new user
 *   - /auth/callback         → existing user
 *
 * Register this component on both routes in your router.
 * We fetch /api/auth/me with the token to get the user object.
 */

const BASE_URL = 'https://eduspline-backend.onrender.com/api';

const GoogleCallback = () => {
  const [searchParams]      = useSearchParams();
  const { handleGoogleCallback } = useAuth();
  const navigate                 = useNavigate();
  const [errorMsg, setErrorMsg]  = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setErrorMsg('Google sign-in was cancelled or failed. Please try again.');
      return;
    }

    if (!token) {
      setErrorMsg('No token received from Google. Please try again.');
      return;
    }

    // Decode the JWT payload to extract user data (no extra endpoint needed)
    const fetchUser = async () => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // payload contains { id, iat, exp } — build a minimal user object
        const user = {
          id:    payload.id,
          email: payload.email || '',
          role:  payload.role || 'admin',
        };
        const redirectTo = handleGoogleCallback(token, user);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setErrorMsg('Failed to read token. Please try again.');
      }
    };

    fetchUser();
  }, [searchParams, handleGoogleCallback, navigate]);

  if (errorMsg) {
    return (
      <div className="google-callback-page">
        <div className="google-callback-card">
          <div className="callback-icon" aria-hidden="true">❌</div>
          <h1 className="callback-title">Sign-in failed</h1>
          <p className="callback-subtitle">{errorMsg}</p>
          <a href="/login" className="callback-cta">Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="google-callback-page">
      <div className="google-callback-card">
        <div className="callback-spinner" aria-label="Signing you in…" />
        <h1 className="callback-title">Signing you in…</h1>
        <p className="callback-subtitle">Just a moment.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;