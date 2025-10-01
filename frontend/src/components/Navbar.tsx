import React, { useState, useEffect, useRef } from 'react';
import type { AuthResponse } from '../types';
import '../styles/Navbar.css';

interface NavbarProps {
  user: AuthResponse | null;
  onLogout: () => void;
  onNavigateToGiftAdd: () => void;
  onNavigateToEventAdd: () => void;
  onNavigateToGiftList: () => void;
  onNavigateToEventList: () => void;
  onNavigateToLanding: () => void;
  onNavigateToLogin: () => void;      // <-- Add this new prop
  onNavigateToRegister: () => void;  // <-- Add this new prop
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onNavigateToGiftAdd,
  onNavigateToEventAdd,
  onNavigateToGiftList,
  onNavigateToEventList,
  onNavigateToLanding,
  onNavigateToLogin,      // <-- Destructure the new prop
  onNavigateToRegister,   // <-- Destructure the new prop
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={onNavigateToLanding}>
        GiftHub
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <a href="#" onClick={onNavigateToGiftAdd}>Add Gift</a>
            <a href="#" onClick={onNavigateToEventAdd}>Add Event</a>
            <a href="#" onClick={onNavigateToGiftList}>Gift List</a>
            <a href="#" onClick={onNavigateToEventList}>Event List</a>
          </>
        ) : ( // <-- Add else block for non-logged-in users
          <>
            <a href="#" onClick={onNavigateToLogin}>Login</a>
            <a href="#" onClick={onNavigateToRegister}>Register</a>
          </>
        )}
      </div>
      {user && ( // Only show user menu if a user is logged in
        <div className="navbar-user-menu" ref={dropdownRef}>
          <button className="navbar-user-button" onClick={toggleDropdown}>
            {user.username || 'User'}
            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></span>
          </button>
          {isDropdownOpen && (
            <div className="navbar-dropdown">
              <a href="#" onClick={() => { /* Profile page logic here */ setIsDropdownOpen(false); }}>Profile Page</a>
              <div className="dropdown-divider"></div>
              <a href="#" onClick={handleLogoutClick}>Logout</a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
