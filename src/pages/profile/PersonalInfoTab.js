// src/pages/profile/PersonalInfoTab.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PersonalInfoTab = ({ currentUser }) => {
  const { logout } = useAuth();

  return (
    <div className="space-y-8">
      {/* 帳戶詳細資訊 */}
      <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-up">
        <h2 className="text-xl font-bold text-gray-800 mb-6">帳戶資訊</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用戶名稱
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {currentUser.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用戶 ID
              </label>
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                {currentUser.id}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                登入方式
              </label>
              <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755z"/>
                </svg>
                LINE 帳號登入
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                會員狀態
              </label>
              <div className="p-3 bg-green-50 rounded-lg flex items-center text-green-700">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                活躍會員
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速功能區塊 */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay="100">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">瀏覽文章</h3>
            <p className="text-gray-600 text-sm mb-4">查看最新的房地產知識文章</p>
            <Link 
              to="/articles" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              前往閱讀 →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay="200">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">聯絡我們</h3>
            <p className="text-gray-600 text-sm mb-4">預約專業房地產諮詢服務</p>
            <Link 
              to="/contact" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              立即預約 →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay="300">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">登出帳號</h3>
            <p className="text-gray-600 text-sm mb-4">安全地登出您的帳號</p>
            <button 
              onClick={logout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              立即登出 →
            </button>
          </div>
        </div>
      </div>

      {/* 最近活動 */}
      <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="400">
        <h2 className="text-xl font-bold text-gray-800 mb-6">最近活動</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">成功登入</p>
              <p className="text-sm text-gray-500">剛剛 - 透過 LINE 帳號登入</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">建立會員帳號</p>
              <p className="text-sm text-gray-500">今天 - 歡迎加入我們的平台！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;