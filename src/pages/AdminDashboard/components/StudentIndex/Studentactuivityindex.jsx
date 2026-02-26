import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import './StudentActivityIndex.css';

const BASE_URL = 'https://eduspline-backend.onrender.com/api';
const PAGE_SIZE = 10;

// ── Risk config — matches exact backend values ─────────────────────────────
const RISK_CONFIG = {
  'low risk':       { label: 'Low Risk',       className: 'risk--stable'    },
  'very low risk':  { label: 'Very Low Risk',  className: 'risk--excellent' },
  'medium risk':    { label: 'Medium Risk',    className: 'risk--at-risk'   },
  'high risk':      { label: 'High Risk',      className: 'risk--critical'  },
  'very high risk': { label: 'Very High Risk', className: 'risk--critical'  },
};

const getRisk = (val = '') =>
  RISK_CONFIG[val.toLowerCase()] || { label: val, className: 'risk--stable' };

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const RiskBadge = ({ label, className }) => (
  <span className={`badge ${className}`}>
    <span className="badge__dot" />
    {label}
  </span>
);

const SkeletonRow = () => (
  <tr className="skeleton-row">
    {[...Array(6)].map((_, i) => (
      <td key={i}><div className="skeleton-cell" /></td>
    ))}
  </tr>
);

const StudentActivityIndex = () => {
  const { token }               = useAuth();
  const [students, setStudents] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [page, setPage]         = useState(1);

  useEffect(() => {
    const t = token || localStorage.getItem('token');
    if (!t) return;

    const fetchInsights = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/predictions/insights`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load insights');
        setStudents(data.insights || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [token]);

  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const paginated  = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="sai">
      <div className="sai__header">
        <h2 className="sai__title">Student Activity Index</h2>
        {!loading && (
          <span className="sai__total-badge">{total} Students</span>
        )}
      </div>

      {error && (
        <div className="sai__error">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      <div className="sai__table-wrap">
        <table className="sai__table">
          <thead>
            <tr>
              <th>Students</th>
              <th>Email</th>
              <th>Engagement rate</th>
              <th>Risk-level</th>
              <th>Confidence</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)
              : paginated.map((s, i) => {
                  const risk = getRisk(s.riskLevel ?? '');
                  return (
                    <tr key={i} className="sai__row">
                      <td className="sai__name">{s.name || '—'}</td>
                      <td className="sai__email">{s.email || '—'}</td>
                      <td className="sai__engagement">{s.engagement || '—'}</td>
                      <td><RiskBadge label={risk.label} className={risk.className} /></td>
                      <td className="sai__confidence">{s.confidence || '—'}</td>
                      <td className="sai__date">{formatDate(s.lastUpdated)}</td>
                    </tr>
                  );
                })
            }
            {!loading && !error && students.length === 0 && (
              <tr>
                <td colSpan={6} className="sai__empty">No student data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="sai__pagination">
          <button className="sai__page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={`sai__page-btn ${page === i + 1 ? 'sai__page-btn--active' : ''}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="sai__page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
        </div>
      )}
    </section>
  );
};

export default StudentActivityIndex;