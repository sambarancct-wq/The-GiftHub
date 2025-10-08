// src/types/index.ts

// 🧑‍💻 Basic User-related types
export interface User {
  id: number;
  username: string; // ADDED: Required field
  email: string;
  password: string;
  isOrganizer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gifts: any;
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
  username: string; // ADDED: Required field
  email: string;
  password: string;
}

// 🪪 Auth responses and error handling
export interface AuthResponse {
  username: string;
  message: string;
  userId?: number;
  email?: string;
  isOrganizer?: boolean;
}

export interface ApiError {
  message: string;
}

// 🧩 Props interfaces for pages & components
export interface LoginPageProps {
  onLoginSuccess: (userData: AuthResponse) => void;
}

export interface LandingPageProps {
  user: AuthResponse | null;
}

export interface NavbarProps {
  user: AuthResponse | null;
  onLogout: () => void;
}