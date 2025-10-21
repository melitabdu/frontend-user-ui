import axios from './axios';

// ✅ Save token and user data to localStorage
export const saveAuthData = (data) => {
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  const user = {
    _id: data._id || data.user?._id,
    name: data.name || data.user?.name,
    phone: data.phone || data.user?.phone,
    role: data.role || data.user?.role || 'customer'
  };

  localStorage.setItem('user', JSON.stringify(user));
};

// ✅ Get stored user object
export const getLoggedInUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ✅ Get stored token
export const getToken = () => {
  return localStorage.getItem('token');
};

// ✅ Login API request
export const loginAPI = async (phone, password) => {
  const res = await axios.post('/auth/login', { phone, password });
  return res.data;
};

// ✅ Register API request
export const registerAPI = async (name, phone, password) => {
  const res = await axios.post('/auth/register', { name, phone, password });
  return res.data;
};

// ✅ Clear auth data from storage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Optional helper
export const isAuthenticated = () => {
  return !!getToken();
};
