import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StudentSidebar.css';

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/images/EdusplineLogo.png" alt="Eduspline" className="sidebar-logo" />
          <div className="logo-text">
            <h2 className="brand-name">EDUSPLINE</h2>
            <p className="brand-tagline">Data Driven Support</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button 
          onClick={() => navigate('/student-dashboard')} 
          className={`nav-item ${isActive('/student-dashboard') ? 'active' : ''}`}
        >
          <span>📊 Dashboard</span>
        </button>

        <button 
          onClick={() => navigate('/student-dashboard/insights')} 
          className={`nav-item ${isActive('/student-dashboard/insights') ? 'active' : ''}`}
        >
          <span>💡 Insights</span>
        </button>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span>🚪 Log out</span>
      </button>
    </div>
  );
};

export default StudentSidebar;