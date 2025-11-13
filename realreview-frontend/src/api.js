import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Images API (matching your backend endpoints)
export const photosAPI = {
  uploadPhoto: (formData) => {
    return api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAllPhotos: () => api.get('/images/approved'),
  getPhotoById: (filename) => api.get(`/images/${filename}`),
  getMyPhotos: () => api.get('/images/my'),
  deletePhoto: (id) => api.delete(`/images/${id}`),
  getPhotoImage: (filename) => `${API_BASE_URL}/images/${filename}`,
};

// Ratings API
export const ratingsAPI = {
  ratePhoto: (photoId, rating, comment) =>
    api.post(`/images/${photoId}/rate`, { rating, comment }),
  getPhotoRatings: (photoId) => api.get(`/images/${photoId}/ratings`),
};

// Admin API
export const adminAPI = {
  getPendingPhotos: () => api.get('/admin/pending'),
  approvePhoto: (photoId) => api.post(`/admin/approve/${photoId}`),
  rejectPhoto: (photoId) => api.post(`/admin/reject/${photoId}`),
};

export default api;