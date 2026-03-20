import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './VerifyEmail.css';

const BASE_URL = 'https://eduspline-backend-0y8n.onrender.com/api';

const STATUS = {
  PENDING:  'pending',
  SUCCESS:  'success',
  ERROR:    'error',
  NO_TOKEN: 'no_token',
};

const VerifyEmail = () => {
  const [searchParams]        = useSearchParams();
  const [status, setStatus]   = useState(STATUS.PENDING);
  const [message, setMessage] = useState('');
  const hasCalled             = useRef(false); // ← prevents StrictMode double-call

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setStatus(STATUS.NO_TOKEN);
      return;
    }

    const verify = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus(STATUS.SUCCESS);
          setMessage(data.message || 'Your email has been verified successfully!');
        } else {
          setStatus(STATUS.ERROR);
          setMessage(data.message || 'Verification failed. The link may have expired or is invalid.');
        }
      } catch {
        setStatus(STATUS.ERROR);
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="verify-page">
      <div className="verify-blob verify-blob--1" />
      <div className="verify-blob verify-blob--2" />

      <div className="verify-card">

        {status === STATUS.PENDING && (
          <div className="verify-state">
            <div className="verify-spinner-wrap">
              <div className="verify-spinner" />
            </div>
            <h1 className="verify-title">Verifying your email</h1>
            <p className="verify-subtitle">Hang tight, this will only take a second…</p>
          </div>
        )}

        {status === STATUS.SUCCESS && (
          <div className="verify-state">
            <div className="verify-icon-wrap verify-icon-wrap--success">
              <svg viewBox="0 0 24 24" fill="none" className="verify-svg">
                <circle cx="12" cy="12" r="12" fill="#22c55e" opacity=".15"/>
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="verify-title">Email verified!</h1>
            <p className="verify-subtitle">{message}</p>
            <Link to="/login" className="verify-btn verify-btn--primary">
              Continue to Login
            </Link>
          </div>
        )}

        {status === STATUS.ERROR && (
          <div className="verify-state">
            <div className="verify-icon-wrap verify-icon-wrap--error">
              <svg viewBox="0 0 24 24" fill="none" className="verify-svg">
                <circle cx="12" cy="12" r="12" fill="#ef4444" opacity=".15"/>
                <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="verify-title">Verification failed</h1>
            <p className="verify-subtitle">{message}</p>
            <div className="verify-actions">
              <Link to="/login" className="verify-btn verify-btn--primary">Back to Login</Link>
              <Link to="/signup" className="verify-btn verify-btn--ghost">Sign up again</Link>
            </div>
          </div>
        )}

        {status === STATUS.NO_TOKEN && (
          <div className="verify-state">
            <div className="verify-icon-wrap verify-icon-wrap--warn">
              <svg viewBox="0 0 24 24" fill="none" className="verify-svg">
                <circle cx="12" cy="12" r="12" fill="#f59e0b" opacity=".15"/>
                <path d="M12 8v4M12 16h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="verify-title">Invalid link</h1>
            <p className="verify-subtitle">
              No verification token was found. Please use the link from your email.
            </p>
            <Link to="/login" className="verify-btn verify-btn--primary">Back to Login</Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;