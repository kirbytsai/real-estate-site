// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化時載入用戶信息
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        console.log('Loading auth state from localStorage:', { 
          hasToken: !!token, 
          hasUser: !!userStr 
        });

        if (token && userStr) {
          // 設置 axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          console.log('User authenticated from localStorage:', user);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromLocalStorage();
  }, []);

  // 登入函數
  const loginWithLineToken = (token, user) => {
    console.log('Logging in with token and user:', { token: !!token, user });
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // 設置 axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setCurrentUser(user);
  };

  // 登出函數
  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    setError,
    loginWithLineToken,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);