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
import LearnerInsights from '../pages/StudentDashboard/LearnerInsights';

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
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<DashboardData />} />
        <Route path="/admin-dashboard/upload" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/loading" element={<LoadingScreen />} />
        <Route path="/admin-dashboard/settings" element={<Settings />} />
        <Route path="/admin-dashboard/insights" element={<Insights />} />

        {/* Student/Learner Dashboard Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-dashboard/insights" element={<LearnerInsights />} />
        <Route path="/learner/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;