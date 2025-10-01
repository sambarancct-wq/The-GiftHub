import React, { useState } from 'react';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import GiftAddPage from './pages/GiftAddPage';
import Navbar from './components/Navbar';
import type { AuthResponse } from './types';
import './App.css';

type Page = 'landing' | 'register' | 'login' | 'giftAdd' | 'eventAdd' | 'giftList' | 'eventList';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);

  const handleSwitchToRegister = () => setCurrentPage('register');
  const handleSwitchToLogin = () => setCurrentPage('login');
  const handleSwitchToGiftAdd = () => setCurrentPage('giftAdd');
  const handleSwitchToEventAdd = () => setCurrentPage('eventAdd');
  const handleSwitchToGiftList = () => setCurrentPage('giftList');
  const handleSwitchToEventList = () => setCurrentPage('eventList');
  const handleReturnToLanding = () => setCurrentPage('landing');

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
      case 'giftAdd':
        return <GiftAddPage onReturnToLanding={handleReturnToLanding} />;
      case 'eventAdd':
        return <div>Add Event Page. <button onClick={handleReturnToLanding}>Back</button></div>;
      case 'giftList':
        return <div>Gift List Page. <button onClick={handleReturnToLanding}>Back</button></div>;
      case 'eventList':
        return <div>Event List Page. <button onClick={handleReturnToLanding}>Back</button></div>;
      default:
        return (
          <LandingPage 
            user={currentUser}
          />
        );
    }
  };

  return (
    <div className="App">
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onNavigateToGiftAdd={handleSwitchToGiftAdd}
        onNavigateToEventAdd={handleSwitchToEventAdd}
        onNavigateToGiftList={handleSwitchToGiftList}
        onNavigateToEventList={handleSwitchToEventList}
        onNavigateToLanding={handleReturnToLanding}
        onNavigateToLogin={handleSwitchToLogin}       // <-- Pass the handler
        onNavigateToRegister={handleSwitchToRegister}  // <-- Pass the handler
      />
      {renderPage()}
    </div>
  );
}

export default App;
