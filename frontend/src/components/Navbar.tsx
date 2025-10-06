import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AuthResponse } from '../types';
import '../styles/Navbar.css';
import { FaSearch } from 'react-icons/fa';

interface NavbarProps {
  user: AuthResponse | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
    navigate('/'); // Redirect to home after logout
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        GiftHub
      </div>

      <div className="navbar-links">
        {user ? (
          <div className="nav-container">
            <div className="page-links">
              <Link to="/gift/add">Add Gift</Link>
              <Link to="/event/add">Add Event</Link>
              <Link to="/gift/list">Gift List</Link>
              <Link to="/event/list">Event List</Link>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      {user && (
        <div className="navbar-search">
          <div className="search-bar">
            <input placeholder="Search for Registry or Gift List" />
            <button type="submit" className='search-btn'>
              <FaSearch/>
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="navbar-user-menu" ref={dropdownRef}>
          <button className="navbar-user-button" onClick={toggleDropdown}>
            {user.username || 'User'}
            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></span>
          </button>
          {isDropdownOpen && (
            <div className="navbar-dropdown">
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                Profile Page
              </Link>
              <div className="dropdown-divider"></div>
              <button className="logout-btn" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
