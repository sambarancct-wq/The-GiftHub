/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { authAPI } from '../services/api';
import type { LoginPageProps, LoginCredentials } from '../types';
import '../styles/AuthPage.css';

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      setMessage('Login successful!');
      setIsError(false);
      
      setTimeout(() => {
        onLoginSuccess(response.data);
      }, 1000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <p className="switch-auth">
          Don't have an account?{' '}
          <span className="auth-link" onClick={onSwitchToRegister}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;