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
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to events list with search query
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
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
              <Link to="/create-event">Create Event</Link>
              <Link to="/events">Browse Events</Link>
              {user.isOrganizer && (
                <Link to="/my-events">My Events</Link>
              )}
              <Link to="/gifts">All Gifts</Link>
            </div>
          </div>
        ) : (
          <>
            <Link to="/events">Browse Events</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      {user && (
        <div className="navbar-search">
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              placeholder="Search for events or gifts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className='search-btn'>
              <FaSearch/>
            </button>
          </form>
        </div>
      )}

      {user && (
        <div className="navbar-user-menu" ref={dropdownRef}>
          <button className="navbar-user-button" onClick={toggleDropdown}>
            {user.username || user.email}
            {user.isOrganizer && <span className="organizer-badge">(Organizer)</span>}
            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></span>
          </button>
          {isDropdownOpen && (
            <div className="navbar-dropdown">
              <div className="user-info">
                <strong>{user.username}</strong>
                {user.isOrganizer && <span className="organizer-tag">(Organizer)</span>}
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                Profile
              </Link>
              {user.isOrganizer && (
                <Link to="/my-events" onClick={() => setIsDropdownOpen(false)}>
                  My Events
                </Link>
              )}
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