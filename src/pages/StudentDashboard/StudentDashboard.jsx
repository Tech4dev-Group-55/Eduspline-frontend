import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentSidebar from "./components/StudentSidebar/StudentSidebar";
import TopBar from "../AdminDashboard/components/TopBar/TopBar";
import "./StudentDashboard.css";

const BASE_URL = "https://eduspline-backend-0y8n.onrender.com/api";

const StudentDashboard = () => {
  const { token } = useAuth();
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

  const renderContent = () => {
    if (loading) {
      return <div className="student-state-message">Loading your predictions...</div>;
    }

    if (error) {
      return (
        <div className="student-state-message student-state-error">
          {error}
        </div>
      );
    }

    if (!data) {
      return <div className="student-state-message">No prediction data available.</div>;
    }

    return (
      <div className="student-predictions">
        <h1 className="predictions-title">Your Predictions</h1>
        <pre className="predictions-data">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <StudentSidebar />
      <div className="main-content">
        <TopBar />
        <div className="student-dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
