// src/utils/axios.js
import axios from 'axios';

// ✅ Use environment variable for flexibility
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Required for sending cookies/sessions
});

export default axiosInstance;
