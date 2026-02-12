import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Home.css";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🐛 Bug Bounty Platform</h1>
          <p>
            Find bugs, earn rewards, and help developers build secure
            applications
          </p>
          {!isAuthenticated && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/bugs" className="btn btn-secondary btn-lg">
                Browse Bugs
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="hero-buttons">
              <Link to="/bugs" className="btn btn-primary btn-lg">
                Browse Bugs
              </Link>
              <Link to="/create-bug" className="btn btn-secondary btn-lg">
                Post a Bug
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Post a Bug</h3>
            <p>Developers post bugs they found with a bounty reward</p>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Submit Solutions</h3>
            <p>Security researchers submit fixes and proof of resolution</p>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Review & Approve</h3>
            <p>Bug creator reviews and approves the best solution</p>
          </div>
          <div className="step">
            <div className="step-icon">4</div>
            <h3>Earn Rewards</h3>
            <p>Winner receives the bounty and builds their reputation</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Flexible Bounties</h3>
            <p>
              Set any bounty amount for your bugs. From small fixes to critical
              vulnerabilities.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure & Verified</h3>
            <p>
              All submissions require proof. Creators control the final approval
              process.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Build Reputation</h3>
            <p>
              Earn rewards and build your profile as a top security researcher.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Categorized Bugs</h3>
            <p>
              Find bugs by category and difficulty level. Easy to navigate and
              search.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of developers and security researchers</p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Account Now
          </Link>
        )}
      </section>
    </div>
  );
};

export default Home;
