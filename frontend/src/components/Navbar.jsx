import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/");
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown when mouse leaves the user area
  const handleMouseLeave = () => setIsDropdownOpen(false);

  // Optional: Open on hover for desktop, while keeping click for touch
  const handleMouseEnter = () => setIsDropdownOpen(true);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link
            to="/"
            className="logo"
            onClick={() => setIsDropdownOpen(false)}
          >
            🐛 BugBounty
          </Link>
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/bugs" className="nav-link">
              Bugs
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/create-bug" className="nav-link nav-link-primary">
                  Post Bug
                </Link>
              </li>
              <li
                className={`navbar-user ${isDropdownOpen ? "active" : ""}`}
                onClick={toggleDropdown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="user-info">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
                    alt={user?.username}
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.username}</span>
                  <span
                    className={`dropdown-arrow ${isDropdownOpen ? "up" : "down"}`}
                  >
                    ▾
                  </span>
                </div>

                {/* The dropdown visibility is controlled by the 'show' class 
                  which is toggled by the isDropdownOpen state.
                */}
                <div
                  className={`user-dropdown ${isDropdownOpen ? "show" : ""}`}
                >
                  <Link
                    to="/my-bugs"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Bugs
                  </Link>
                  <Link
                    to="/my-submissions"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Submissions
                  </Link>
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-link nav-link-primary">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
