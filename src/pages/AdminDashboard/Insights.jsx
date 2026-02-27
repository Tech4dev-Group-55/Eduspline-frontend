import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import StatsCard from './components/StatsCard/StatsCard';
import StudentActivityIndex from './components/StudentIndex/Studentactuivityindex';
import './Insights.css';


const Insights = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="insights-content">
          <h1>Insights Page</h1>
          <p>Student data table will be added here soon!</p>
          <div className="stats-cards">
            <StatsCard />
        </div>
        </div>
        <StudentActivityIndex />
        
      </div>
    </div>
  );
};

export default Insights;