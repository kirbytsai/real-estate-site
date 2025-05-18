// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute check:', { 
    path: location.pathname,
    isAuthenticated: !!currentUser, 
    isLoading: loading 
  });

  // 處理載入狀態
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-3 text-gray-600">驗證中...</p>
      </div>
    );
  }

  // 如果未登入，重定向到登入頁面，同時保存當前URL以便登入後返回
  if (!currentUser) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering protected route');
  return <Outlet />;
};

export default PrivateRoute;