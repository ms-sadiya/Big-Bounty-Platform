import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Bug Bounty Platform</h4>
          <p>
            Help developers find and fix bugs. Earn rewards for security
            research.
          </p>
        </div>

        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/bugs">Browse Bugs</a>
            </li>
            <li>
              <a href="/leaderboard">Leaderboard</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Legal</h5>
          <ul>
            <li>
              <a href="/">Terms of Service</a>
            </li>
            <li>
              <a href="/">Privacy Policy</a>
            </li>
            <li>
              <a href="/">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Follow Us</h5>
          <div className="social-links">
            <a href="/">Twitter</a>
            <a href="/">GitHub</a>
            <a href="/">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Bug Bounty Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
