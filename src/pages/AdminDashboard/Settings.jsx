import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import RoleManagementTable from './components/RoleManagementTable/RoleManagementTable';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const BASE_URL = 'https://eduspline-backend.onrender.com/api';

const Settings = () => {
  const { token, user } = useAuth();

  const [isEditing, setIsEditing]           = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [toast, setToast]                   = useState(null); // { type: 'success'|'error', message }

  const [formData, setFormData] = useState({
    name:              '',
    email:             user?.email || '',
    type:              '',
    estimatedLearners: '',
    country:           '',
  });
  const [originalData, setOriginalData] = useState({ ...formData });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleDiscard = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const t = token || localStorage.getItem('token');
      // Only include fields that have a value — backend should not receive empty strings
      const payload = {};
      if (formData.name)              payload.name              = formData.name;
      if (formData.email)             payload.email             = formData.email;
      if (formData.type)              payload.type              = formData.type;
      if (formData.estimatedLearners) payload.estimatedLearners = formData.estimatedLearners;
      if (formData.country)           payload.country           = formData.country;

      const res = await fetch(`${BASE_URL}/auth/settings`, {
        method:  'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${t}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast('error', data.message || 'Failed to save settings. Please try again.');
        return;
      }

      showToast('success', data.message || 'Settings saved successfully!');
      setOriginalData({ ...formData });
      setIsEditing(false);
    } catch {
      showToast('error', 'Network error. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      showToast('success', `"${file.name}" ready to upload. (Backend integration pending)`);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="settings-content">
          <div className="settings-container">

            {/* ── Toast notification ─────────────────────────────────────── */}
            {toast && (
              <div className={`settings-toast settings-toast--${toast.type}`}>
                {toast.type === 'success' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
                {toast.message}
                <button className="toast-close" onClick={() => setToast(null)}>✕</button>
              </div>
            )}

            {/* ── Institution Profile ────────────────────────────────────── */}
            <div className="settings-header">
              <h2 className="settings-title">Institutions profile</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={handleEdit}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit
                </button>
              )}
            </div>

            <div className="profile-grid">
              <div className="form-group">
                <label>Institution's name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g. Global University"
                />
              </div>

              <div className="form-group">
                <label>Institution's email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g. globaluniversity@gmail.com"
                />
              </div>

              <div className="form-group">
                <label>Institution's type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g. University, edtech"
                />
              </div>

              <div className="form-group">
                <label>Estimated number of learners</label>
                <input
                  type="text"
                  name="estimatedLearners"
                  value={formData.estimatedLearners}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g. 501-1000"
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g. Nigeria"
                />
              </div>
            </div>

            {isEditing && (
              <div className="action-buttons">
                <button className="discard-btn" onClick={handleDiscard} disabled={saving}>
                  Discard
                </button>
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            )}

            {/* ── Role Management ────────────────────────────────────────── */}
            <div className="role-management-section">
              <h3 className="section-title">Role management</h3>
              <RoleManagementTable />
            </div>

            {/* ── CSV Upload ─────────────────────────────────────────────── */}
            <div className="csv-upload-section">
              <label htmlFor="csv-upload" className="csv-label">
                Upload CSV file
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="csv-upload" className="csv-upload-btn">
                choose file
              </label>
            </div>

            {/* ── Danger zone ────────────────────────────────────────────── */}
            <div className="danger-zone">
              <button
                className="delete-account-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete account
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Delete modal ────────────────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account?</h3>
            <p>This action cannot be undone. All data will be permanently deleted.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;