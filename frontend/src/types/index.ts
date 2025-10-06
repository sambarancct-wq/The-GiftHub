// src/types/index.ts

// 🧑‍💻 Basic User-related types
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

// 🪪 Auth responses and error handling
export interface AuthResponse {
  message: string;
  userId?: number;
  username?: string;
}

export interface ApiError {
  message: string;
}

// 🧩 Props interfaces for pages & components

// ✅ Registration Page
// No need for navigation props anymore (React Router handles it)
//export interface RegistrationPageProps {}

// ✅ Login Page
export interface LoginPageProps {
  onLoginSuccess: (userData: AuthResponse) => void;
}

// ✅ Landing Page
export interface LandingPageProps {
  user: AuthResponse | null;
}

// ✅ Navbar Component
export interface NavbarProps {
  user: AuthResponse | null;
  onLogout: () => void;
}
