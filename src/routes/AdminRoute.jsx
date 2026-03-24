import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects admin dashboard routes.
 * - Not logged in → /login
 * - Logged-in admin without onboarding → /onboarding
 * - Logged-in non-admin → respective dashboard
 * - Logged-in onboarded admin → render children
 */
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/learner/dashboard" replace />;
  }

  const onboarded = localStorage.getItem('onboardingComplete') === 'true';
  if (!onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default AdminRoute;
