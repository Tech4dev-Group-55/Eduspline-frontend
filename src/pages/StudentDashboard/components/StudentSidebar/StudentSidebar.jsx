import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StudentSidebar.css';

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const close = () => setIsOpen(false);

  return (
    <>
      <button className="student-hamburger" onClick={() => setIsOpen(prev => !prev)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      {isOpen && <div className="student-sidebar-overlay" onClick={close} />}

      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
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
            onClick={() => { navigate('/student-dashboard'); close(); }}
            className={`nav-item ${isActive('/student-dashboard') ? 'active' : ''}`}
          >
            <span>📊 Dashboard</span>
          </button>

        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪 Log out</span>
        </button>
      </div>
    </>
  );
};

export default StudentSidebar;
