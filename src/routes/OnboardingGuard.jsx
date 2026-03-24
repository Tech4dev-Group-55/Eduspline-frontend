import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects the onboarding route.
 * - Not logged in → /login
 * - Already onboarded admin → /admin-dashboard
 * - Non-admin → respective dashboard
 * - Admin who hasn't onboarded → render children (onboarding page)
 */
const OnboardingGuard = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/learner/dashboard" replace />;
  }

  const onboarded = localStorage.getItem('onboardingComplete') === 'true';
  if (onboarded) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default OnboardingGuard;
