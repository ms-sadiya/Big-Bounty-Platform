import React from "react";
import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  truncateText,
} from "../utils/helpers";
import "../styles/BugCard.css";

const BugCard = ({ bug }) => {
  // Use submissionCount from aggregated data if available, else fallback to length
  const submissionCount = bug.submissionCount || bug.submissions?.length || 0;

  return (
    <div className="bug-card">
      {/* Absolute positioned notification badge */}
      {submissionCount > 0 && (
        <div
          className="submission-badge-notify"
          title={`${submissionCount} solutions submitted`}
        >
          {submissionCount}
        </div>
      )}

      <div className="bug-card-header">
        <div className="bug-info">
          <h3 className="bug-title">
            <Link to={`/bugs/${bug._id}`} className="bug-link">
              {/* Ensure title doesn't break grid spacing */}
              {truncateText(bug.title, 50)}
            </Link>
          </h3>
          <p className="bug-description">{truncateText(bug.description, 70)}</p>
        </div>
        {/* Status badge remains visible on the top right */}
        <span className={`badge ${getStatusColor(bug.status)}`}>
          {bug.status}
        </span>
      </div>

      <div className="bug-meta">
        <div className="meta-item">
          <span className="meta-label">Creator</span>
          <span className="creator-name">
            {bug.creator?.username || "System"}
          </span>
        </div>
      </div>

      <div className="bug-stats">
        <div className="stat">
          <span className="stat-icon" aria-label="bounty">
            💰
          </span>
          <span className="stat-value">{formatCurrency(bug.bountyAmount)}</span>
        </div>
        <div className="stat">
          <span className="stat-icon" aria-label="date">
            📅
          </span>
          <span className="stat-value">{formatDate(bug.createdAt)}</span>
        </div>
      </div>

      <div className="bug-card-footer">
        <Link to={`/bugs/${bug._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BugCard;
