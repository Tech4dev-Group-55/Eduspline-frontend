import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
// import FileUpload from './components/FileUpload/FileUpload';
import FileUpload from '../AdminDashboard/components/FileUpload/FileUpload';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="dashboard-content">
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;