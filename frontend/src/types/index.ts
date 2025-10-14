export interface User {
  userId: number;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// Event type
export interface Event {
  gifts: Gift[];
  id: number;
  name: string;
  date: string;
  creator?:User;
  creatorId:number;
  creatorUsername:string;
  event_key:string;
  description: string;
  location?: string;
  type: 'BIRTHDAY' | 'WEDDING' | 'HOLIDAY' | 'ANNIVERSARY' | 'OTHER';
  createdAt: string;
  updatedAt: string;
}

// Gift type
export interface Gift {
  id: number;
  name: string;
  recipient: string;
  notes?: string;
  price: number;
  image?: string;
  description?: string;
  reservedBy?: User;
  status: 'PLANNED' | 'PURCHASED' | 'CANCELLED';
  event?: Event;
  createdAt: string;
  updatedAt: string;
}

// Login credentials (used for login form)
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data (used for register form)
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// 🪪 Auth responses and error handling
export interface AuthResponse {
  user: User;
  message: string;
  token?: string; // Optional: add if you use JWT or session token
}

// Generic API error type
export interface ApiError {
  message: string;
}

// 🧩 Props interfaces for legacy pages/components (usage discouraged in new code)
export interface LoginPageProps {
  // Called on successful authentication, passes the whole AuthResponse
  onLoginSuccess: (data: AuthResponse) => void;
}