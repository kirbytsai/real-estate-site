import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-20">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-primary-600 mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">找不到頁面</h2>
        <p className="text-gray-600 mb-8">
          您所查詢的頁面不存在或已經被移除。請返回首頁或嘗試其他連結。
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;