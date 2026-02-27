import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import './TopBar.css';

// Generates a consistent color from a string
const getAvatarColor = (str = '') => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const TopBar = () => {
  const { user } = useAuth();

  const email    = user?.email || '';
  const role     = user?.role  || 'User';
  const initial  = email.charAt(0).toUpperCase() || '?';
  const bgColor  = getAvatarColor(email);

  return (
    <div className="topbar">
      <div className="topbar-spacer" />

      <div className="topbar-right">
        <button className="notification-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="user-info">
          <div className="user-details">
            <p className="user-name">{email}</p>
            <p className="user-role">{role}</p>
          </div>
          <div
            className="user-avatar-initial"
            style={{ backgroundColor: bgColor }}
            aria-label={email}
          >
            {initial}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;