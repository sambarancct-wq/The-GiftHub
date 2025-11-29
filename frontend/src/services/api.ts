import axios from 'axios';

// CHANGE THIS BLOCK
// -----------------------------------------------------------------------------
// If VITE_API_URL is set (in Render), use it. Otherwise, use localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// -----------------------------------------------------------------------------

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For file uploads
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

// Auth API calls
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/login', credentials),
  register: (userData: { username: string; email: string; password: string }) => 
    api.post('/register', userData), 
  upgradeToOrganizer: (userId: number) => 
    api.put(`/users/${userId}/upgrade-to-organizer`),
};

export const userAPI = {
  getProfile: (userId: number) => api.get(`/users/${userId}`),
  editProfile: (userId: number, profileData: {
    name?: string,
    location?: string,
    image?: string,
    socialLinks?: { [key: string]: string }
  }) => api.put(`/users/${userId}/edit`, profileData),
};

export const eventAPI = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createEvent: (eventData: any, creatorId: number) => 
    api.post(`/events?creatorId=${creatorId}`, eventData),
   
  getEventsByCreator: (creatorId: number) =>{
    if (!creatorId || creatorId <= 0) {
      throw new Error('Invalid creator ID');
    }
    return api.get(`/events/creator/${creatorId}`);
  },

  getAllPublicEvents: () => api.get('/events/public'),
   
  getEventById: (id: number) => api.get(`/events/${id}`),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEvent: (id: number, eventData: any) => api.put(`/events/${id}`, eventData),
   
  deleteEvent: (id: number) => api.delete(`/events/${id}`),

  getRSVPStats: (eventId: number, creatorId: number) => {
    if (!creatorId || creatorId <= 0) {
      throw new Error('Invalid creator ID');
    }
    return api.get(`/events/dashboard/${eventId}?creatorId=${creatorId}`);
  },
};

export default api;
