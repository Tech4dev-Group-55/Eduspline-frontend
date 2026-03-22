import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentSidebar from "./components/StudentSidebar/StudentSidebar";
import TopBar from "../AdminDashboard/components/TopBar/TopBar";
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Target,
  Clock,
  Activity,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import "./StudentDashboard.css";

const BASE_URL = "https://eduspline-backend-0y8n.onrender.com/api";

const getRiskColor = (level) => {
  if (!level) return { bg: "#F3F4F6", text: "#6B7280", label: "Unknown" };
  const l = level.toLowerCase();
  if (l === "high") return { bg: "#FEE2E2", text: "#DC2626", label: "High Risk" };
  if (l === "medium") return { bg: "#FEF3C7", text: "#D97706", label: "Medium Risk" };
  return { bg: "#D1FAE5", text: "#059669", label: "Low Risk" };
};

const formatPercent = (val) => {
  if (val == null) return "—";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(num) ? "—" : `${Math.round(num)}%`;
};

const formatHours = (val) => {
  if (val == null) return "—";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(num) ? "—" : `${Math.round(num)}h`;
};

// Simple circular progress ring
const CircleProgress = ({ value, size = 80, strokeWidth = 6, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} className="circle-progress">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="circle-progress__fill"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="circle-progress__text"
        fill={color}
      >
        {pct}%
      </text>
    </svg>
  );
};

// Horizontal bar for engagement breakdown
const BarMetric = ({ label, value, max = 100, color }) => {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="bar-metric">
      <div className="bar-metric__header">
        <span className="bar-metric__label">{label}</span>
        <span className="bar-metric__value">{Math.round(value)}%</span>
      </div>
      <div className="bar-metric__track">
        <div
          className="bar-metric__fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/predictions/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) {
          setError(result.message || "Failed to load predictions.");
          return;
        }
        setData(result);
      } catch {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPredictions();
  }, [token]);

  const studentName =
    data?.studentName ||
    data?.name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Student";

  // Flatten nested API response — the backend may wrap data in various shapes
  const prediction = data?.prediction || data?.data || data || {};
  const stats = prediction.stats || prediction.metrics || prediction;

  // Helper to find a value across multiple possible keys
  const pick = (...keys) => {
    for (const key of keys) {
      const val = prediction[key] ?? stats[key] ?? data?.[key];
      if (val != null) return typeof val === 'string' ? parseFloat(val) : val;
    }
    return null;
  };

  const pickStr = (...keys) => {
    for (const key of keys) {
      const val = prediction[key] ?? stats[key] ?? data?.[key];
      if (val != null) return val;
    }
    return null;
  };

  const riskLevel = pickStr('riskLevel', 'risk_level', 'riskCategory', 'risk_category');
  const confidence = pick('confidence', 'predictionConfidence', 'prediction_confidence', 'modelConfidence');
  const totalStudyHours = pick('totalStudyHours', 'total_study_hours', 'studyHours', 'study_hours');
  const averageEngagement = pick('averageEngagement', 'average_engagement', 'engagement', 'engagementRate', 'engagement_rate');
  const courseCompletion = pick('courseCompletionRate', 'course_completion_rate', 'courseCompletion', 'course_completion', 'completionRate', 'completion_rate');
  const recommendations = prediction.recommendations || data?.recommendations || stats.recommendations || [];
  const risk = getRiskColor(riskLevel);

  // Engagement breakdown — pull every metric the API might provide
  const attendance = pick('attendance', 'attendanceRate', 'attendance_rate');
  const assignmentCompletion = pick('assignmentCompletion', 'assignment_completion', 'assignmentCompletionRate', 'assignment_completion_rate');
  const quizScore = pick('quizScore', 'quiz_score', 'averageQuizScore', 'average_quiz_score');
  const forumParticipation = pick('forumParticipation', 'forum_participation', 'forumActivity', 'forum_activity');
  const liveSessionAttendance = pick('liveSessionAttendance', 'live_session_attendance');

  const renderLoading = () => (
    <div className="student-dashboard-content">
      <div className="welcome-section">
        <div className="skeleton skeleton--welcome" />
        <div className="skeleton skeleton--subtitle" />
      </div>
      <div className="stats-grid">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stat-card stat-card--skeleton">
            <div className="skeleton skeleton--icon-box" />
            <div className="skeleton skeleton--stat-label" />
            <div className="skeleton skeleton--stat-value" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderError = () => (
    <div className="student-dashboard-content">
      <div className="error-state">
        <ShieldAlert size={48} className="error-state__icon" />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <StudentSidebar />
        <div className="main-content">
          <TopBar />
          {renderLoading()}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <StudentSidebar />
        <div className="main-content">
          <TopBar />
          {renderError()}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-dashboard">
        <StudentSidebar />
        <div className="main-content">
          <TopBar />
          <div className="student-dashboard-content">
            <div className="empty-state">
              <BookOpen size={48} className="empty-state__icon" />
              <h2>No data yet</h2>
              <p>Your learning predictions will appear here once enough data is available.</p>
            </div>
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
          <section className="welcome-section">
            <div className="welcome-text">
              <h1>
                Welcome back, <span className="welcome-name">{studentName}</span>
              </h1>
              <p>Here is your learning progress and insights</p>
            </div>
            <div className={`risk-badge risk-badge--${(riskLevel || "unknown").toLowerCase()}`}>
              <ShieldAlert size={16} />
              <span>{risk.label}</span>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="stats-grid">
            <div className="stat-card stat-card--risk">
              <div className="stat-card__icon-wrap" style={{ background: risk.bg }}>
                <ShieldAlert size={20} style={{ color: risk.text }} />
              </div>
              <p className="stat-card__label">Risk Level</p>
              <p className="stat-card__value" style={{ color: risk.text }}>
                {riskLevel || "—"}
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrap" style={{ background: "#EDE9FE" }}>
                <Target size={20} style={{ color: "#7C3AED" }} />
              </div>
              <p className="stat-card__label">Confidence</p>
              <p className="stat-card__value">{formatPercent(confidence)}</p>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrap" style={{ background: "#DBEAFE" }}>
                <Clock size={20} style={{ color: "#2563EB" }} />
              </div>
              <p className="stat-card__label">Total Study Hours</p>
              <p className="stat-card__value">{formatHours(totalStudyHours)}</p>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrap" style={{ background: "#FEF3C7" }}>
                <Activity size={20} style={{ color: "#D97706" }} />
              </div>
              <p className="stat-card__label">Avg. Engagement</p>
              <p className="stat-card__value">{formatPercent(averageEngagement)}</p>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrap" style={{ background: "#D1FAE5" }}>
                <CheckCircle2 size={20} style={{ color: "#059669" }} />
              </div>
              <p className="stat-card__label">Course Completion</p>
              <p className="stat-card__value">{formatPercent(courseCompletion)}</p>
            </div>
          </section>

          {/* Charts Row */}
          <section className="charts-row">
            {/* Course Completion Ring */}
            <div className="chart-card">
              <h3 className="chart-card__title">Course Completion</h3>
              <div className="chart-card__ring-center">
                <CircleProgress
                  value={courseCompletion}
                  size={140}
                  strokeWidth={10}
                  color="#059669"
                />
              </div>
              <p className="chart-card__caption">
                {courseCompletion != null
                  ? `You've completed ${Math.round(courseCompletion)}% of your course`
                  : "No completion data available"}
              </p>
            </div>

            {/* Engagement Breakdown */}
            <div className="chart-card chart-card--wide">
              <h3 className="chart-card__title">Engagement Breakdown</h3>
              <div className="chart-card__bars">
                {averageEngagement != null && (
                  <BarMetric
                    label="Overall Engagement"
                    value={averageEngagement}
                    color="#2563EB"
                  />
                )}
                {attendance != null && (
                  <BarMetric label="Attendance" value={attendance} color="#7C3AED" />
                )}
                {assignmentCompletion != null && (
                  <BarMetric
                    label="Assignment Completion"
                    value={assignmentCompletion}
                    color="#D97706"
                  />
                )}
                {quizScore != null && (
                  <BarMetric label="Quiz Score" value={quizScore} color="#059669" />
                )}
                {forumParticipation != null && (
                  <BarMetric label="Forum Participation" value={forumParticipation} color="#EC4899" />
                )}
                {liveSessionAttendance != null && (
                  <BarMetric label="Live Sessions" value={liveSessionAttendance} color="#14B8A6" />
                )}
                {averageEngagement == null &&
                  attendance == null &&
                  assignmentCompletion == null &&
                  quizScore == null &&
                  forumParticipation == null &&
                  liveSessionAttendance == null && (
                    <p className="chart-card__empty">No engagement data available yet.</p>
                  )}
              </div>
            </div>

          </section>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section className="recommendations-section">
              <div className="recommendations-header">
                <Lightbulb size={22} className="recommendations-header__icon" />
                <div>
                  <h2>Recommendations</h2>
                  <p>Personalized suggestions to improve your learning outcomes</p>
                </div>
              </div>
              <div className="recommendations-list">
                {recommendations.map((rec, i) => {
                  const text = typeof rec === "string" ? rec : rec.title || rec.description || rec.text;
                  const desc = typeof rec === "object" ? rec.description || rec.text : null;
                  const priority = typeof rec === "object" ? rec.priority : null;

                  return (
                    <div key={i} className="rec-card">
                      <div className="rec-card__number">{i + 1}</div>
                      <div className="rec-card__body">
                        {priority && (
                          <span className={`rec-card__priority rec-card__priority--${priority.toLowerCase()}`}>
                            {priority}
                          </span>
                        )}
                        <h4 className="rec-card__title">
                          {typeof rec === "string" ? text : rec.title || text}
                        </h4>
                        {desc && typeof rec !== "string" && desc !== rec.title && (
                          <p className="rec-card__desc">{desc}</p>
                        )}
                      </div>
                      <ChevronRight size={18} className="rec-card__arrow" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Fallback recommendations when API returns none */}
          {recommendations.length === 0 && (
            <section className="recommendations-section">
              <div className="recommendations-header">
                <Lightbulb size={22} className="recommendations-header__icon" />
                <div>
                  <h2>Quick Tips</h2>
                  <p>General suggestions to keep you on track</p>
                </div>
              </div>
              <div className="recommendations-list">
                {[
                  { title: "Stay consistent with study hours", desc: "Aim for regular study sessions rather than cramming." },
                  { title: "Engage with course materials", desc: "Active participation boosts understanding and retention." },
                  { title: "Reach out for support", desc: "Don't hesitate to contact your instructor if you're stuck." },
                ].map((tip, i) => (
                  <div key={i} className="rec-card">
                    <div className="rec-card__number">{i + 1}</div>
                    <div className="rec-card__body">
                      <h4 className="rec-card__title">{tip.title}</h4>
                      <p className="rec-card__desc">{tip.desc}</p>
                    </div>
                    <ChevronRight size={18} className="rec-card__arrow" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
