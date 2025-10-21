import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';


const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBookingsDropdown, setShowBookingsDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    setShowLogin(false);
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setShowBookingsDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowBookingsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  return (
    <>
      <nav className="nav" role="navigation" aria-label="Main navigation">
        {/* LEFT: Logo */}
        <Link to="/" className="logo-container" onClick={handleLinkClick}>
          <img src='/logonav.png' alt="HomeCare & Rentals" className="logo" />
          <span className="brand-name">Home Services & Rentals</span>
        </Link>

        {/* CENTER: Links */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`} role="menubar">
          <li role="none"><Link to="/" role="menuitem" onClick={handleLinkClick}>Home</Link></li>
          <li role="none"><a href="#services" role="menuitem" onClick={handleLinkClick}>Services</a></li>
          <li role="none"><a href="#contact" role="menuitem" onClick={handleLinkClick}>Contact</a></li>

          {/* Bookings dropdown: hover on desktop, click on mobile */}
          <li
            ref={dropdownRef}
            className={`dropdown ${showBookingsDropdown ? 'open' : ''}`}
            onMouseEnter={() => setShowBookingsDropdown(true)}
            onMouseLeave={() => setShowBookingsDropdown(false)}
            role="none"
          >
            <button
              className="dropbtn"
              aria-haspopup="true"
              aria-expanded={showBookingsDropdown}
              onClick={(e) => {
                e.stopPropagation(); // prevent window click handler
                setShowBookingsDropdown((s) => !s);
              }}
            >
              📖 My Bookings
            </button>

            <div className="dropdown-content" role="menu" aria-label="My bookings">
              <Link to="/my-bookings" onClick={handleLinkClick} role="menuitem">Service Bookings</Link>
              <Link to="/my-rental-bookings" onClick={handleLinkClick} role="menuitem">Rental Bookings</Link>
            </div>
          </li>

          <li role="none" className="auth-li">
            {user ? (
              <div className="welcome-msg">
                <span>👋 <strong>{user.name}</strong></span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <button
                className="login-btn"
                onClick={() => {
                  setShowLogin(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Login / Register
              </button>
            )}
          </li>
        </ul>

        {/* RIGHT: actions (hamburger) */}
        <div className="actions">
          <button
            className="hamburger"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen((s) => !s)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
