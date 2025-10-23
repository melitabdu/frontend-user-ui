import axios from 'axios';

// ✅ Get base URL from environment or fallback to local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// 🧠 Debug: Log it once to confirm
console.log("🌐 Using API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Keep this if you’re using cookies or auth sessions
});

export default api;
