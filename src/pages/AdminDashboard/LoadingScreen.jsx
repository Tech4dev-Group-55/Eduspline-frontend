import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time, then redirect to dashboard with data
    const timer = setTimeout(() => {
      navigate('/admin-dashboard/data');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h1 className="loading-title">Getting ready</h1>
        <p className="loading-text">Initializing...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;