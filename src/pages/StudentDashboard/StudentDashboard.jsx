import React, { useState, useEffect } from "react";
import StudentSidebar from "./components/StudentSidebar/StudentSidebar";
import TopBar from "../AdminDashboard/components/TopBar/TopBar";
import AttendanceModal from "./components/AttendanceModal/AttendanceModal";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [showAttendance, setShowAttendance] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);

  useEffect(() => {
    // Load student data from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const storedData = localStorage.getItem('studentData');
    
    if (storedData) {
      const allStudents = JSON.parse(storedData);
      // Get current user's data (assuming email matches)
      const currentStudent = allStudents.find(s => s.email === user.email) || allStudents[0];
      
      // Calculate dynamic values
      const calculatedData = calculateStudentMetrics(currentStudent);
      setStudentData(calculatedData);
    } else {
      // Demo data if no real data
      setStudentData(getDemoData());
    }
  }, []);

  const calculateStudentMetrics = (student) => {
    const attendance = parseInt(student.attendance) || 0;
    const studyHours = parseInt(student.study_hours) || 0;
    const assignmentCompletion = parseInt(student.assignment_completion) || 0;
    const motivation = parseInt(student.motivation) || 1;
    
    // Calculate dropout risk based on multiple factors
    let dropoutRisk = 0;
    if (attendance < 50) dropoutRisk += 30;
    if (studyHours < 10) dropoutRisk += 20;
    if (assignmentCompletion < 50) dropoutRisk += 25;
    if (motivation <= 2) dropoutRisk += 25;
    
    // Calculate weekly study hours distribution
    const weeklyDistribution = calculateWeeklyDistribution(studyHours);
    
    return {
      name: student.name || 'Student',
      studyHours: studyHours,
      dropoutRisk: Math.min(dropoutRisk, 100),
      engagement: attendance,
      completion: assignmentCompletion,
      attendance: attendance,
      motivation: motivation,
      weeklyDistribution: weeklyDistribution,
      riskFactors: calculateRiskFactors(student),
      interventions: getInterventions(student)
    };
  };

  const calculateWeeklyDistribution = (totalHours) => {
    // Distribute hours across week with some variation
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const distribution = days.map((day, index) => {
      const hours = Math.max(0, totalHours / 7 + (Math.random() - 0.5) * 4);
      let risk = 'low';
      if (hours < 2) risk = 'high';
      else if (hours < 4) risk = 'medium';
      
      return { day, hours: Math.round(hours * 10) / 10, risk };
    });
    
    return distribution;
  };

  const calculateRiskFactors = (student) => {
    const attendance = parseInt(student.attendance) || 0;
    const motivation = parseInt(student.motivation) || 1;
    const assignmentCompletion = parseInt(student.assignment_completion) || 0;
    
    return [
      {
        label: `Attendance at ${attendance}%`,
        description: `${attendance < 50 ? 'Infrequent' : 'Regular'} class attendance`,
        percentage: attendance,
        color: attendance < 50 ? '#EF4444' : attendance < 75 ? '#F59E0B' : '#10B981'
      },
      {
        label: motivation <= 2 ? 'Low motivation level' : 'Good motivation level',
        description: motivation <= 2 ? 'Inconsistent in class activities and discussions' : 'Active participation in class',
        percentage: motivation * 25,
        color: motivation <= 2 ? '#F59E0B' : '#10B981'
      },
      {
        label: 'Assignment completion',
        description: `${assignmentCompletion}% of assignments submitted on time`,
        percentage: assignmentCompletion,
        color: assignmentCompletion < 50 ? '#EF4444' : assignmentCompletion < 75 ? '#F59E0B' : '#10B981'
      },
      {
        label: 'Quiz score',
        description: student.predicted_grade ? `Current grade: ${student.predicted_grade}` : 'Quiz performance tracking',
        percentage: 75,
        color: '#10B981'
      },
      {
        label: 'Exam preparedness',
        description: `You have ${assignmentCompletion}% chance of passing exam`,
        percentage: assignmentCompletion,
        color: assignmentCompletion < 50 ? '#EF4444' : assignmentCompletion < 75 ? '#F59E0B' : '#10B981'
      }
    ];
  };

  const getInterventions = (student) => {
    const interventions = [];
    const attendance = parseInt(student.attendance) || 0;
    const assignmentCompletion = parseInt(student.assignment_completion) || 0;
    const studyHours = parseInt(student.study_hours) || 0;
    
    if (attendance < 75) {
      interventions.push({
        title: 'Review foundational modules',
        description: 'Review the study content and focus on areas where there was a sharp decline in performance.'
      });
    }
    
    interventions.push({
      title: 'Book a session with your instructor',
      description: 'Ask questions, get in-depth explanations and get help with study strategies best designed for you.'
    });
    
    if (studyHours < 15) {
      interventions.push({
        title: 'Increase your study time',
        description: 'Allocate an extra 5-10 hours to coursework each week and practice the suggested activities to improve outcomes.'
      });
    }
    
    if (assignmentCompletion < 80) {
      interventions.push({
        title: 'Set a reminder',
        description: 'Set a reminder on assignment submission to avoid missing deadline and improve your overall performance.'
      });
    }
    
    return interventions;
  };

  const getDemoData = () => ({
    name: 'Adaugo',
    studyHours: 2,
    dropoutRisk: 55,
    engagement: 20,
    completion: 32,
    attendance: 25,
    weeklyDistribution: [
      { day: 'Mon', hours: 3, risk: 'low' },
      { day: 'Tue', hours: 2.5, risk: 'low' },
      { day: 'Wed', hours: 1.5, risk: 'medium' },
      { day: 'Thu', hours: 1, risk: 'medium' },
      { day: 'Fri', hours: 0.5, risk: 'high' },
      { day: 'Sat', hours: 0.3, risk: 'high' },
      { day: 'Sun', hours: 0.2, risk: 'high' }
    ],
    riskFactors: [
      {
        label: 'Attendance at 25%',
        description: 'Attended 2 out of 8 classes',
        percentage: 25,
        color: '#EF4444'
      },
      {
        label: 'No motivation indicator',
        description: 'No engagement with extra activities and resources',
        percentage: 20,
        color: '#F59E0B'
      },
      {
        label: 'Assignment completion',
        description: 'Only 40% of your assignment has been completed',
        percentage: 40,
        color: '#EF4444'
      },
      {
        label: 'Quiz score',
        description: 'Your quiz scores are 20% below average',
        percentage: 60,
        color: '#EF4444'
      },
      {
        label: 'Exam preparedness',
        description: 'Your performance is low average, and you have 30% chance of passing exam',
        percentage: 30,
        color: '#EF4444'
      }
    ],
    interventions: [
      {
        title: 'Review foundational modules',
        description: 'Review the study content and focus on week 2 - 4 where there was a sharp decline in quiz performance.'
      },
      {
        title: 'Book a session with your instructor',
        description: 'Ask questions, get in-depth explanations and get help with study strategies best designed for you.'
      },
      {
        title: 'Increase your study time',
        description: 'Allocate an extra 5-10 hours to coursework each week and practice the suggested activities to improve outcomes.'
      },
      {
        title: 'Set a reminder',
        description: 'Set a reminder on assignment submission to avoid missing deadline and improve your overall performance.'
      }
    ]
  });

  const handleYesAttendance = () => {
    setAttendanceConfirmed(true);
    setTimeout(() => setAttendanceConfirmed(false), 3000);
  };

  if (!studentData) {
    return (
      <div className="admin-dashboard">
        <StudentSidebar />
        <div className="main-content">
          <TopBar />
          <div className="student-dashboard-content">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <StudentSidebar />
      <div className="main-content">
        <TopBar />
        <div className="student-dashboard-content">
          
          {/* Welcome Section */}
          <div className="welcome-header">
            <h1>Welcome back, {studentData.name}</h1>
            <p>Here is your learning progress and insights</p>
          </div>

          {/* Attendance Check-in */}
          {!attendanceConfirmed && (
            <div className="attendance-checkin-card">
              <div className="checkin-header">
                <div className="checkin-icon">📋</div>
                <div>
                  <h3>Attendance check-in</h3>
                  <p>Did you meet up to 50% attendance this week?</p>
                </div>
              </div>
              <div className="checkin-buttons">
                <button className="yes-button" onClick={handleYesAttendance}>
                  ✓ Yes, I did
                </button>
                <button className="no-button" onClick={() => setShowAttendance(true)}>
                  ✗ No, I did not
                </button>
              </div>
            </div>
          )}

          {attendanceConfirmed && (
            <div className="attendance-checkin-card confirmed">
              <div className="checkin-header">
                <div className="checkin-icon">✓</div>
                <div>
                  <h3>Attendance check-in</h3>
                  <p>Thank you for your response</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="stats-grid-student">
            <div className="stat-card-student">
              <div className="stat-icon-student">⏱</div>
              <span className={`stat-trend ${studentData.studyHours > 5 ? 'positive' : 'negative'}`}>
                {studentData.studyHours > 5 ? '+' : '-'}20%
              </span>
              <p className="stat-label-student">Total study hours this week</p>
              <h2 className="stat-value-student">{studentData.studyHours}hrs</h2>
            </div>

            <div className="stat-card-student">
              <div className="stat-icon-student">📉</div>
              <span className="stat-trend negative">-{studentData.dropoutRisk > 50 ? '10' : '5'}%</span>
              <p className="stat-label-student">Drop-out risk</p>
              <h2 className="stat-value-student">{studentData.dropoutRisk}%</h2>
            </div>

            <div className="stat-card-student">
              <div className="stat-icon-student">📊</div>
              <span className={`stat-trend ${studentData.engagement > 50 ? 'positive' : 'negative'}`}>
                {studentData.engagement > 50 ? '+' : '-'}4%
              </span>
              <p className="stat-label-student">Average engagement</p>
              <h2 className="stat-value-student">{studentData.engagement}%</h2>
            </div>

            <div className="stat-card-student">
              <div className="stat-icon-student">✅</div>
              <span className={`stat-trend ${studentData.completion > 50 ? 'positive' : 'negative'}`}>
                {studentData.completion > 50 ? '+' : '-'}20%
              </span>
              <p className="stat-label-student">Course completion rate</p>
              <h2 className="stat-value-student">{studentData.completion}%</h2>
            </div>
          </div>

          {/* Bar Chart Section */}
          <div className="chart-card-student">
            <div className="chart-header">
              <span className="chart-icon">⏰</span>
              <h3>Predicted risk distribution by study hours</h3>
            </div>
            <div className="bar-chart-container">
              {studentData.weeklyDistribution.map((item, index) => {
                const maxHours = Math.max(...studentData.weeklyDistribution.map(d => d.hours));
                const heightPercent = (item.hours / maxHours) * 100;
                
                return (
                  <div key={index} className="bar-item">
                    <div className="bar-wrapper">
                      <div 
                        className={`bar bar-${item.risk}`} 
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="bar-label">{Math.round(item.hours * 10) / 10}hrs</span>
                      </div>
                    </div>
                    <span className="day-label">{item.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="chart-legend">
              <span><span className="legend-dot low"></span> Low Risk</span>
              <span><span className="legend-dot medium"></span> Medium Risk</span>
              <span><span className="legend-dot high"></span> High Risk</span>
            </div>
          </div>

          {/* Two Column Section */}
          <div className="insights-grid">
            {/* Why This Risk Level */}
            <div className="insight-card">
              <div className="insight-header">
                <span className="insight-icon">⚠️</span>
                <h3>why this risk level?</h3>
              </div>
              <p className="insight-subtitle">
                You are currently considered high risk mainly because of declining engagement and attendance patterns.
              </p>
              
              <div className="risk-factors">
                {studentData.riskFactors.map((factor, index) => (
                  <div key={index} className="risk-factor-item">
                    <div className="risk-factor-header">
                      <strong>{factor.label}</strong>
                    </div>
                    <div className="risk-progress-bar">
                      <div 
                        className="risk-progress-fill" 
                        style={{ width: `${factor.percentage}%`, backgroundColor: factor.color }}
                      ></div>
                    </div>
                    <p className="risk-factor-desc">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Intervention */}
            <div className="insight-card">
              <div className="insight-header">
                <span className="insight-icon">💡</span>
                <h3>Intervention</h3>
              </div>
              <p className="insight-subtitle">
                You are encouraged to explore the following recommended actions to improve your learning outcomes.
              </p>
              
              <div className="interventions">
                {studentData.interventions.map((intervention, index) => (
                  <div key={index} className="intervention-item">
                    <div className="intervention-header">
                      <strong>{intervention.title}</strong>
                      <span className="arrow">→</span>
                    </div>
                    <p className="intervention-desc">{intervention.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAttendance && (
        <AttendanceModal onClose={() => setShowAttendance(false)} />
      )}
    </div>
  );
};

export default StudentDashboard;