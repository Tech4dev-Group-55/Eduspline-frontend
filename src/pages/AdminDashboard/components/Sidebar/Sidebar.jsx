import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext'; 
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger — only visible on mobile */}
      <button className="hamburger" onClick={() => setIsOpen(prev => !prev)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      {/* Overlay backdrop */}
      {isOpen && <div className="sidebar-overlay" onClick={close} />}

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
            onClick={() => { navigate('/admin-dashboard'); close(); }}
            className={`nav-item ${isActive('/admin-dashboard') || isActive('/admin-dashboard/data') ? 'active' : ''}`}
          >
            {/* Dashboard icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/>
              <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor"/>
              <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/>
            </svg>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { navigate('/admin-dashboard/insights'); close(); }}
            className={`nav-item ${isActive('/admin-dashboard/insights') ? 'active' : ''}`}
          >
            {/* Insights icon — same SVG as before */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
              <path fill="currentColor" d="M246 124a54.13 54.13 0 0 0-32-49.33V72a46 46 0 0 0-86-22.67A46 46 0 0 0 42 72v2.67a54 54 0 0 0 0 98.63v2.7a46 46 0 0 0 86 22.67A46 46 0 0 0 214 176v-2.7a54.07 54.07 0 0 0 32-49.3M88 210a34 34 0 0 1-34-32.94a53.7 53.7 0 0 0 10 .94h8a6 6 0 0 0 0-12h-8a42 42 0 0 1-14-81.61a6 6 0 0 0 4-5.66V72a34 34 0 0 1 68 0v73.05A45.9 45.9 0 0 0 88 130a6 6 0 0 0 0 12a34 34 0 0 1 0 68m104-44h-8a6 6 0 0 0 0 12h8a53.7 53.7 0 0 0 10-.94A34 34 0 1 1 168 142a6 6 0 0 0 0-12a45.9 45.9 0 0 0-34 15.05V72a34 34 0 0 1 68 0v6.73a6 6 0 0 0 4 5.66A42 42 0 0 1 192 166m14-54a6 6 0 0 1-6 6h-4a34 34 0 0 1-34-34v-4a6 6 0 0 1 12 0v4a22 22 0 0 0 22 22h4a6 6 0 0 1 6 6m-146 6h-4a6 6 0 0 1 0-12h4a22 22 0 0 0 22-22v-4a6 6 0 0 1 12 0v4a34 34 0 0 1-34 34"/>
            </svg>
            <span>Insights</span>
          </button>

          <button
            onClick={() => { navigate('/admin-dashboard/settings'); close(); }}
            className={`nav-item ${isActive('/admin-dashboard/settings') ? 'active' : ''}`}
          >
            {/* Settings icon — same SVG as before */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
              <path fill="currentColor" d="M8 6a2 2 0 1 0 0 4a2 2 0 0 0 0-4M7 8a1 1 0 1 1 2 0a1 1 0 0 1-2 0m3.618-3.602a.71.71 0 0 1-.824-.567l-.26-1.416a.35.35 0 0 0-.275-.282a6.1 6.1 0 0 0-2.519 0a.35.35 0 0 0-.275.282l-.259 1.416a.71.71 0 0 1-.936.538l-1.359-.484a.36.36 0 0 0-.382.095a6 6 0 0 0-1.262 2.173a.35.35 0 0 0 .108.378l1.102.931q.045.037.081.081a.704.704 0 0 1-.081.995l-1.102.931a.35.35 0 0 0-.108.378A6 6 0 0 0 3.53 12.02a.36.36 0 0 0 .382.095l1.36-.484a.708.708 0 0 1 .936.538l.258 1.416c.026.14.135.252.275.281a6.1 6.1 0 0 0 2.52 0a.35.35 0 0 0 .274-.281l.26-1.416a.71.71 0 0 1 .936-.538l1.359.484c.135.048.286.01.382-.095a6 6 0 0 0 1.262-2.173a.35.35 0 0 0-.108-.378l-1.102-.931a.703.703 0 0 1 0-1.076l1.102-.931a.35.35 0 0 0 .108-.378A6 6 0 0 0 12.47 3.98a.36.36 0 0 0-.382-.095l-1.36.484a1 1 0 0 1-.111.03m-6.62.58l.937.333a1.71 1.71 0 0 0 2.255-1.3l.177-.97a5 5 0 0 1 1.265 0l.178.97a1.708 1.708 0 0 0 2.255 1.3L12 4.977q.384.503.63 1.084l-.754.637a1.704 1.704 0 0 0 0 2.604l.755.637a5 5 0 0 1-.63 1.084l-.937-.334a1.71 1.71 0 0 0-2.255 1.3l-.178.97a5 5 0 0 1-1.265 0l-.177-.97a1.708 1.708 0 0 0-2.255-1.3L4 11.023a5 5 0 0 1-.63-1.084l.754-.638a1.704 1.704 0 0 0 0-2.603l-.755-.637q.248-.581.63-1.084"/>
            </svg>
            <span>Settings</span>
          </button>
        </nav>

        {/* Logout pinned to bottom */}
        <button className="logout-btn" onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;