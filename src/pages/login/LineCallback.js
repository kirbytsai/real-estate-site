// src/pages/login/LineCallback.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const LineCallback = () => {
  const [status, setStatus] = useState('處理中...');
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithLineToken } = useAuth();
  const processedCodeRef = useRef(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      // 解析URL參數
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      // 檢查錯誤參數
      if (error) {
        setStatus(`登入失敗：${errorDescription || error}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      // 檢查是否有授權碼
      if (!code) {
        setStatus('登入失敗：未收到授權碼');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      // 防止重複處理同一個授權碼
      if (processedCodeRef.current === code) {
        console.log('已處理過此授權碼，忽略重複請求');
        return;
      }
      
      // 標記此授權碼為已處理
      processedCodeRef.current = code;
      
      try {
        setStatus('正在處理LINE授權...');
        
        // 向後端發送請求
        const response = await axios.post('/api/auth/line/callback', { code });
        
        // 登入成功，設置認證信息
        loginWithLineToken(response.data.token, response.data.user);
        
        setStatus('登入成功！正在重定向...');
        
        // 使用 replace 而不是 push 進行導航，防止歷史堆棧問題
        navigate('/', { replace: true });
        
      } catch (error) {
        console.error('LINE login error:', error);
        
        // 處理特定錯誤
        if (error.response?.data?.error === 'invalid_grant') {
          setStatus('授權碼已失效，請重新登入');
        } else {
          setStatus(`登入失敗：${error.response?.data?.message || error.message}`);
        }
        
        // 導航回登入頁面
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
    
    // 組件卸載時的清理函數
    return () => {
      // 可以在這裡添加任何需要的清理邏輯
    };
  }, [location.search, navigate, loginWithLineToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          {status.includes('成功') ? (
            <svg className="w-full h-full text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : status.includes('失敗') ? (
            <svg className="w-full h-full text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          )}
        </div>
        <h2 className="text-2xl font-semibold mb-2">LINE 登入</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default LineCallback;