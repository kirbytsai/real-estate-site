// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // 確保頁面載入時設置 axios 頭部
  useEffect(() => {
    if (currentUser) {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Setting Authorization header in Header component');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }, [currentUser]);

  // 導航項目
  const getNavItems = () => {
    // 基本導航項目（所有用戶都能看到）
    const baseNavItems = [
      { 
        name: '首頁', 
        path: '/', 
        icon: (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      },
      { 
        name: '房源', 
        path: '/properties', 
        icon: (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      },
      { 
        name: '關於我們', 
        path: '/about', 
        icon: (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    ];
    
    // 僅當用戶登錄後才添加會員專屬功能
    if (currentUser) {
      baseNavItems.push(
        { 
          name: '文章專欄', 
          path: '/articles', 
          icon: (
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
            </svg>
          )
        },
        { 
          name: '聯絡我們', 
          path: '/contact', 
          icon: (
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        },
        { 
          name: '個人中心', 
          path: '/profile', 
          icon: (
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        }
      );
    }
    
    return baseNavItems;
  };

  // 處理導航項目點擊
  const handleNavItemClick = (e, path) => {
    setIsMenuOpen(false);
    
    // 特別處理需要登入的路徑
    const protectedPaths = ['/articles', '/contact', '/profile'];
    
    if (protectedPaths.includes(path)) {
      // 檢查是否登入
      if (!currentUser) {
        e.preventDefault();
        navigate('/login');
        return;
      }
      
      // 確保在訪問受保護頁面前設置認證頭部
      const token = localStorage.getItem('token');
      if (token) {
        console.log(`Setting Authorization header before navigating to ${path}`);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 添加小延遲以確保頭部設置完成
        e.preventDefault();
        setTimeout(() => {
          navigate(path);
        }, 100);
      }
    }
  };

  // 處理登出
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // 處理登入點擊
  const handleLoginClick = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
          <svg className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          房地產網站
        </Link>

        {/* 移動裝置選單按鈕 */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 導航選單 */}
        <nav className={`
          ${isMenuOpen ? 'block' : 'hidden'} 
          md:block absolute md:relative 
          top-16 md:top-0 left-0 md:left-auto 
          w-full md:w-auto bg-white md:bg-transparent 
          shadow-lg md:shadow-none z-20
        `}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0">
            {getNavItems().map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className="flex items-center hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavItemClick(e, item.path)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  登出
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  登入
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;