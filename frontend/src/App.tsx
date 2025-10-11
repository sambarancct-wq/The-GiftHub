import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import GiftAddPage from './pages/GiftAddPage';
import Navbar from './components/Navbar';
import { type JSX } from 'react';
import GiftListPage from './pages/GiftListPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import { AuthProvider,useAuth } from './context/AuthContext';

function getStoredUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user:contextUser } = useAuth();
  const user = contextUser || getStoredUser();
  return user ? children : <Navigate to='/login'/>;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent/>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbarOn = ['/login', '/register'];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  const { user,login } = useAuth();
  console.log("AppContent user:", user);

  return (
    <>
      {showNavbar && <Navbar/>}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/register" 
          element={
            user ? <Navigate to="/" /> : <RegistrationPage />
        } 
        />
        <Route 
          path="/login" 
          element={
          user ? <Navigate to="/" /> 
          : <LoginPage onLoginSuccess={(authResponse) => login(authResponse.user)}/>} 
        />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/gifts" 
          element={
          <ProtectedRoute>
            <GiftListPage />
          </ProtectedRoute>
        } />
        <Route 
          path="/create-event" 
          element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } />
        <Route 
          path="/my-events" 
          element={
          <ProtectedRoute>
            <MyEventsPage />
          </ProtectedRoute>
        } />
        <Route path="/add-gift" element={
          <ProtectedRoute>
            <GiftAddPage />
          </ProtectedRoute>
        } />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;