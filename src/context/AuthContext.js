// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化時檢查本地存儲的令牌
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const authTimestamp = localStorage.getItem('auth_timestamp');
        const justLoggedOut = localStorage.getItem('logged_out') === 'true';
        
        // 檢查是否是最近設置的令牌 (30秒內)
        const isRecentAuth = authTimestamp && 
                          (Date.now() - parseInt(authTimestamp)) < 30000;
        
        console.log('Auth init status:', { 
          hasToken: !!token, 
          isRecentAuth, 
          justLoggedOut 
        });
        
        if (token && userStr && !justLoggedOut) {
          try {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            
            // 設置 axios 默認頭部
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Restored authentication from localStorage');
            
            // 如果是最近設置的令牌，跳過驗證
            if (!isRecentAuth) {
              try {
                const response = await axios.get('/api/user');
                console.log('Token validation successful:', response.data);
              } catch (validationError) {
                console.error('Token validation failed:', validationError);
                // 如果請求失敗，token 可能無效，需要重新登入
                if (validationError.response?.status === 401) {
                  console.log('Clearing invalid authentication');
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  localStorage.removeItem('auth_timestamp');
                  delete axios.defaults.headers.common['Authorization'];
                  setCurrentUser(null);
                  setError('您的登入已過期，請重新登入');
                }
              }
            } else {
              console.log('Skipping token validation for recent authentication');
            }
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth_timestamp');
          }
        } else if (justLoggedOut) {
          console.log('User recently logged out, skipping auto-login');
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_timestamp');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登入函數
  const loginWithLineToken = (token, user) => {
    try {
      console.log('Setting up authentication with token and user');
      
      // 清除可能存在的登出標記
      localStorage.removeItem('logged_out');
      
      // 先設置 axios 頭部
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 保存到 localStorage，添加時間戳記
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_timestamp', Date.now().toString());
      
      // 最後更新狀態
      setCurrentUser(user);
      setError(null);
      console.log('Authentication setup complete with timestamp');
    } catch (error) {
      console.error('Error during login:', error);
      setError('登入時出現問題');
    }
  };

  // 登出函數
  const logout = () => {
    console.log('Logging out user');
    
    // 清除認證數據
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_timestamp');
    delete axios.defaults.headers.common['Authorization'];
    
    // 設置登出標記
    localStorage.setItem('logged_out', 'true');
    
    // 5分鐘後清除登出標記
    setTimeout(() => {
      localStorage.removeItem('logged_out');
      console.log('Removed logout marker');
    }, 5 * 60 * 1000);
    
    // 更新狀態
    setCurrentUser(null);
    setError(null);
  };

  // 上下文值
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