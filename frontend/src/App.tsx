import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import GiftAddPage from './pages/GiftAddPage';
import Navbar from './components/Navbar';
import { useState } from 'react';
import type { AuthResponse } from './types';
import GiftListPage from './pages/GiftListPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';

// Main App Component
function App() {
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(() => {
    // Check if user data exists in localStorage on app start
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData: AuthResponse) => {
    setCurrentUser(userData);
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    // Remove user data from localStorage
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <AppContent 
        currentUser={currentUser} 
        onLoginSuccess={handleLoginSuccess} 
        onLogout={handleLogout} 
      />
    </Router>
  );
}

// AppContent uses useLocation() (must be inside Router)
function AppContent({
  currentUser,
  onLoginSuccess,
  onLogout,
}: {
  currentUser: AuthResponse | null;
  onLoginSuccess: (userData: AuthResponse) => void;
  onLogout: () => void;
}) {
  const location = useLocation();
  const hideNavbarOn = ['/login', '/register'];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar user={currentUser} onLogout={onLogout} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage user={currentUser} />} />
        <Route path="/register" element={
          currentUser ? <Navigate to="/" /> : <RegistrationPage />
        } />
        <Route path="/login" element={
          currentUser ? <Navigate to="/" /> : <LoginPage onLoginSuccess={onLoginSuccess} />
        } />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/gifts" element={
          currentUser ? <GiftListPage /> : <Navigate to="/login" />
        } />
        
        {/* Organizer Only Routes */}
        <Route path="/create-event" element={
          <CreateEventPage />
        } />
        <Route path="/my-events" element={
          <MyEventsPage />
        } />
        <Route path="/add-gift" element={
          <GiftAddPage />
        } />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;