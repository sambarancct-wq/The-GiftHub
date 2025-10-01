// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId?: number;
  username?: string;
}

export interface ApiError {
  message: string;
}

// Props interfaces for components
export interface RegistrationPageProps {
  onSwitchToLogin: () => void;
}

export interface LoginPageProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (userData: AuthResponse) => void;
}

export interface LandingPageProps {
  user: AuthResponse | null;
  // Removed props: onLogout, onNavigateToLogin, onNavigateToRegister
  // Navigation is now handled by the Navbar
}