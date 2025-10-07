import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // keep false unless you use sessions
});

// 🔹 Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/login', credentials, {
      headers: { 'Content-Type': 'application/json' },
    }),

  register: (userData: { email: string; password: string }) =>
    api.post('/register', userData, {
      headers: { 'Content-Type': 'application/json' },
    }),
};

// 🔹 Gift API
export const giftAPI = {
  getAllGifts: () => api.get('/gifts'),
  getGiftById: (id: number) => api.get(`/gifts/${id}`),

  // 🔹 FormData (multipart/form-data)
  addGift: (formData: FormData) =>
    api.post('/gifts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateGift: (id: number, formData: FormData) =>
    api.put(`/gifts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteGift: (id: number) => api.delete(`/gifts/${id}`),
};

export default api;
