import React from 'react';
import '../styles/ProfilePage.css';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const socialIcons: { [key: string]: React.ReactNode } = {
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  linkedin: <FaLinkedin />
};

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.image ? (
            <img src={user.image} alt="Avatar" />
          ) : (
            <span className="profile-initial">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </span>
          )}
        </div>
        <div className="profile-info">
          <h2>{user.username || 'No Username'}</h2>
          <p><strong>Name:</strong> {user.name || '-'}</p>
          <p><strong>Email:</strong> {user.email || '-'}</p>
          <p><strong>User ID:</strong> {user.userId || 'N/A'}</p>
          <p><strong>Location:</strong> {user.location || '-'}</p>
          {/* Social links, only shown if present */}
          <div className="profile-social">
            {user.socialLinks && Object.entries(user.socialLinks).map(([platform, url]) =>
              (typeof url === 'string' && url.trim()) ? (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={platform}>
                  {socialIcons[platform]}
                </a>
              ) : null
            )}
          </div>
        </div>
        <div className="profile-actions">
          <Link to='/edit-profile' className="profile-btn">
            Edit Profile
          </Link>
          <button className="profile-btn logout-btn" onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
