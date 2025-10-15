import React from 'react';
import '../styles/ProfilePage.css';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" />
          ) : (
            <span className="profile-initial">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </span>
          )}
        </div>
        <div className="profile-info">
          <h2>{user.username || 'No Username'}</h2>
          <p><strong>Email:</strong> {user.email || 'No Email'}</p>
          <p><strong>User ID:</strong> {user.userId || 'N/A'}</p>
        </div>
        {/* Future actions */}
        <div className="profile-actions">
          <button className="profile-btn">Edit Profile</button>
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
