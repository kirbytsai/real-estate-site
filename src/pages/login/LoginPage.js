import React from 'react';

const LoginPage = () => {
  const handleLineLogin = () => {
    // 在生產環境中使用完整的網站 URL
    const LINE_CLIENT_ID = '2006740759';
    const REDIRECT_URI = encodeURIComponent(
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/auth/line/callback'
        : 'https://real-estate-site-orpin.vercel.app/auth/line/callback'
    );
    
    const STATE = Math.random().toString(36).substring(7);
    localStorage.setItem('line_login_state', STATE);
    
    const LINE_AUTH_URL = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=profile%20openid%20email`;
    
    window.location.href = LINE_AUTH_URL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          歡迎使用
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 mb-8">
          使用 LINE 帳號快速登入
        </p>

        <button
          onClick={handleLineLogin}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          Line 登入
        </button>
      </div>
    </div>
  );
};

export default LoginPage;