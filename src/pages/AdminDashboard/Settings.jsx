import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import RoleManagementTable from './components/RoleManagementTable/RoleManagementTable';
import './Settings.css';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    email: 'globaluniversity@gmail.com',
    password: '••••••••',
    institutionType: 'University',
    estimatedLearners: '100',
    country: 'Nigeria',
    backupEmail: 'globaluniversity@gmail.com'
  });
  const [originalData, setOriginalData] = useState({ ...formData });

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleDiscard = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // Backend integration - uncomment when ready
      /*
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Settings saved successfully!');
        setIsEditing(false);
      }
      */

      // Demo mode
      alert('Settings saved successfully! (Demo mode)');
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save settings');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`CSV file "${file.name}" ready to upload!\n\n(Backend integration pending)`);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="settings-content">
          <div className="settings-container">
            
            {/* Institution Profile Section */}
            <div className="settings-header">
              <h2 className="settings-title">Institutions profile</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={handleEdit}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit
                </button>
              )}
            </div>

            <div className="profile-grid">
              <div className="form-group">
                <label>Institution's email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Institution's type</label>
                <input
                  type="text"
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  disabled={!isEditing}
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
                />
              </div>

              <div className="form-group">
                <label>Institution's back-up email</label>
                <input
                  type="email"
                  name="backupEmail"
                  value={formData.backupEmail}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <p className="last-edited">
              Last edited on 1/12/2025 12:15 PM by Koloso Yaa
            </p>

            {isEditing && (
              <div className="action-buttons">
                <button className="discard-btn" onClick={handleDiscard}>
                  Discard
                </button>
                <button className="save-btn" onClick={handleSave}>
                  Save changes
                </button>
              </div>
            )}

            {/* Role Management Section */}
            <div className="role-management-section">
              <h3 className="section-title">Role management</h3>
              <RoleManagementTable />
            </div>

            {/* CSV Upload Section */}
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

            {/* Delete Account Section */}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account?</h3>
            <p>This action cannot be undone. All data will be permanently deleted.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;