import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏠 RealReview
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/upload" className="nav-link">Upload Photo</Link>
              </li>
              <li className="nav-item">
                <Link to="/my-photos" className="nav-link">My Photos</Link>
              </li>
              {isAdmin() && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <span className="nav-user">👤 {user?.username}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-button">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;