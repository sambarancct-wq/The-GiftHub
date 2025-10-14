import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import { type User } from '../types';
import '../styles/Navbar.css';
//import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

/*interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}*/

function getStoredUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

const Navbar: React.FC = () => {
  const { user:contextUser, logout } = useAuth();
  const user = contextUser || getStoredUser();
  console.log("Navbar user:", user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  /*const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };*/

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
              <Link to="/create-event">Create Event</Link>
              <Link to="/events">Browse Events</Link>
              <Link to="/my-events">My Events</Link> {/* All users can see their events */}
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
        <div className="navbar-user-menu" ref={dropdownRef}>
          <button className="navbar-user-button" onClick={toggleDropdown}>
            {user.username || user.email}
            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></span>
          </button>
          {isDropdownOpen && (
            <div className="navbar-dropdown">
              <div className="user-info">
                <strong>{user.username}</strong>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                Profile
              </Link>
              <Link to="/my-events" onClick={() => setIsDropdownOpen(false)}>
                My Events
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