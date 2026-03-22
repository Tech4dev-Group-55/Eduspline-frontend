import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import {
  Users,
  AlertTriangle,
  Monitor,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import './DashboardData.css';

const BASE_URL = 'https://eduspline-backend-0y8n.onrender.com/api';

// ── Helpers ──────────────────────────────────────────────────────────────
const pick = (obj, ...keys) => {
  if (!obj) return null;
  for (const key of keys) {
    if (obj[key] != null) return typeof obj[key] === 'string' ? parseFloat(obj[key]) : obj[key];
  }
  return null;
};

// ── Stat Card ────────────────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, iconColor, label, value }) => (
  <div className="admin-stat-card">
    <div className="admin-stat-card__header">
      <div className="admin-stat-card__icon" style={{ background: iconBg }}>
        {React.cloneElement(icon, { size: 20, color: iconColor })}
      </div>
    </div>
    <p className="admin-stat-card__label">{label}</p>
    <p className="admin-stat-card__value">{value ?? '—'}</p>
  </div>
);

// ── Circular Progress Ring ───────────────────────────────────────────────
const CircleProgress = ({ value, size = 140, strokeWidth = 10, color, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="admin-ring">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="admin-ring__fill"
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="admin-ring__text" fill={color}>
          {pct}%
        </text>
      </svg>
      {label && <p className="admin-ring__label">{label}</p>}
    </div>
  );
};

// ── Horizontal Bar ───────────────────────────────────────────────────────
const HBar = ({ label, value, color }) => {
  const pct = Math.min(Math.max(value || 0, 0), 100);
  return (
    <div className="admin-hbar">
      <div className="admin-hbar__header">
        <span className="admin-hbar__label">{label}</span>
        <span className="admin-hbar__value">{Math.round(value)}{typeof value === 'number' ? '%' : ''}</span>
      </div>
      <div className="admin-hbar__track">
        <div className="admin-hbar__fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

// ── Main Dashboard ───────────────────────────────────────────────────────
const DashboardData = () => {
  const { token, user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const adminName = user?.name || user?.email?.split('@')[0] || 'Admin';

  useEffect(() => {
    const tkn = token || localStorage.getItem('token');
    if (!tkn) return;

    const fetchMetrics = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const res = await fetch(`${BASE_URL}/predictions/dashboard`, {
          headers: { Authorization: `Bearer ${tkn}` },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load metrics');
        setMetrics(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timed out. The server may be waking up — please try again.');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [token]);

  // ── Extract all dynamic values from the API response ───────────────────
  const totalLearners = pick(metrics, 'totalLearners', 'total_learners', 'totalStudents', 'total_students');
  const highRiskLearners = pick(metrics, 'highRiskLearners', 'high_risk_learners', 'atRiskStudents', 'at_risk_students');
  const averageEngagement = pick(metrics, 'averageEngagement', 'average_engagement', 'engagementRate', 'engagement_rate');
  const courseCompletionRate = pick(metrics, 'courseCompletionRate', 'course_completion_rate', 'completionRate', 'completion_rate');
  const mediumRiskLearners = pick(metrics, 'mediumRiskLearners', 'medium_risk_learners');
  const lowRiskLearners = pick(metrics, 'lowRiskLearners', 'low_risk_learners');
  const averageStudyHours = pick(metrics, 'averageStudyHours', 'average_study_hours', 'avgStudyHours');
  const averageAttendance = pick(metrics, 'averageAttendance', 'average_attendance', 'attendanceRate', 'attendance_rate');
  const averageQuizScore = pick(metrics, 'averageQuizScore', 'average_quiz_score', 'quizScore');
  const assignmentCompletion = pick(metrics, 'assignmentCompletion', 'assignment_completion', 'assignmentCompletionRate');

  const stats = metrics
    ? [
        {
          icon: <Users />, iconBg: '#EFF6FF', iconColor: '#2563EB',
          label: 'Total students', value: totalLearners,
        },
        {
          icon: <AlertTriangle />, iconBg: '#FEF2F2', iconColor: '#DC2626',
          label: 'At-risk students', value: highRiskLearners,
        },
        {
          icon: <Monitor />, iconBg: '#FEF3C7', iconColor: '#D97706',
          label: 'Average engagement',
          value: averageEngagement != null ? `${Math.round(averageEngagement)}%` : '—',
        },
        {
          icon: <CheckCircle2 />, iconBg: '#D1FAE5', iconColor: '#059669',
          label: 'Course completion',
          value: courseCompletionRate != null ? `${Math.round(courseCompletionRate)}%` : '—',
        },
      ]
    : [];

  // ── Compute risk distribution for bar chart ────────────────────────────
  const riskBars = [];
  if (totalLearners != null && totalLearners > 0) {
    // Calculate low risk from total minus others, or use provided value
    const high = highRiskLearners || 0;
    const medium = mediumRiskLearners || 0;
    const low = lowRiskLearners != null ? lowRiskLearners : totalLearners - high - medium;
    if (low > 0) riskBars.push({ label: 'Low Risk', value: low, color: '#22C55E' });
    if (medium > 0) riskBars.push({ label: 'Medium Risk', value: medium, color: '#F59E0B' });
    if (high > 0) riskBars.push({ label: 'High Risk', value: high, color: '#EF4444' });
  }

  // ── Build engagement metrics for bar breakdown ─────────────────────────
  const engagementMetrics = [];
  if (averageEngagement != null) engagementMetrics.push({ label: 'Overall Engagement', value: averageEngagement, color: '#2563EB' });
  if (averageAttendance != null) engagementMetrics.push({ label: 'Attendance', value: averageAttendance, color: '#7C3AED' });
  if (assignmentCompletion != null) engagementMetrics.push({ label: 'Assignment Completion', value: assignmentCompletion, color: '#D97706' });
  if (averageQuizScore != null) engagementMetrics.push({ label: 'Quiz Score', value: averageQuizScore, color: '#059669' });
  if (courseCompletionRate != null) engagementMetrics.push({ label: 'Course Completion', value: courseCompletionRate, color: '#14B8A6' });

  const renderLoading = () => (
    <>
      <section className="admin-welcome-section">
        <div className="skeleton skeleton--welcome-lg" />
        <div className="skeleton skeleton--subtitle-lg" />
      </section>
      <div className="admin-stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="admin-stat-card admin-stat-card--skeleton">
            <div className="skeleton skeleton--icon-lg" />
            <div className="skeleton skeleton--label-lg" />
            <div className="skeleton skeleton--value-lg" />
          </div>
        ))}
      </div>
      <div className="admin-charts-grid">
        <div className="chart-card"><div className="skeleton skeleton--chart" /></div>
        <div className="chart-card"><div className="skeleton skeleton--chart" /></div>
      </div>
    </>
  );

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="dashboard-data-content">
          {loading ? (
            renderLoading()
          ) : error ? (
            <div className="admin-error-state">
              <AlertTriangle size={48} className="admin-error-state__icon" />
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <button className="admin-btn-retry" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* Welcome */}
              <section className="admin-welcome-section">
                <div className="admin-welcome-text">
                  <h1>
                    Welcome, <span className="admin-welcome-name">{adminName}</span>
                  </h1>
                  <p>Institution overview — real-time performance for learners</p>
                </div>
              </section>

              {/* Stats Cards */}
              <section className="admin-stats-grid">
                {stats.map((s) => (
                  <StatCard key={s.label} {...s} />
                ))}
              </section>

              {/* Charts Row: Donut rings + Engagement bars */}
              <section className="admin-charts-grid">
                {/* Completion & Engagement Rings */}
                <div className="chart-card">
                  <h3 className="chart-card__title">Key Metrics</h3>
                  <div className="admin-rings-row">
                    {courseCompletionRate != null && (
                      <CircleProgress value={courseCompletionRate} color="#059669" label="Course Completion" />
                    )}
                    {averageEngagement != null && (
                      <CircleProgress value={averageEngagement} color="#2563EB" label="Avg. Engagement" />
                    )}
                    {averageAttendance != null && (
                      <CircleProgress value={averageAttendance} color="#7C3AED" label="Attendance" />
                    )}
                    {courseCompletionRate == null && averageEngagement == null && averageAttendance == null && (
                      <p className="chart-card__empty">No metric data available yet.</p>
                    )}
                  </div>
                </div>

                {/* Engagement Breakdown Bars */}
                <div className="chart-card">
                  <h3 className="chart-card__title">Engagement Breakdown</h3>
                  <div className="admin-bars-col">
                    {engagementMetrics.length > 0 ? (
                      engagementMetrics.map((m) => (
                        <HBar key={m.label} label={m.label} value={m.value} color={m.color} />
                      ))
                    ) : (
                      <p className="chart-card__empty">No engagement data available yet.</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Risk Distribution Bar Chart */}
              {riskBars.length > 0 && (
                <section className="admin-chart-full">
                  <div className="chart-card">
                    <h3 className="chart-card__title">Student Risk Distribution</h3>
                    <div className="admin-risk-bars">
                      {riskBars.map((bar) => {
                        const pct = (bar.value / totalLearners) * 100;
                        return (
                          <div key={bar.label} className="admin-risk-bar">
                            <div className="admin-risk-bar__info">
                              <span className="admin-risk-bar__dot" style={{ background: bar.color }} />
                              <span className="admin-risk-bar__label">{bar.label}</span>
                              <span className="admin-risk-bar__count">{bar.value} students</span>
                            </div>
                            <div className="admin-risk-bar__track">
                              <div
                                className="admin-risk-bar__fill"
                                style={{ width: `${pct}%`, backgroundColor: bar.color }}
                              />
                            </div>
                            <span className="admin-risk-bar__pct">{Math.round(pct)}%</span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Visual summary bar */}
                    <div className="admin-risk-summary">
                      {riskBars.map((bar) => {
                        const pct = (bar.value / totalLearners) * 100;
                        return (
                          <div
                            key={bar.label}
                            className="admin-risk-summary__segment"
                            style={{ width: `${pct}%`, backgroundColor: bar.color }}
                            title={`${bar.label}: ${bar.value} (${Math.round(pct)}%)`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* Study hours if available */}
              {averageStudyHours != null && (
                <section className="admin-study-hours-card">
                  <div className="chart-card">
                    <h3 className="chart-card__title">Average Study Hours</h3>
                    <div className="admin-study-hours">
                      <span className="admin-study-hours__value">{Math.round(averageStudyHours)}h</span>
                      <span className="admin-study-hours__label">per student</span>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardData;
