// src/pages/RegistrationPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import type { RegisterData } from "../types";
import "../styles/AuthPage.css";

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData & { 
    confirmPassword: string; 
    isOrganizer: boolean;
  }>({
    username: "", // ADDED: Username field
    email: "",
    password: "",
    confirmPassword: "",
    isOrganizer: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      if (formData.isOrganizer) {
        // Register as organizer
        await authAPI.registerOrganizer(userData);
        alert("🎉 Organizer account created successfully! You can now create events and manage gift registries.");
      } else {
        // Register as regular user
        await authAPI.register(userData);
        alert("✅ Account created successfully! You can now browse events and reserve gifts.");
      }

      setTimeout(() => navigate("/login"), 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left"></div>

      <div className="auth-right">
        <h2>
          <span className="hello-text">Join,</span> Us!
        </h2>

        <div className="auth-tabs">
          <Link to="/login" className="inactive-tab">Login</Link>
          <span className="active">SignUp</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* ADDED: Username field */}
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-input">
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <span className="eye-icon">👁</span>
          </div>

          <div className="password-input">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span className="eye-icon">👁</span>
          </div>

          {/* Organizer Selection */}
          <div className="organizer-selection">
            <label className="organizer-toggle">
              <input
                type="checkbox"
                name="isOrganizer"
                checked={formData.isOrganizer}
                onChange={handleChange}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                Register as Event Organizer
              </span>
            </label>
            
            {formData.isOrganizer && (
              <div className="organizer-info">
                <p>🎉 As an organizer, you can:</p>
                <ul>
                  <li>Create and manage events</li>
                  <li>Build gift registries</li>
                  <li>Track gift reservations</li>
                  <li>Manage multiple events</li>
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="or-text">Or</p>

        <div className="social-login">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="Google"
          />
          <img
            src="https://cdn-icons-png/flaticon.com/512/5968/5968764.png"
            alt="Facebook"
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;