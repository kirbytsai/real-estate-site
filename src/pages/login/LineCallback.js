import React, { useEffect, useState } from 'react';

const LineCallback = () => {
  const [status, setStatus] = useState('處理中...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        setStatus('登入失敗：未收到授權碼');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }

      try {
        // const response = await fetch('http://localhost:5000/api/auth/line/callback', {
          const response = await fetch('/api/auth/line/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        });

        if (!response.ok) throw new Error('登入處理失敗');

        const { token } = await response.json();
        localStorage.setItem('token', token);
        window.location.href = '/';
        
      } catch (error) {
        setStatus('登入失敗：' + error.message);
        setTimeout(() => window.location.href = '/login', 2000);
      }
    };

    handleCallback();
  }, []);

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