// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('🌐 Auth API Base URL:', API_BASE_URL);

// ✅ Register user
export const registerUser = async ({ name, phone, password }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      name,
      phone,
      password,
    });
    return res.data;
  } catch (err) {
    console.error('❌ Register error:', err.response || err);
    throw err.response?.data || { message: 'Registration failed' };
  }
};

// ✅ Login user
export const loginUser = async ({ phone, password }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      phone,
      password,
    });
    return res.data;
  } catch (err) {
    console.error('❌ Login error:', err.response || err);
    throw err.response?.data || { message: 'Login failed' };
  }
};
