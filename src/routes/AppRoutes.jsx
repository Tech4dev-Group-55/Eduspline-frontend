import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Signup from '../pages/Signup/Signup';
import Login from '../pages/Login/Login';
import VerifyEmail from '../pages/VerifyEmail/VerifyEmail';
import GoogleCallback from '../pages/GoogleCallback/GoogleCallback';
import Verification from '../pages/Verification/Verification';
import Onboarding from '../pages/Onboarding/Onboarding';
import AcceptInvite from '../pages/AcceptInvite/AcceptInvite';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import DashboardData from '../pages/AdminDashboard/DashboardData';
import LoadingScreen from '../pages/AdminDashboard/LoadingScreen';
import Settings from '../pages/AdminDashboard/Settings';
import Insights from '../pages/AdminDashboard/Insights';
import StudentDashboard from '../pages/StudentDashboard/StudentDashboard';
import AdminRoute from './AdminRoute';
import OnboardingGuard from './OnboardingGuard';


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />

        {/* Onboarding — only for admins who haven't onboarded yet */}
        <Route path="/onboarding" element={<OnboardingGuard><Onboarding /></OnboardingGuard>} />

        {/* Admin Dashboard Routes — requires completed onboarding */}
        <Route path="/admin-dashboard" element={<AdminRoute><DashboardData /></AdminRoute>} />
        <Route path="/admin-dashboard/upload" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin-dashboard/loading" element={<AdminRoute><LoadingScreen /></AdminRoute>} />
        <Route path="/admin-dashboard/settings" element={<AdminRoute><Settings /></AdminRoute>} />
        <Route path="/admin-dashboard/insights" element={<AdminRoute><Insights /></AdminRoute>} />

        {/* Student/Learner Dashboard Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/learner/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
