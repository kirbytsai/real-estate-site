// src/pages/profile/ProfilePage.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import PersonalInfoTab from './PersonalInfoTab';
import ConsultationHistoryTab from './ConsultationHistoryTab';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [cancelMessage, setCancelMessage] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">請先登入</h2>
          <Link 
            to="/login" 
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 取消訊息顯示 */}
          {cancelMessage && (
            <div className={`mb-6 p-4 rounded-lg border ${
              cancelMessage.includes('成功') 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {cancelMessage.includes('成功') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className="font-medium">{cancelMessage}</span>
              </div>
            </div>
          )}

          {/* 個人資訊頭部 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8" data-aos="fade-up">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                    {currentUser.picture ? (
                      <img 
                        src={currentUser.picture} 
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    您好，{currentUser.name}！
                  </h1>
                  <p className="text-primary-100 text-lg">
                    歡迎來到您的個人會員頁面
                  </p>
                </div>
              </div>
            </div>
            
            {/* 頁籤導航 */}
            <div className="bg-white border-b">
              <div className="px-8">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    個人資訊
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === 'history'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    諮詢記錄
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* 頁籤內容 */}
          {activeTab === 'overview' && (
            <PersonalInfoTab currentUser={currentUser} />
          )}

          {activeTab === 'history' && (
            <ConsultationHistoryTab 
              setCancelMessage={setCancelMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;