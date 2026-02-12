import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner, { ErrorAlert } from "../components/Alerts";
import "../styles/BugDetail.css";
import { bugAPI } from "../api/bugAPI";

const BugDetails = () => {
  const { bugId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState({ bug: null, submissions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form state for new submission
  const [submissionForm, setSubmissionForm] = useState({
    description: "",
    proofLink: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      // If bugId is the string "undefined" or null, stop here
      if (!bugId || bugId === "undefined") {
        setError("Invalid Bug ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/v1/bugs/${bugId}`,
          {
            withCredentials: true,
          },
        );
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bug details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bugId]);

  // Handle Approving a solution (Creator Only)
  const handleApprove = async (submissionId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/submissions/${submissionId}/approve`,
        {},
        { withCredentials: true },
      );
      if (response.data.success) {
        alert("Bounty awarded and bug closed!");
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  // Delete bus
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this bug? This will also remove all submissions.",
      )
    )
      return;

    try {
      await bugAPI.deleteBug(bugId);
      alert("Bug deleted successfully");
      navigate("/bugs"); // Redirect to list after deletion
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete bug");
    }
  };

  // Handle Submitting a solution (Creator Only)
  const handleSubmission = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/submissions/${bugId}`,
        submissionForm,
        { withCredentials: true },
      );
      if (response.data.success) {
        alert("Solution submitted successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  const isCreator = user?._id === data.bug.creator._id;
  const userSubmission = data.submissions.find((s) => s.user._id === user?._id);
  const isClosed = data.bug.status === "CLOSED";

  const getDisplayStatus = () => {
    if (isClosed) return "CLOSED";
    if (userSubmission) return "UNDER REVIEW";
    return "OPEN";
  };

  return (
    <div className="bug-detail-container">
      <header className="bug-detail-header">
        <div>
          <h1>{data.bug.title}</h1>
          <div className="bug-meta-info">
            <span
              className={`badge ${getDisplayStatus().toLowerCase().replace(" ", "-")}`}
            >
              {getDisplayStatus()}
            </span>
            <span>
              Posted: {new Date(data.bug.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="bounty-box">
          <span className="bounty-label">Bounty Reward</span>
          <span className="bounty-amount">₹{data.bug.bountyAmount}</span>
        </div>
        {isCreator && (
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            Delete Bug
          </button>
        )}
      </header>

      <div className="bug-detail-content">
        <main className="bug-main">
          <section className="bug-description-section">
            <h2>Technical Description</h2>
            <p>{data.bug.description}</p>
          </section>

          {/* CREATOR VIEW: Reviewing notifications/submissions */}
          {isCreator && (
            <section className="submissions-section">
              <h2>Submissions Received ({data.submissions.length})</h2>
              {data.submissions.map((sub) => (
                <div key={sub._id} className="submission-card notification">
                  <div className="sub-header">
                    <strong>Creator: {sub.user.username}</strong>
                    <span className="sub-status">{sub.status}</span>
                  </div>
                  <p>{sub.description}</p>
                  <a
                    href={sub.proofLink}
                    target="_blank"
                    rel="noreferrer"
                    className="proof-link"
                  >
                    View Proof of Work
                  </a>
                  {!isClosed && (
                    <button
                      onClick={() => handleApprove(sub._id)}
                      className="btn btn-primary"
                      style={{ marginTop: "1rem" }}
                    >
                      Approve & Pay Reward
                    </button>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Creator VIEW: Submit solution if they haven't yet and bug is open */}
          {!isCreator && !isClosed && (
            <section className="submission-form-section">
              <h2>Submit Your Solution</h2>
              <form onSubmit={handleSubmission} className="submission-form">
                <div className="form-group">
                  <label>Technical Explanation</label>
                  <textarea
                    required
                    placeholder="Describe how you fixed the bug..."
                    value={submissionForm.description}
                    onChange={(e) =>
                      setSubmissionForm({
                        ...submissionForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Proof Link (GitHub, Video, Cloud Drive)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/your-pr..."
                    value={submissionForm.proofLink}
                    onChange={(e) =>
                      setSubmissionForm({
                        ...submissionForm,
                        proofLink: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Send Solution"}
                </button>
              </form>
            </section>
          )}

          {/* WINNER ANNOUNCEMENT */}
          {isClosed && (
            <div className="winner-announcement">
              <h3>🎉 Solution Found!</h3>
              <p>
                This bug was successfully resolved by{" "}
                <strong>{data.bug.winner?.username}</strong>.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BugDetails;
