import React from "react";
import "../styles/Alerts.css";

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="alert alert-danger">
      <span className="alert-icon">⚠️</span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export const SuccessAlert = ({ message, onClose }) => {
  return (
    <div className="alert alert-success">
      <span className="alert-icon">✓</span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export const InfoAlert = ({ message, onClose }) => {
  return (
    <div className="alert alert-info">
      <span className="alert-icon">ℹ️</span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default LoadingSpinner;
