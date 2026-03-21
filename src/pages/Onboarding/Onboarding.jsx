import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import './Onboarding.css';

const BASE_URL = 'https://eduspline-backend-0y8n.onrender.com/api';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Botswana', 'Brazil', 'Cameroon', 'Canada',
  'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark',
  'Egypt', 'Ethiopia', 'Finland', 'France', 'Germany', 'Ghana', 'Greece',
  'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kenya', 'Kuwait',
  'Lebanon', 'Libya', 'Malaysia', 'Mexico', 'Morocco', 'Mozambique',
  'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal', 'Singapore',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden',
  'Switzerland', 'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe',
];

const INSTITUTION_TYPES = [
  { label: 'Corporate Learning & Development', value: 'corporate_learning_and_development' },
  { label: 'Certification Body', value: 'certification_body' },
  { label: 'EdTech', value: 'edtech' },
  { label: 'Other', value: 'other' },
];

const LEARNER_RANGES = [
  { label: '100 - 500', value: '100-500' },
  { label: '501 - 1,000', value: '501-1000' },
  { label: 'Above 1,000', value: 'above 1000' },
];

const TEAM_ROLES = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Instructor', value: 'instructor' },
  { label: 'Student', value: 'student' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [institution, setInstitution] = useState({
    name: '',
    type: '',
    estimatedLearners: '',
    country: '',
  });
  const [step1Errors, setStep1Errors] = useState({});
  const [step1Loading, setStep1Loading] = useState(false);

  // Step 2 state
  const [teamMethod, setTeamMethod] = useState(null); // 'manual' | 'csv'
  const [teamMember, setTeamMember] = useState({ name: '', email: '', role: '' });
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamCsvFile, setTeamCsvFile] = useState(null);
  const [step2Errors, setStep2Errors] = useState({});
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Success, setStep2Success] = useState(false);

  // Step 3 state
  const [studentCsvFile, setStudentCsvFile] = useState(null);
  const [step3Errors, setStep3Errors] = useState({});
  const [step3Loading, setStep3Loading] = useState(false);
  const [step3Success, setStep3Success] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ─── Step 1: Register Institution ────────────────────────────────────────
  const handleInstitutionChange = (e) => {
    const { name, value } = e.target;
    setInstitution((prev) => ({ ...prev, [name]: value }));
    if (step1Errors[name]) setStep1Errors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const errors = {};
    if (!institution.name.trim()) errors.name = 'Institution name is required';
    if (!institution.type) errors.type = 'Please select an institution type';
    if (!institution.estimatedLearners) errors.estimatedLearners = 'Please select a range';
    if (!institution.country) errors.country = 'Please select a country';
    return errors;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setStep1Errors(errors);
      return;
    }

    setStep1Loading(true);
    setStep1Errors({});
    try {
      const res = await fetch(`${BASE_URL}/auth/institution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(institution),
      });
      const data = await res.json();
      if (!res.ok) {
        setStep1Errors({ form: data.message || 'Failed to register institution.' });
        return;
      }
      setStep(2);
    } catch {
      setStep1Errors({ form: 'Network error. Please check your connection.' });
    } finally {
      setStep1Loading(false);
    }
  };

  // ─── Step 2: Add Team Members ────────────────────────────────────────────
  const handleTeamMemberChange = (e) => {
    const { name, value } = e.target;
    setTeamMember((prev) => ({ ...prev, [name]: value }));
    if (step2Errors[name]) setStep2Errors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateTeamMember = () => {
    const errors = {};
    if (!teamMember.name.trim()) errors.name = 'Name is required';
    if (!teamMember.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(teamMember.email)) errors.email = 'Invalid email address';
    if (!teamMember.role) errors.role = 'Please select a role';
    return errors;
  };

  const handleAddTeamMember = () => {
    const errors = validateTeamMember();
    if (Object.keys(errors).length > 0) {
      setStep2Errors(errors);
      return;
    }
    setTeamMembers((prev) => [...prev, { ...teamMember }]);
    setTeamMember({ name: '', email: '', role: '' });
    setStep2Errors({});
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTeamCsvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamCsvFile(file);
      setStep2Errors({});
    }
  };

  const handleStep2Submit = async () => {
    setStep2Loading(true);
    setStep2Errors({});

    try {
      if (teamMethod === 'manual') {
        if (teamMembers.length === 0) {
          setStep2Errors({ form: 'Please add at least one team member.' });
          setStep2Loading(false);
          return;
        }
        // Send each member individually
        for (const member of teamMembers) {
          const res = await fetch(`${BASE_URL}/team/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(member),
          });
          if (!res.ok) {
            const data = await res.json();
            setStep2Errors({ form: data.message || `Failed to invite ${member.name}.` });
            setStep2Loading(false);
            return;
          }
        }
      } else if (teamMethod === 'csv') {
        if (!teamCsvFile) {
          setStep2Errors({ form: 'Please select a CSV file.' });
          setStep2Loading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', teamCsvFile);
        const res = await fetch(`${BASE_URL}/team/invite/csv`, {
          method: 'POST',
          headers: { ...authHeaders },
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json();
          setStep2Errors({ form: data.message || 'Failed to upload CSV.' });
          setStep2Loading(false);
          return;
        }
      }
      setStep2Success(true);
    } catch {
      setStep2Errors({ form: 'Network error. Please check your connection.' });
    } finally {
      setStep2Loading(false);
    }
  };

  const handleContinueToStep3 = () => {
    setStep(3);
  };

  // ─── Step 3: Upload Student Data ─────────────────────────────────────────
  const handleStudentCsvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentCsvFile(file);
      setStep3Errors({});
    }
  };

  const handleStep3Submit = async () => {
    setStep3Loading(true);
    setStep3Errors({});

    if (!studentCsvFile) {
      setStep3Errors({ form: 'Please select a CSV file.' });
      setStep3Loading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', studentCsvFile);
      const res = await fetch(`${BASE_URL}/predictions/upload`, {
        method: 'POST',
        headers: { ...authHeaders },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setStep3Errors({ form: data.message || 'Failed to upload student data.' });
        return;
      }
      setStep3Success(true);
    } catch {
      setStep3Errors({ form: 'Network error. Please check your connection.' });
    } finally {
      setStep3Loading(false);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/admin-dashboard', { replace: true });
  };

  // ─── Progress indicator ──────────────────────────────────────────────────
  const renderProgress = () => (
    <div className="onboarding-progress">
      {[1, 2, 3].map((s) => (
        <div key={s} className={`progress-step ${step >= s ? 'progress-step--active' : ''} ${step > s ? 'progress-step--done' : ''}`}>
          <div className="progress-dot">{step > s ? <CheckCircle size={16} /> : s}</div>
          <span className="progress-label">
            {s === 1 ? 'Register' : s === 2 ? 'Team' : 'Data'}
          </span>
        </div>
      ))}
      <div className="progress-line">
        <div className="progress-line-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
      </div>
    </div>
  );

  // ─── Step 1 Render ───────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="form-section">
      <div className="step-indicator">
        <span className="step-label">Step 1:</span>
        <span className="step-name">Register</span>
      </div>

      {step1Errors.form && (
        <div className="error-banner">
          <AlertCircle size={14} />
          {step1Errors.form}
        </div>
      )}

      <form onSubmit={handleStep1Submit} className="onboarding-form">
        <div className="form-group">
          <label htmlFor="name">Institution name</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              name="name"
              value={institution.name}
              onChange={handleInstitutionChange}
              placeholder="Enter institution name"
              className={step1Errors.name ? 'error' : ''}
            />
          </div>
          {step1Errors.name && <span className="error-text">{step1Errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Institution type</label>
          <div className="select-wrapper">
            <select
              id="type"
              name="type"
              value={institution.type}
              onChange={handleInstitutionChange}
              className={step1Errors.type ? 'error' : ''}
            >
              <option value="" disabled>Select type</option>
              {INSTITUTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          {step1Errors.type && <span className="error-text">{step1Errors.type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="estimatedLearners">Estimated number of learners</label>
          <div className="select-wrapper">
            <select
              id="estimatedLearners"
              name="estimatedLearners"
              value={institution.estimatedLearners}
              onChange={handleInstitutionChange}
              className={step1Errors.estimatedLearners ? 'error' : ''}
            >
              <option value="" disabled>Select range</option>
              {LEARNER_RANGES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {step1Errors.estimatedLearners && <span className="error-text">{step1Errors.estimatedLearners}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <div className="select-wrapper">
            <select
              id="country"
              name="country"
              value={institution.country}
              onChange={handleInstitutionChange}
              className={step1Errors.country ? 'error' : ''}
            >
              <option value="" disabled>Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {step1Errors.country && <span className="error-text">{step1Errors.country}</span>}
        </div>

        <Button
          variant="primary"
          size="large"
          type="submit"
          disabled={step1Loading}
          className="continue-button"
        >
          {step1Loading ? 'Saving...' : 'Continue'}
        </Button>
      </form>
    </div>
  );

  // ─── Step 2 Render ───────────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="form-section">
      <div className="step-indicator">
        <span className="step-label">Step 2:</span>
        <span className="step-name">Add your team members</span>
      </div>

      {step2Success ? (
        <div className="success-card">
          <CheckCircle size={48} className="success-icon" />
          <h3>Team members added successfully!</h3>
          <p>Your invitations have been sent. Let's upload student data next.</p>
          <Button variant="primary" size="large" onClick={handleContinueToStep3} className="continue-button">
            Continue
          </Button>
        </div>
      ) : (
        <>
          <p className="step-description">How do you want to add your team members?</p>

          <div className="method-options">
            <button
              type="button"
              className={`method-option ${teamMethod === 'manual' ? 'method-option--active' : ''}`}
              onClick={() => { setTeamMethod('manual'); setStep2Errors({}); }}
            >
              <Plus size={20} />
              <span>Add manually</span>
            </button>
            <button
              type="button"
              className={`method-option ${teamMethod === 'csv' ? 'method-option--active' : ''}`}
              onClick={() => { setTeamMethod('csv'); setStep2Errors({}); }}
            >
              <Upload size={20} />
              <span>Upload CSV</span>
            </button>
          </div>

          {step2Errors.form && (
            <div className="error-banner">
              <AlertCircle size={14} />
              {step2Errors.form}
            </div>
          )}

          {teamMethod === 'manual' && (
            <div className="manual-entry">
              <div className="team-form">
                <div className="form-group">
                  <label htmlFor="memberName">Name</label>
                  <input
                    type="text"
                    id="memberName"
                    name="name"
                    value={teamMember.name}
                    onChange={handleTeamMemberChange}
                    placeholder="Enter name"
                    className={step2Errors.name ? 'error' : ''}
                  />
                  {step2Errors.name && <span className="error-text">{step2Errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="memberEmail">Email</label>
                  <input
                    type="email"
                    id="memberEmail"
                    name="email"
                    value={teamMember.email}
                    onChange={handleTeamMemberChange}
                    placeholder="Enter email"
                    className={step2Errors.email ? 'error' : ''}
                  />
                  {step2Errors.email && <span className="error-text">{step2Errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="memberRole">Role</label>
                  <div className="select-wrapper">
                    <select
                      id="memberRole"
                      name="role"
                      value={teamMember.role}
                      onChange={handleTeamMemberChange}
                      className={step2Errors.role ? 'error' : ''}
                    >
                      <option value="" disabled>Select role</option>
                      {TEAM_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  {step2Errors.role && <span className="error-text">{step2Errors.role}</span>}
                </div>

                <Button variant="secondary" size="medium" onClick={handleAddTeamMember} className="add-member-btn">
                  <Plus size={16} /> Add Member
                </Button>
              </div>

              {teamMembers.length > 0 && (
                <div className="members-list">
                  <h4>Added Members ({teamMembers.length})</h4>
                  {teamMembers.map((m, i) => (
                    <div key={i} className="member-item">
                      <div className="member-info">
                        <span className="member-name">{m.name}</span>
                        <span className="member-email">{m.email}</span>
                        <span className="member-role">{TEAM_ROLES.find((r) => r.value === m.role)?.label}</span>
                      </div>
                      <button type="button" className="remove-member" onClick={() => handleRemoveTeamMember(i)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="primary"
                size="large"
                onClick={handleStep2Submit}
                disabled={step2Loading}
                className="continue-button"
              >
                {step2Loading ? 'Sending invites...' : 'Send Invitations'}
              </Button>
            </div>
          )}

          {teamMethod === 'csv' && (
            <div className="csv-upload">
              <div className="upload-area" onClick={() => document.getElementById('teamCsvInput').click()}>
                <Upload size={32} className="upload-icon" />
                <p className="upload-text">
                  {teamCsvFile ? teamCsvFile.name : 'Click to select a CSV file'}
                </p>
                <span className="upload-hint">CSV should contain: name, email, role</span>
                <input
                  type="file"
                  id="teamCsvInput"
                  accept=".csv"
                  onChange={handleTeamCsvChange}
                  hidden
                />
              </div>

              <Button
                variant="primary"
                size="large"
                onClick={handleStep2Submit}
                disabled={step2Loading}
                className="continue-button"
              >
                {step2Loading ? 'Uploading...' : 'Upload & Continue'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ─── Step 3 Render ───────────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="form-section">
      <div className="step-indicator">
        <span className="step-label">Step 3:</span>
        <span className="step-name">Upload student data</span>
      </div>

      {step3Success ? (
        <div className="success-card">
          <CheckCircle size={48} className="success-icon" />
          <h3>Student data uploaded successfully!</h3>
          <p>Your institution is all set up. Let's head to the dashboard.</p>
          <Button variant="primary" size="large" onClick={handleFinish} className="continue-button">
            Go to Dashboard
          </Button>
        </div>
      ) : (
        <>
          <p className="step-description">
            Upload your student data for risk assessment analysis.
          </p>

          {step3Errors.form && (
            <div className="error-banner">
              <AlertCircle size={14} />
              {step3Errors.form}
            </div>
          )}

          <div className="csv-upload">
            <div className="upload-area" onClick={() => document.getElementById('studentCsvInput').click()}>
              <Upload size={32} className="upload-icon" />
              <p className="upload-text">
                {studentCsvFile ? studentCsvFile.name : 'Click to select a CSV file'}
              </p>
              <span className="upload-hint">Upload student data CSV for risk assessment</span>
              <input
                type="file"
                id="studentCsvInput"
                accept=".csv"
                onChange={handleStudentCsvChange}
                hidden
              />
            </div>

            <Button
              variant="primary"
              size="large"
              onClick={handleStep3Submit}
              disabled={step3Loading}
              className="continue-button"
            >
              {step3Loading ? 'Uploading...' : 'Upload & Finish'}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="welcome-section">
          <h1 className="onboarding-title">Welcome</h1>
          <p className="onboarding-subtitle">
            Let's set up your learning ecosystem.<br />
            We'll guide you through a few quick steps to get your institution ready.
          </p>
        </div>

        {renderProgress()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Onboarding;
