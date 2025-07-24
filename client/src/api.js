import axios from 'axios';

// Centralized API instance for all backend calls
const API = axios.create({
 baseURL: process.env.NODE_ENV === 'production' 
   ? 'https://startradersindia.in/api'
   : 'http://localhost:3000/api',
 withCredentials: true,
 timeout: 10000,
 headers: {
   'Content-Type': 'application/json',
   'Accept': 'application/json'
 }
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
