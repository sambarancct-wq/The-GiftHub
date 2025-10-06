import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import GiftAddPage from './pages/GiftAddPage';
import Navbar from './components/Navbar';
import { useState } from 'react';
import type { AuthResponse } from './types';

// Main App Component
function App() {
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);

  const handleLoginSuccess = (userData: AuthResponse) => setCurrentUser(userData);
  const handleLogout = () => setCurrentUser(null);

  return (
    <Router>
      <AppContent currentUser={currentUser} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
    </Router>
  );
}

//AppContent uses useLocation() (must be inside Router)
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
        <Route path="/" element={<LandingPage user={currentUser} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
        <Route path="/gift/add" element={<GiftAddPage />} />
        <Route path="/event/add" element={<div>Add Event Page</div>} />
        <Route path="/gift/list" element={<div>Gift List Page</div>} />
        <Route path="/event/list" element={<div>Event List Page</div>} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
