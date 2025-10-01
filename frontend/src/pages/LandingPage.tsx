import React from 'react';
import type { LandingPageProps } from '../types';
import '../styles/LandingPage.css';

const LandingPage: React.FC<LandingPageProps> = ({ user }) => {
  return (
    <div className="landing-container">
      <main className="landing-main">
        {/* --- HERO SECTION --- */}
        <section className="hero-section">
          <div className="hero-content">
            <h2>Simplify Your Gift Planning</h2>
            <p>Create, manage, and track gift lists for all your special occasions.</p>
            
            {!user && (
              <div className="cta-buttons">
                <p>Get started by using the navigation links above to create an account or log in.</p>
              </div>
            )}
            
            {user && (
              <div className="dashboard-preview">
                <h3>Ready to start planning?</h3>
                <div className="feature-cards">
                  <div className="feature-card">
                      <h4>Create Events</h4>
                  </div>
                  <div className="feature-card">
                      <h4>Manage Gifts</h4>  
                  </div>
                  <div className="feature-card">
                      <h4>Track Reservations</h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- EXPANDED FEATURES SECTION --- */}
        <section className="features-section">
          <h3>Why You'll Love It</h3>
          <div className="features-grid">
            
            <div className="feature-item">
              <div className="feature-text">
                <h4>Gift Management</h4>
                <p>Easily add, edit, and remove gifts from your registry with just a few clicks.</p>
              </div>
              <img 
                src="../src/assets/Gift.jpg" 
                alt="Gift Management Icon" 
                className="feature-image" 
              />
            </div>
            
            <div className="feature-item">
              <div className="feature-text">
                <h4>Event Categorization</h4>
                <p>Organize gifts by different events like birthdays, weddings, or holidays.</p>
              </div>
              <img 
                src="../src/assets/Events.jpg" 
                alt="Event Categorization Icon" 
                className="feature-image" 
              />
            </div>

            <div className="feature-item">
              <div className="feature-text">
                <h4>Reservation Tracking</h4>
                <p>Guests can mark gifts as reserved, preventing duplicate purchases.</p>
              </div>
              <img 
                src="../src/assets/reserved.png" 
                alt="Reservation Tracking Icon" 
                className="feature-image" 
              />
            </div>

            <div className="feature-item">
              <div className="feature-text">
                <h4>Shareable Links</h4>
                <p>Generate a unique link for each event list to share with friends and family.</p>
              </div>
              <img 
                src="../src/assets/share.png" 
                alt="Shareable Links Icon" 
                className="feature-image" 
              />
            </div>
            
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2024 Gift Planner</p>
      </footer>
    </div>
  );
};

export default LandingPage;