/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { authAPI } from "../services/api";
import type { RegistrationPageProps, RegisterData } from "../types";
import "../styles/AuthPage.css";

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<
    RegisterData & { confirmPassword: string }
  >({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      setTimeout(() => {
        onSwitchToLogin();
      }, 1000);
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Image Section */}
      <div className="auth-left"></div>

      {/* Right Form Section */}
      <div className="auth-right">
        <h2>
          <span className="hello-text">Join,</span> Us!
        </h2>

        <div className="auth-tabs">
          <span onClick={onSwitchToLogin}>Login</span>
          <span className="active">SignUp</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Enter your username"
            value={formData.name}
            onChange={handleChange}
            required
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
            src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png"
            alt="Facebook"
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
