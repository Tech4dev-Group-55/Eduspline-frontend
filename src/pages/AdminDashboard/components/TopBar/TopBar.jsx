import React, { useState, useEffect } from 'react';
import './TopBar.css';

const TopBar = () => {
  const [user, setUser] = useState({
    name: 'Koloso Yaa',
    role: 'Super Admin',
    avatar: '/images/default-avatar.png'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        name: parsedUser.name || 'Koloso Yaa',
        role: parsedUser.role || 'Super Admin',
        avatar: parsedUser.avatar || '/images/default-avatar.png'
      });
    }
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-spacer"></div>
      
      <div className="topbar-right">
        <button className="notification-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="user-info">
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <p className="user-role">{user.role}</p>
          </div>
          <div className="user-avatar">
            <img src={user.avatar} alt={user.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;