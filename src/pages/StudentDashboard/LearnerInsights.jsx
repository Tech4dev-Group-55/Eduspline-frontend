import React, { useState, useEffect } from "react";
import StudentSidebar from "./components/StudentSidebar/StudentSidebar";
import TopBar from "../AdminDashboard/components/TopBar/TopBar";
import "./LearnerInsights.css";

const LearnerInsights = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Load student data and calculate recommendations
    const storedData = localStorage.getItem('studentData');
    
    if (storedData) {
      const allStudents = JSON.parse(storedData);
      const currentStudent = allStudents[0]; // Get current user's data
      
      const recs = generateRecommendations(currentStudent);
      const mods = generateModules(currentStudent);
      
      setRecommendations(recs);
      setModules(mods);
    } else {
      // Demo data
      setRecommendations(getDemoRecommendations());
      setModules(getDemoModules());
    }
  }, []);

  const generateRecommendations = (student) => {
    const recommendations = [];
    const attendance = parseInt(student.attendance) || 0;
    const assignmentCompletion = parseInt(student.assignment_completion) || 0;
    
    if (attendance < 75) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Book a session with your instructor',
        description: 'Ask questions, get in-depth explanations and get help with study strategies best adapted just for you.',
        icon: '👨‍🏫'
      });
    }
    
    if (assignmentCompletion < 70) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Review foundational modules',
        description: 'Review the study content and focus on week 2 - 4 where there was a sharp decline in Quiz performance.',
        icon: '📚'
      });
    }
    
    recommendations.push({
      priority: 'MEDIUM',
      title: 'Increase your study time',
      description: 'Allocate an extra 5-10 hours to coursework each week and practice suggested activities.',
      icon: '⏰'
    });
    
    return recommendations;
  };

  const generateModules = (student) => {
    const assignmentCompletion = parseInt(student.assignment_completion) || 0;
    
    return [
      { id: 1, name: 'Module 1', status: 'Completed', progress: 100 },
      { id: 2, name: 'Module 2', status: 'Completed', progress: 100 },
      { id: 3, name: 'Module 3', status: 'In Progress', progress: assignmentCompletion || 40 },
      { id: 4, name: 'Module 4', status: 'Waiting', progress: 0 },
      { id: 5, name: 'Module 5', status: 'Waiting', progress: 0 },
      { id: 6, name: 'Module 6', status: 'Waiting', progress: 0 }
    ];
  };

  const getDemoRecommendations = () => [
    {
      priority: 'HIGH',
      title: 'Book a session with your instructor',
      description: 'Ask questions, get in-depth explanations and get help with study strategies best adapted just for you.',
      icon: '👨‍🏫'
    },
    {
      priority: 'HIGH',
      title: 'Review foundational modules',
      description: 'Review the study content and focus on week 2 - 4 where there was a sharp decline in Quiz performance.',
      icon: '📚'
    }
  ];

  const getDemoModules = () => [
    { id: 1, name: 'Module 1', status: 'Completed', progress: 100 },
    { id: 2, name: 'Module 2', status: 'Completed', progress: 100 },
    { id: 3, name: 'Module 3', status: 'In Progress', progress: 40 },
    { id: 4, name: 'Module 4', status: 'Waiting', progress: 0 },
    { id: 5, name: 'Module 5', status: 'Waiting', progress: 0 },
    { id: 6, name: 'Module 6', status: 'Waiting', progress: 0 }
  ];

  return (
    <div className="admin-dashboard">
      <StudentSidebar />
      <div className="main-content">
        <TopBar />
        <div className="student-insights-content">
          
          {/* Personalized Recommendations */}
          <section className="personalized-section">
            <div className="section-header">
              <div className="header-icon">🎯</div>
              <div>
                <h2>Personalized for you</h2>
                <p>Based on your current risk factors and learning patterns</p>
              </div>
            </div>

            <div className="recommendations-grid">
              {recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="rec-header">
                    <span className={`priority-badge ${rec.priority.toLowerCase()}`}>
                      {rec.priority}
                    </span>
                    <button className="external-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Modules Milestone */}
          <section className="modules-section">
            <div className="section-header">
              <div className="header-icon">📋</div>
              <h2>Modules milestone</h2>
            </div>

            <div className="modules-list">
              {modules.map((module) => (
                <div key={module.id} className="module-item">
                  <div className="module-left">
                    <span className={`module-dot ${module.status.toLowerCase().replace(' ', '-')}`}></span>
                    <span className="module-name">{module.name}</span>
                  </div>
                  <div className="module-right">
                    <span className={`module-status ${module.status.toLowerCase().replace(' ', '-')}`}>
                      {module.status}
                    </span>
                    {module.progress > 0 && (
                      <span className="module-progress">{module.progress}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LearnerInsights;