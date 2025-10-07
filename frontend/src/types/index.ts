// src/types/index.ts

// 🧑‍💻 Basic User-related types
export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  organizer: User;
  description: string;
  location?: string;
  type: 'BIRTHDAY' | 'WEDDING' | 'HOLIDAY' | 'ANNIVERSARY' | 'OTHER';
  createdAt: string;
  updatedAt: string;
}


export interface Gift {
  id: number;
  name: string;
  recipient: string;
  notes?: string;
  price: number;
  image?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'PURCHASED';
  event?: Event;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

// 🪪 Auth responses and error handling
export interface AuthResponse {
  message: string;
  userId?: number;
  username?: string;
  email?: string;
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
