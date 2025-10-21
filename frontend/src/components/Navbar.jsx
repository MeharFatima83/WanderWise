import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">WanderWise</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/itinerary">Itinerary</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="navbar-auth">
        {isAuthenticated ? (
          <div className="user-menu">
            <span className="user-name">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="btn logout-btn">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn login-btn">Login</Link>
            <Link to="/signup" className="btn signup-btn">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


