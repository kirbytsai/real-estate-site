import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LineCallback = () => {
  const [status, setStatus] = useState('處理中...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      // const state = urlParams.get('state');
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

      // 驗證狀態 (可選)
      // const savedState = localStorage.getItem('line_login_state');
      localStorage.removeItem('line_login_state');
      
      try {
        console.log('Authorization code received:', code);
        
        // 使用完整 URL
        const apiUrl = `${window.location.origin}/api/auth/line/callback`;
        console.log('Calling API at:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API response error:', errorText);
          throw new Error(`登入處理失敗 (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Login successful, received data:', data);
        
        // 儲存 token 和使用者資訊
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setStatus('登入成功！正在重定向...');
        setTimeout(() => navigate('/'), 1000);
        
      } catch (error) {
        console.error('LINE callback error:', error);
        setStatus('登入失敗：' + error.message);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* 載入動畫 */}
        <div className="w-8 h-8 mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default LineCallback;