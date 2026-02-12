import React from "react";
import { formatDate, getTimeAgo } from "../utils/helpers";
import "../styles/SubmissionCard.css";

const SubmissionCard = ({ submission, onApprove, isCreator }) => {
  return (
    <div className="submission-card">
      <div className="submission-header">
        <div className="submitter-info">
          <div className="submitter-details">
            <span className="submitter-name">{submission.user.username}</span>
            <span className="submission-date">
              {getTimeAgo(submission.createdAt)}
            </span>
          </div>
        </div>
        {submission.status === "APPROVED" && (
          <span className="badge badge-approved">✓ Approved</span>
        )}
        {submission.status === "REJECTED" && (
          <span className="badge badge-rejected">✗ Rejected</span>
        )}
      </div>

      <div className="submission-content">
        <h4 className="submission-title">Solution Description</h4>
        <p className="submission-description">{submission.description}</p>

        <div className="submission-proof">
          <h5>Proof:</h5>
          {submission.proofLink && (
            <a
              href={submission.proofLink}
              target="_blank"
              rel="noopener noreferrer"
              className="proof-link"
            >
              View Proof
            </a>
          )}
        </div>
      </div>

      {isCreator && submission.status === "PENDING" && (
        <div className="submission-actions">
          <button
            onClick={() => onApprove(submission._id)}
            className="btn btn-success"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;
