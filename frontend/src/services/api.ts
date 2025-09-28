// src/services/api.ts
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (userData: RegisterData): Promise<{ data: AuthResponse }> => 
    api.post('/users', userData),
  
  login: (credentials: LoginCredentials): Promise<{ data: AuthResponse }> => 
    api.post('/login', credentials),
};

export default api;