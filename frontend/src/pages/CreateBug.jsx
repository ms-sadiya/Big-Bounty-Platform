import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bugAPI } from "../api/bugAPI"; // Using your centralized API
import { ErrorAlert } from "../components/Alerts";
import "../styles/CreateBug.css";

const CreateBug = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bountyAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation matching your Task Requirements
    if (Number(formData.bountyAmount) < 1) {
      setError("Bounty amount must be at least 1.");
      return;
    }

    setLoading(true);
    try {
      const response = await bugAPI.createBug({
        ...formData,
        bountyAmount: Number(formData.bountyAmount),
      });

      if (response.data.success) {
        // Redirecting to details using the MongoDB _id
        navigate(`/bugs/${response.data.data._id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to post bug. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-bug-container">
      <div className="create-bug-header">
        <h1>Post a New Bug</h1>
        <p>Offer a bounty and get technical solutions from the community.</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <form onSubmit={handleSubmit} className="create-bug-form">
        <div className="form-group">
          <label htmlFor="title">Bug Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Login session timeout issue on Safari"
            required
          />
          <small>Keep it short and descriptive.</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Technical Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the steps to reproduce, expected vs actual behavior..."
            required
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bountyAmount">Bounty Amount (₹)</label>
          <input
            type="number"
            id="bountyAmount"
            name="bountyAmount"
            value={formData.bountyAmount}
            onChange={handleChange}
            placeholder="4000"
            required
            min="1"
          />
          <small>High bounties attract better and faster solutions.</small>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Posting..." : "Post Bug Report"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Added Tips Section as defined in your CSS */}
      <section className="tips-section">
        <h3>Pro-Tips for Bug Creators</h3>
        <ul>
          <li>Be specific about the environment (Browser, OS, Version).</li>
          <li>Include clear "Steps to Reproduce".</li>
          <li>
            A higher bounty (e.g., ₹4000) encourages more detailed solutions.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default CreateBug;
