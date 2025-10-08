// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For file uploads, we'll create a separate instance without Content-Type header
const apiMultipart = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Gift API calls
export const giftAPI = {
  getAllGifts: () => api.get('/gifts'),
  getGiftById: (id: number) => api.get(`/gifts/${id}`),
  addGift: (formData: FormData) => apiMultipart.post('/gifts', formData),
  updateGift: (id: number, formData: FormData) => apiMultipart.put(`/gifts/${id}`, formData),
  deleteGift: (id: number) => api.delete(`/gifts/${id}`),
};

// Auth API calls remain the same
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/login', credentials),
  register: (userData: { email: string; password: string }) => 
    api.post('/register', userData),
};

export default api;