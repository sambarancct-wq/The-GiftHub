import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import { type JSX } from 'react';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import ProfilePage from './components/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';

// NEW COMPONENT IMPORTS
import EventDashboard from './pages/EventDashboard';
import FindEventPage from './pages/FindEventPage';
import RSVPResponsePage from './pages/RSVPResponsePage';
import EventGiftsPage from './pages/EventGiftsPage';
import EditProfilePage from './pages/EditProfilePage';

function getStoredUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user: contextUser } = useAuth();
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
  const hideNavbarOn = ['/login', '/register', '/rsvp'];
  const showNavbar = !hideNavbarOn.some(path => location.pathname.startsWith(path));

  const { user, login } = useAuth();
  console.log("AppContent user:", user);

  return (
    <>
      {showNavbar && <Navbar />}
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
            : <LoginPage onLoginSuccess={
              (authResponse) => login(authResponse.user)
            } />
          } 
        />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />        
        <Route path="/search-event" element={<FindEventPage />} />
        <Route path="/rsvp/:rsvpId/respond/:response" element={<RSVPResponsePage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/create-event" 
          element={
            <ProtectedRoute>
              <CreateEventPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-events" 
          element={
            <ProtectedRoute>
              <MyEventsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/:eventId" 
          element={
            <ProtectedRoute>
              <EventDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/event/:eventId/gifts" 
          element={
            <ProtectedRoute>
              <EventGiftsPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path='/profile'
          element={<ProfilePage/>}
        />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
      </Routes>
    </>
  );
}

export default App;