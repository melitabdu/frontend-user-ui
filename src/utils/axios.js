// src/utils/axios.js
import axios from 'axios';

// Use VITE_API_BASE_URL for both local and production
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api', // Add /api if your backend routes are prefixed with /api
  withCredentials: true,
});

export default axiosInstance;
