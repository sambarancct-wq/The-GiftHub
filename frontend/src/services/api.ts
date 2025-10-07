// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to false to avoid session issues
});

// Auth API calls
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/login', credentials),
  
  register: (userData: { email: string; password: string }) => 
    api.post('/register', userData),
};

// Gift API calls
export const giftAPI = {
  getAllGifts: () => api.get('/gifts'),
  getGiftById: (id: number) => api.get(`/gifts/${id}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addGift: (giftData: any) => api.post('/gifts', giftData),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateGift: (id: number, giftData: any) => api.put(`/gifts/${id}`, giftData),
  deleteGift: (id: number) => api.delete(`/gifts/${id}`),
};

export default api;