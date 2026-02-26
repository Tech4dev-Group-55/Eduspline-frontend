import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    setFile(file);
    console.log('File selected:', file.name);

    // Backend integration - uncomment when ready
    /*
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/student-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        alert('File uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
    */

    // Demo mode
    alert(`File "${file.name}" ready to upload!\n\n(Backend integration pending)`);
  };

  return (
    <div className="file-upload-container">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2 className="upload-title">You do not have any student data yet</h2>

        <div className="upload-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6M12 11v6m-3-3l3-3 3 3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="upload-text">Drag and drop file here</p>

        <label htmlFor="file-input" className="choose-file-btn">
          choose file
        </label>
        <input
          id="file-input"
          type="file"
          onChange={handleFileInput}
          accept=".csv,.xlsx,.xls"
          style={{ display: 'none' }}
        />

        {file && (
          <p className="file-name">Selected: {file.name}</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;