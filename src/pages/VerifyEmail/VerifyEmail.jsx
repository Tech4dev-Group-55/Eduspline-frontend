import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './VerifyEmail.css';

const BASE_URL = 'https://eduspline-backend.onrender.com/api';

const STATUS = {
  PENDING:  'pending',   // still calling the API
  SUCCESS:  'success',
  ERROR:    'error',
  NO_TOKEN: 'no_token',
};

const VerifyEmail = () => {
  const [searchParams]  = useSearchParams();
  const [status, setStatus]   = useState(STATUS.PENDING);
  const [message, setMessage] = useState('');

  useEffect(() => {
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
          setMessage(
            data.message || 'Verification failed. The link may have expired or is invalid.'
          );
        }
      } catch {
        setStatus(STATUS.ERROR);
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-card">

        {status === STATUS.PENDING && (
          <>
            <div className="verify-spinner" aria-label="Verifying…" />
            <h1 className="verify-title">Verifying your email…</h1>
            <p className="verify-subtitle">Please wait a moment.</p>
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <div className="verify-icon verify-icon--success" aria-hidden="true">✅</div>
            <h1 className="verify-title">Email verified!</h1>
            <p className="verify-subtitle">{message}</p>
            <Link to="/login" className="verify-cta-button">
              Continue to Login
            </Link>
          </>
        )}

        {status === STATUS.ERROR && (
          <>
            <div className="verify-icon verify-icon--error" aria-hidden="true">❌</div>
            <h1 className="verify-title">Verification failed</h1>
            <p className="verify-subtitle">{message}</p>
            <div className="verify-actions">
              <Link to="/signup" className="verify-cta-button">
                Sign up again
              </Link>
              <Link to="/login" className="verify-link">
                Back to Login
              </Link>
            </div>
          </>
        )}

        {status === STATUS.NO_TOKEN && (
          <>
            <div className="verify-icon verify-icon--error" aria-hidden="true">⚠️</div>
            <h1 className="verify-title">Invalid link</h1>
            <p className="verify-subtitle">
              No verification token found. Please use the link from your email.
            </p>
            <Link to="/login" className="verify-cta-button">
              Back to Login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;