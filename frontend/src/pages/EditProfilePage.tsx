import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import '../styles/EditProfilePage.css';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const initialState = {
  name: '',
  location: '',
  image: '',
  socialLinks: {
    twitter: '',
    instagram: '',
    facebook: '',
    linkedin: '',
  },
};

const EditProfilePage: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Optionally fetch user's current profile info
    userAPI.getProfile(user.userId)
      .then(res => {
        const data = res.data;
        setFormData({
          name: data.name || '',
          location: data.location || '',
          image: data.image || '',
          socialLinks: {
            twitter: data.socialLinks?.twitter || '',
            instagram: data.socialLinks?.instagram || '',
            facebook: data.socialLinks?.facebook || '',
            linkedin: data.socialLinks?.linkedin || '',
          }
        });
      })
      .catch(() => {/* optional error UI */});
  }, []);

  // Handle simple field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle social link change
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await userAPI.editProfile(user.userId, {
        ...formData,
        socialLinks: formData.socialLinks,
      });
      setMessage('Profile updated successfully!');
      setSaving(false);
      // Optionally update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("Error",err);
      setMessage('Failed to update profile.');
      setSaving(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="edit-profile-columns">
            {/* LEFT COLUMN */}
            <div className="profile-column">
            <label>Name</label>
            <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Display name"
            />

            <label>Location</label>
            <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
            />

            <label>Profile Image URL</label>
            <input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="Paste image link (jpg/png)"
            />

            {formData.image && (
                <img
                src={formData.image}
                alt="Profile Preview"
                className="edit-profile-avatar"
                />
            )}
            </div>
            {/* RIGHT COLUMN */}
            <div className="profile-column">
            <label>Twitter</label>
            <input
                name="twitter"
                type="url"
                value={formData.socialLinks.twitter}
                onChange={handleSocialChange}
                placeholder="Twitter profile link"
            />

            <label>Instagram</label>
            <input
                name="instagram"
                type="url"
                value={formData.socialLinks.instagram}
                onChange={handleSocialChange}
                placeholder="Instagram profile link"
            />

            <label>Facebook</label>
            <input
                name="facebook"
                type="url"
                value={formData.socialLinks.facebook}
                onChange={handleSocialChange}
                placeholder="Facebook profile link"
            />

            <label>LinkedIn</label>
            <input
                name="linkedin"
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={handleSocialChange}
                placeholder="LinkedIn profile link"
            />
            </div>
        </div>
        <button type="submit" className="edit-profile-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
        </button>
        </form>
        {message && <div className="edit-profile-message">{message}</div>}
      </div>
    </div>
  );
};

export default EditProfilePage;
