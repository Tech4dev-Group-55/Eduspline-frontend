import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BASE_URL = 'https://eduspline-backend-0y8n.onrender.com/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true on mount while we rehydrate
  const [error, setError]     = useState(null);

  // ─── Rehydrate from localStorage on first load ───────────────────────────
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser  = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupt storage — clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const persistSession = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingComplete');
    setToken(null);
    setUser(null);
  };

  const getRoleRedirect = (role) => {
    if (role === 'admin') {
      const onboarded = localStorage.getItem('onboardingComplete');
      return onboarded === 'true' ? '/admin-dashboard' : '/onboarding';
    }
    switch (role) {
      case 'educator': return '/educator/dashboard';
      default:         return '/learner/dashboard';
    }
  };

  // ─── signup ──────────────────────────────────────────────────────────────
  // Returns { success, message } — does NOT log the user in (needs email verify)
  const signup = useCallback(async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/signup`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password, confirmPassword: password }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || 'Signup failed. Please try again.';
        setError(msg);
        return { success: false, message: msg };
      }

      return {
        success: true,
        message: data.message || 'Account created! Check your email to verify your account.',
      };
    } catch {
      const msg = 'Network error. Please check your connection.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── login ───────────────────────────────────────────────────────────────
  // Returns { success, message, redirectTo? }
  const login = useCallback(async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || 'Login failed. Please try again.';
        setError(msg);
        return { success: false, message: msg };
      }

      persistSession(data.accessToken, data.user);
      const redirectTo = getRoleRedirect(data.user?.role);
      return { success: true, redirectTo };
    } catch {
      const msg = 'Network error. Please check your connection.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── loginWithGoogle ──────────────────────────────────────────────────────
  // Redirects the browser to the backend Google OAuth entry point.
  // The backend will redirect back to /auth/google/callback?token=...
  const loginWithGoogle = useCallback(() => {
    window.location.href = `${BASE_URL}/auth/google`;
  }, []);

  // ─── handleGoogleCallback ─────────────────────────────────────────────────
  // Called by <GoogleCallback /> page after the redirect lands.
  // Expects token + user either in query params or a JSON body from the backend.
  const handleGoogleCallback = useCallback((token, user) => {
    persistSession(token, user);
    return getRoleRedirect(user?.role);
  }, []);

  // ─── logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
    setError(null);
    window.location.href = '/login';
  }, []);

  // ─── Role helpers ─────────────────────────────────────────────────────────
  const isAdmin    = user?.role === 'admin';
  const isEducator = user?.role === 'educator';
  const isLearner  = user?.role === 'learner' || (!isAdmin && !isEducator && !!user);
  const isLoggedIn = !!token && !!user;

  // ─── clearError ───────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        // State
        user,
        token,
        loading,
        error,
        isLoggedIn,
        // Role helpers
        isAdmin,
        isEducator,
        isLearner,
        // Methods
        signup,
        login,
        logout,
        loginWithGoogle,
        handleGoogleCallback,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ───────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export default AuthContext;