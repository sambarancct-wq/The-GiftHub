// src/pages/LandingPage.tsx
import React from 'react';
import type { LandingPageProps } from '../types';
import '../styles/LandingPage.css';

const LandingPage: React.FC<LandingPageProps> = ({ 
  user, 
  onLogout, 
  onNavigateToLogin, 
  onNavigateToRegister 
}) => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="header-content">
          <h1>Gift Registry</h1>
          <nav className="nav-menu">
            {user ? (
              <div className="user-menu">
                <span>Welcome, {user.username}!</span>
                <button onClick={onLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-menu">
                <button onClick={onNavigateToLogin} className="auth-btn login-btn">Login</button>
                <button onClick={onNavigateToRegister} className="auth-btn register-btn">Register</button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Simplify Your Gift Planning</h2>
            <p>Create, manage, and track gift lists for all your special occasions</p>
            
            {!user && (
              <div className="cta-buttons">
                <p>Get started by creating an account or logging in</p>
              </div>
            )}
            
            {user && (
              <div className="dashboard-preview">
                <h3>Ready to start planning?</h3>
                <div className="feature-cards">
                  <div className="feature-card">
                    <h4>Create Events</h4>
                    <p>Organize gifts by occasions like birthdays, weddings, and festivals</p>
                  </div>
                  <div className="feature-card">
                    <h4>Manage Gifts</h4>
                    <p>Add gift details, prices, and links to your registry</p>
                  </div>
                  <div className="feature-card">
                    <h4>Track Reservations</h4>
                    <p>Mark gifts as reserved or purchased</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="features-section">
          <h3>Key Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <h4>🎁 Gift Management</h4>
              <p>Easily add, edit, and remove gifts from your registry</p>
            </div>
            <div className="feature-item">
              <h4>📅 Event Categorization</h4>
              <p>Organize gifts by different events and occasions</p>
            </div>
            <div className="feature-item">
              <h4>✅ Reservation Tracking</h4>
              <p>Keep track of which gifts have been reserved or purchased</p>
            </div>
            <div className="feature-item">
              <h4>📱 User-Friendly Dashboard</h4>
              <p>Clean and intuitive interface for easy navigation</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2024 GiftHub</p>
      </footer>
    </div>
  );
};

export default LandingPage;