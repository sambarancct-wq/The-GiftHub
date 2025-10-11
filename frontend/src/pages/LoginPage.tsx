// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import type { LoginPageProps, LoginCredentials } from "../types";
import "../styles/AuthPage.css";
//import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginCredentials>({ 
    email: "", 
    password: "" 
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  //const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      onLoginSuccess(response.data);
      const userJson = JSON.stringify(response.data);
      localStorage.setItem('user', userJson);
      console.log(userJson);
      navigate("/"); // Redirect after login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left"></div>

      <div className="auth-right">
        <h2>
          <span className="hello-text">Hello,</span> Guyss!
        </h2>

        <div className="auth-tabs">
          <span className="active">Login</span>
          <Link to="/register" className="inactive-tab">Signup</Link>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            />
            <span className="eye-icon">👁</span>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="or-text">Or</p>

        <div className="social-login">
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
          <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;