// src/App.tsx
import React, { useState } from 'react';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import type { AuthResponse } from './types';
import './App.css';

type Page = 'landing' | 'register' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = (userData: AuthResponse) => {
    setCurrentUser(userData);
    setCurrentPage('landing');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <RegistrationPage onSwitchToLogin={handleSwitchToLogin} />;
      case 'login':
        return (
          <LoginPage 
            onSwitchToRegister={handleSwitchToRegister}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      default:
        return (
          <LandingPage 
            user={currentUser} 
            onLogout={handleLogout}
            onNavigateToLogin={handleSwitchToLogin}
            onNavigateToRegister={handleSwitchToRegister}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;