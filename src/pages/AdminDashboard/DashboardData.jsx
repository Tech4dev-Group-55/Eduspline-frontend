import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import './DashboardData.css';

const DashboardData = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="dashboard-data-content">
          <h1>Dashboard Data Page</h1>
          <p>Charts and stats will be added here soon!</p>
          <p>This page is ready for backend integration.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardData;