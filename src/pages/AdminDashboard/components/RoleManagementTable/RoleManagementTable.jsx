import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import './RoleManagementTable.css';

const BASE_URL = 'https://eduspline-backend-0y8n.onrender.com/api';

const formatRole = (role = '') =>
  role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const RoleManagementTable = () => {
  const { token }             = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const t = token || localStorage.getItem('token');
    if (!t) return;

    const fetchTeam = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/team`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load team members');
        const list = Array.isArray(data) ? data : data.team || [];
        setUsers(list.map((m) => ({
          id:     m._id,
          name:   m.name || '—',
          email:  m.email,
          role:   formatRole(m.role),
          status: m.isVerified ? 'Active' : 'Deactivate',
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [token]);

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  if (loading) {
    return (
      <div className="role-table-container">
        <table className="role-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <tr key={i}>
                {[...Array(4)].map((_, j) => (
                  <td key={j}><div className="rmt-skeleton-cell" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="role-table-container">
        <p className="rmt-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="role-table-container">
      <table className="role-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  className={`status-select ${user.status.toLowerCase()}`}
                >
                  <option value="Active">Active</option>
                  <option value="Deactivate">Deactivate</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagementTable;