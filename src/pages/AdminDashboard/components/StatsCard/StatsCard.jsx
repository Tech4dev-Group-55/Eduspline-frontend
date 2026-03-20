import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import './StatsCard.css';

const BASE_URL = 'https://eduspline-backend-0y8n.onrender.com/api';

// ── Trend icon ────────────────────────────────────────────────────────────
const TrendIcon = ({ positive }) =>
  positive ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 6h6v6" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M23 18l-9.5-9.5-5 5L1 6" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 18h6v-6" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

// ── Presentational card — no hooks here ──────────────────────────────────
const StatCard = ({ icon, label, value, trend, positive }) => (
  <div className="stat-card">
    <div className="stat-card__header">
      <div className="stat-card__icon">{icon}</div>
      <div className={`stat-card__trend ${positive ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
        <TrendIcon positive={positive} />
        <span>{trend}%</span>
      </div>
    </div>
    <p className="stat-card__label">{label}</p>
    <p className="stat-card__value">{value}</p>
  </div>
);

// ── Main component — all hooks live here ─────────────────────────────────
const CourseOverview = () => {
  const { token: contextToken } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    // Read directly from localStorage so we don't wait for context rehydration
    const token = contextToken || localStorage.getItem('token');
    if (!token) return;

    const fetchMetrics = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const res = await fetch(`${BASE_URL}/predictions/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [contextToken]);

  const cards = metrics
    ? [
        {
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          label:    'Total students',
          value:    metrics.totalLearners,
          trend:    20,
          positive: true,
        },
        {
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ),
          label:    'At-risk students',
          value:    metrics.highRiskLearners,
          trend:    10,
          positive: false,
        },
        {
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          label:    'Average student engagement',
          value:    `${metrics.averageEngagement}%`,
          trend:    4,
          positive: false,
        },
        {
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          label:    'Course completion',
          value:    `${metrics.courseCompletionRate}%`,
          trend:    20,
          positive: true,
        },
      ]
    : [];

  return (
    <section className="course-overview">
      <h2 className="course-overview__title">Course overview</h2>

      {loading && (
        <>
          <p className="course-overview__loading-msg">
            Fetching metrics, this may take a moment…
          </p>
          <div className="course-overview__grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card stat-card--skeleton">
                <div className="skeleton skeleton--icon" />
                <div className="skeleton skeleton--label" />
                <div className="skeleton skeleton--value" />
              </div>
            ))}
          </div>
        </>
      )}

      {error && !loading && (
        <div className="course-overview__error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="course-overview__grid">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CourseOverview;