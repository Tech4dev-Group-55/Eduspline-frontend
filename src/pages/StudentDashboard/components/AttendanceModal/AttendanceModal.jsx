import React, { useState } from 'react';
import './AttendanceModal.css';

const AttendanceModal = ({ onClose }) => {
  const [reasons, setReasons] = useState([]);
  const [other, setOther] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasonsList = [
    'Cost of data',
    'Medical or Health reasons',
    'Work or Job commitments',
    'Family responsibilities',
    'Lack of motivation or interest',
    'Financial difficulties',
    'Class schedule conflicts',
    'Mental Health / stress / Burnout',
    'Difficulty understanding course content'
  ];

  const handleToggle = (reason) => {
    if (reasons.includes(reason)) {
      setReasons(reasons.filter(r => r !== reason));
    } else {
      setReasons([...reasons, reason]);
    }
  };

  const handleSubmit = () => {
    console.log('Submitted reasons:', reasons, other);
    setSubmitted(true);
    setTimeout(() => onClose(), 2000);
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="success-message">
            <h3>✓ Attendance check-in</h3>
            <p>Thank you for your feedback</p>
            <p className="sub-text">Your feedback helps us improve support for all learners</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content attendance-modal" onClick={(e) => e.stopPropagation()}>
        <h3>📋 Attendance check-in</h3>
        <p>We would like to understand why. Select all that applies.</p>
        
        <div className="reasons-list">
          {reasonsList.map((reason) => (
            <label key={reason} className="reason-checkbox">
              <input
                type="checkbox"
                checked={reasons.includes(reason)}
                onChange={() => handleToggle(reason)}
              />
              <span>{reason}</span>
            </label>
          ))}
          
          <label className="reason-checkbox">
            <input
              type="checkbox"
              checked={!!other}
              onChange={(e) => setOther(e.target.checked ? 'Other' : '')}
            />
            <span>Other</span>
          </label>
          
          {other && (
            <input
              type="text"
              placeholder="Please specify..."
              className="other-input"
              onChange={(e) => setOther(e.target.value)}
            />
          )}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Response
        </button>
      </div>
    </div>
  );
};

export default AttendanceModal;