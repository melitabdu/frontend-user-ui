import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  saveAuthData,
  clearAuthData,
  getLoggedInUser,
  getToken,
  loginAPI,
  registerAPI,
} from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getLoggedInUser());
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const storedUser = getLoggedInUser();
    const storedToken = getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const loginUser = async ({ phone, password }) => {
    const data = await loginAPI(phone, password);
    saveAuthData(data); // ✅ important
    setUser(data.user || { name: data.name, phone: data.phone });
    setToken(data.token);
    return data;
  };

  const registerUser = async ({ name, phone, password }) => {
    const data = await registerAPI(name, phone, password);
    saveAuthData(data); // ✅ important
    setUser(data.user || { name: data.name, phone: data.phone });
    setToken(data.token);
    return data;
  };

  const logoutUser = () => {
    clearAuthData();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        registerUser,
        logoutUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
