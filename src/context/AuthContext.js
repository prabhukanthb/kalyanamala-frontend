import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE = 'https://kalyanamala-backend-production.up.railway.app';

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [token,setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated,setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const savedToken = localStorage.getItem('token');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        });

        setToken(savedToken);
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth load error:', error);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (emailOrPhone, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, {
      emailOrPhone,
      password
    });

    const { token: newToken, user: loggedInUser } = res.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    setIsAuthenticated(true);

    return res.data;
  };

  const register = async (formData) => {
    const res = await axios.post(`${API_BASE}/api/auth/register`, formData);

    const { token: newToken, user: registeredUser } = res.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(registeredUser);
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
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        setUser,
        setToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
