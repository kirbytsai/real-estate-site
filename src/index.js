import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AOS from 'aos';
import 'aos/dist/aos.css'; // 引入 AOS 樣式

// 在 src/index.js 的頂部
import axios from 'axios';

// 創建一個集合來跟蹤已經處理過的授權碼
const processedAuthCodes = new Set();

// 設置請求超時
axios.defaults.timeout = 10000;

// 添加請求攔截器
axios.interceptors.request.use(
  config => {
    // 檢查是否是 LINE 回調請求
    if (config.url?.includes('/api/auth/line/callback') && config.method === 'post') {
      const authCode = config.data?.code;
      
      if (authCode && processedAuthCodes.has(authCode)) {
        // 取消重複的請求
        console.log('取消重複的授權碼請求:', authCode);
        return Promise.reject(new Error('授權碼已被處理，請勿重複使用'));
      }
      
      // 將授權碼添加到已處理集合
      if (authCode) {
        processedAuthCodes.add(authCode);
        console.log('記錄授權碼:', authCode);
        
        // 防止集合過大，5分鐘後移除
        setTimeout(() => {
          processedAuthCodes.delete(authCode);
          console.log('移除過期授權碼:', authCode);
        }, 5 * 60 * 1000);
      }
    }
    
    // 設置認證頭部
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // 對請求錯誤做些什麼
    return Promise.reject(error);
  }
);

// 添加響應攔截器
axios.interceptors.response.use(
  response => {
    // 對響應數據做點什麼
    return response;
  },
  error => {
    // 對響應錯誤做點什麼
    if (error.response?.status === 401) {
      console.log('Unauthorized request detected, token might be invalid');
      
      // 檢查是否是最近登入的(30秒內)
      const authTimestamp = localStorage.getItem('auth_timestamp');
      const isRecentAuth = authTimestamp && 
                        (Date.now() - parseInt(authTimestamp)) < 30000;
      
      // 檢查是否剛剛登出
      const justLoggedOut = localStorage.getItem('logged_out') === 'true';
      
      // 只有在不是最近登入的，且不是剛剛登出的情況下，才清除令牌並重定向
      if (!isRecentAuth && !justLoggedOut) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 如果不在登入相關頁面，則重定向到登入頁
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/auth')) {
          window.location.href = '/login';
        }
      } else {
        console.log('忽略未授權請求，因為用戶最近登入或登出');
      }
    }
    return Promise.reject(error);
  }
);

// 初始化 AOS
AOS.init({
  duration: 800, // 動畫持續時間
  easing: 'ease-out-cubic', // 緩動函數
  once: true, // 只觸發一次動畫
  offset: 50, // 觸發動畫的偏移距離
  delay: 100, // 延遲時間
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);