import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import BugCard from "../components/BugCard";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingSpinner, { ErrorAlert } from "../components/Alerts";
import "../styles/Dashboard.css";

// Local API instance for dashboard specific calls
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [myBugs, setMyBugs] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Logic to determine active tab from the URL path
  const getInitialTab = () => {
    if (location.pathname === "/my-bugs") return "my-bugs";
    if (location.pathname === "/my-submissions") return "my-submissions";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Update tab if user navigates via Navbar links
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch both datasets in parallel
      const [bugsRes, subsRes] = await Promise.all([
        api.get("/bugs/my-bugs"),
        api.get("/submissions/my"),
      ]);

      setMyBugs(bugsRes.data?.data || []);
      setMySubmissions(subsRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Dynamic reward calculation based on approved submissions
  const totalEarned = mySubmissions
    .filter((s) => s.status === "APPROVED")
    .reduce((acc, curr) => acc + (curr.bug?.bountyAmount || 0), 0);

  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.username}!</p>
        </div>

        {error && <ErrorAlert message={error} onClose={() => setError("")} />}

        {/* Quick Statistics Overview */}
        <section className="stats-overview">
          <div className="stats-grid">
            <div className="stat-card highlight">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <span className="stat-label">Bugs Posted</span>
                <span className="stat-value">{myBugs.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📩</div>
              <div className="stat-content">
                <span className="stat-label">My Submissions</span>
                <span className="stat-value">{mySubmissions.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <span className="stat-label">Bounties Earned</span>
                <span className="stat-value">₹{totalEarned}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "my-bugs" ? "active" : ""}`}
            onClick={() => setActiveTab("my-bugs")}
          >
            My Bugs ({myBugs.length})
          </button>
          <button
            className={`tab ${activeTab === "my-submissions" ? "active" : ""}`}
            onClick={() => setActiveTab("my-submissions")}
          >
            My Submissions ({mySubmissions.length})
          </button>
        </div>

        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="empty-state">
              <h3>Recent Activity</h3>
              <p>
                You have earned <strong>₹{totalEarned}</strong> from bug
                hunting!
              </p>
              <div
                className="quick-actions"
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <Link to="/create-bug" className="btn btn-primary">
                  Post New Bug
                </Link>
                <Link
                  to="/bugs"
                  className="btn btn-secondary"
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  Find Bugs
                </Link>
              </div>
            </div>
          )}

          {/* My Bugs Tab (Bugs created by user) */}
          {activeTab === "my-bugs" && (
            <section className="my-bugs-tab">
              {myBugs.length > 0 ? (
                <div className="bugs-grid">
                  {myBugs.map((bug) => (
                    <BugCard key={bug._id || bug.id} bug={bug} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't posted any bugs yet.</p>
                  <Link to="/create-bug" className="btn btn-primary">
                    Post Your First Bug
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* My Submissions Tab (Solutions submitted by user) */}
          {activeTab === "my-submissions" && (
            <section className="my-submissions-tab">
              {mySubmissions.length > 0 ? (
                <div className="submissions-list">
                  {mySubmissions.map((sub) => (
                    <div key={sub._id} className="submission-item">
                      <div className="submission-info">
                        <h4>{sub.bug?.title || "Unknown Bug"}</h4>
                        <p>{sub.description}</p>
                        <div style={{ marginTop: "0.5rem" }}>
                          <span
                            className={`badge ${sub.status === "APPROVED" ? "badge-open" : sub.status === "REJECTED" ? "badge-closed" : ""}`}
                            style={{
                              backgroundColor:
                                sub.status === "APPROVED"
                                  ? "#dcfce7"
                                  : sub.status === "REJECTED"
                                    ? "#fee2e2"
                                    : "#f3f4f6",
                              color:
                                sub.status === "APPROVED"
                                  ? "#166534"
                                  : sub.status === "REJECTED"
                                    ? "#991b1b"
                                    : "#374151",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "999px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            {sub.status}
                          </span>
                          {sub.status === "APPROVED" && (
                            <span
                              style={{
                                marginLeft: "1rem",
                                color: "#16a34a",
                                fontWeight: "bold",
                              }}
                            >
                              + ₹{sub.bug?.bountyAmount}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/bugs/${sub.bug?._id}`}
                        className="btn btn-secondary"
                      >
                        View Bug
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't submitted any solutions yet.</p>
                  <Link to="/bugs" className="btn btn-primary">
                    Start Hunting
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
