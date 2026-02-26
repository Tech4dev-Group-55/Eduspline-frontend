import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Verification.css';

const Verification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  // Check if user clicked verification link (from email)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      verifyEmail(token);
    }
  }, []);

  const verifyEmail = async (token) => {
    try {
      // TODO: Replace with actual backend endpoint
      const response = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setIsVerified(true);
        // Redirect to onboarding after 2 seconds
        setTimeout(() => {
          navigate('/onboarding');
        }, 2000);
      } else {
        alert('Verification failed: ' + (data.message || 'Invalid token'));
      }
    } catch (error) {
      console.log('Backend not connected. Simulating verification...');
      // For testing without backend
      setIsVerified(true);
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    }
  };

  const resendVerification = async () => {
  try {
    const email = localStorage.getItem('pendingEmail');
    
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      alert('✓ Verification email sent! Please check your inbox.');
    } else {
      alert('✗ Failed to resend email. Please try again.');
    }
  } catch (error) {
    // Backend not ready - just log it, no alert for demo
    console.log('Backend not connected - resend feature will work when backend is ready.');
    // Don't show alert in demo mode - just log to console
  }
};

  return (
    <div className="verification-page">
      <div className="verification-card">
        <h1 className="verification-title">
          {isVerified ? 'Email Verified!' : 'Verification'}
        </h1>

        <div className="mailbox-icon">
          {/* Using your saved SVG file */}
          <img src="/icons/mailbox-icon.svg" alt="Email verification" />
        </div>

        {isVerified ? (
          <p className="verification-message">
  We've sent a confirmation link to your inbox. Please verify to activate your account.
</p>
        ) : (
          <>
            <p className="verification-message">
  We've sent a confirmation link to your inbox. Please verify to activate your account.
</p>

            <button onClick={resendVerification} className="resend-button">
              Didn't receive the email? Resend
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verification;