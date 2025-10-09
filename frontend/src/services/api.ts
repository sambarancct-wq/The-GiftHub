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
  getGiftsByEvent: (eventId: number) => api.get(`/gifts/event/${eventId}`),
  addGift: (formData: FormData) => apiMultipart.post('/gifts', formData),
  updateGift: (id: number, formData: FormData) => apiMultipart.put(`/gifts/${id}`, formData),
  deleteGift: (id: number) => api.delete(`/gifts/${id}`),
  reserveGift: (id: number, userId: number) => 
    api.put(`/gifts/${id}/reserve`, { userId }),
  purchaseGift: (id: number) => api.put(`/gifts/${id}/purchase`),
};

// Auth API calls remain the same
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/login', credentials),
  register: (userData: { username: string; email: string; password: string }) => // UPDATED
    api.post('/register', userData), 
  upgradeToOrganizer: (userId: number) => 
    api.put(`/users/${userId}/upgrade-to-organizer`),
};

export const eventAPI = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createEvent: (eventData: any, organizerId: number) => 
    api.post(`/events?organizerId=${organizerId}`, eventData),
  
  getEventsByOrganizer: (organizerId: number) => 
    api.get(`/events/organizer/${organizerId}`),
  
  getAllPublicEvents: () => api.get('/events/public'),
  
  getEventById: (id: number) => api.get(`/events/${id}`),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEvent: (id: number, eventData: any) => api.put(`/events/${id}`, eventData),
  
  deleteEvent: (id: number) => api.delete(`/events/${id}`),
};


export default api;