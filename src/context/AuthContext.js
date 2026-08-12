import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [token,setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated,setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        logout();
      }
    };

    loadUser();
  }, [token]);

  const register = async (formData) => {
    const res = await axios.post(`${API_BASE}/api/auth/register`, formData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  };

  const login = async (emailOrPhone, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, { emailOrPhone, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
