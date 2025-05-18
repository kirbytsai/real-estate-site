// src/pages/login/LineCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const LineCallback = () => {
  const [status, setStatus] = useState('處理中...');
  const navigate = useNavigate();
  const { loginWithLineToken, setError } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (error) {
        setStatus(`登入失敗：${errorDescription || error}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      if (!code) {
        setStatus('登入失敗：未收到授權碼');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // 使用完整 URL
        const apiUrl = `/api/auth/line/callback`;
        
        const response = await axios.post(apiUrl, { code });
        
        // 使用 AuthContext 登入函數
        loginWithLineToken(response.data.token, response.data.user);
        
        setStatus('登入成功！正在重定向...');
        setTimeout(() => navigate('/'), 1000);
        
      } catch (error) {
        console.error('LINE callback error:', error);
        setError(error.response?.data?.message || error.message);
        setStatus('登入失敗：' + (error.response?.data?.message || error.message));
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate, loginWithLineToken, setError]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default LineCallback;