// src/pages/ContactPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: '',
    phone: '',
    inquiryType: '',
    timeSlot: '',
    message: '',
    preferredMeeting: 'google-meet'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // 詢問類型選項
  const inquiryTypes = [
    { value: 'buying', label: '我想購買房產' },
    { value: 'selling', label: '我想出售房產' },
    { value: 'investment', label: '投資諮詢' },
    { value: 'market-analysis', label: '市場分析' },
    { value: 'valuation', label: '房屋估價' },
    { value: 'other', label: '其他問題' }
  ];

  // 時段選項
  const timeSlots = [
    { value: 'morning', label: '上午時段 (09:00 - 12:00)', icon: '🌅' },
    { value: 'afternoon', label: '下午時段 (14:00 - 17:00)', icon: '☀️' },
    { value: 'evening', label: '晚上時段 (19:00 - 21:00)', icon: '🌙' }
  ];

  // 會議平台選項
  const meetingPlatforms = [
    { value: 'google-meet', label: 'Google Meet', icon: '📹' },
    { value: 'zoom', label: 'Zoom', icon: '💻' },
    { value: 'teams', label: 'Microsoft Teams', icon: '🖥️' },
    { value: 'phone', label: '電話會議', icon: '📞' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      
      // 重置表單
      setFormData({
        name: currentUser?.name || '',
        email: '',
        phone: '',
        inquiryType: '',
        timeSlot: '',
        message: '',
        preferredMeeting: 'google-meet'
      });
      
      // 3秒後清除成功狀態
      setTimeout(() => setSubmitStatus(null), 3000);
      
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題區塊 */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 py-20 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-4 border-white animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white animate-float"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              聯絡我們
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              有任何房地產相關問題嗎？我們專業的顧問團隊隨時為您服務，
              立即預約諮詢，讓我們協助您實現置業夢想。
            </p>
            
            {/* 聯絡資訊快速顯示 */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6" data-aos="fade-up" data-aos-delay="100">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="font-semibold mb-2">客服專線</h3>
                <p className="text-primary-100">(02) 1234-5678</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6" data-aos="fade-up" data-aos-delay="200">
                <div className="text-3xl mb-3">✉️</div>
                <h3 className="font-semibold mb-2">電子郵件</h3>
                <p className="text-primary-100">service@realestate.com.tw</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6" data-aos="fade-up" data-aos-delay="300">
                <div className="text-3xl mb-3">🕒</div>
                <h3 className="font-semibold mb-2">服務時間</h3>
                <p className="text-primary-100">週一至週六 9:00-21:00</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 波浪底部 */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-gray-50">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* 主要表單區塊 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-8 py-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                🏠 預約房地產諮詢服務
              </h2>
              <p className="text-gray-600 text-center mt-2">
                填寫以下表單，我們將安排專業顧問與您進行線上會議
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* 基本資訊 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                  基本資訊
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="請輸入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      電子郵件 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      聯絡電話 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="0912-345-678"
                    />
                  </div>
                </div>
              </div>

              {/* 諮詢內容 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                  諮詢內容
                </h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    諮詢類型 *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => (
                      <label key={type.value} className="relative">
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type.value}
                          checked={formData.inquiryType === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.inquiryType === type.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    詳細問題描述 *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="請詳細描述您想了解的房地產問題，例如：預算範圍、偏好地區、房型需求等..."
                  />
                </div>
              </div>

              {/* 預約時段 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                  預約時段
                </h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    選擇偏好時段 *
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {timeSlots.map((slot) => (
                      <label key={slot.value} className="relative">
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot.value}
                          checked={formData.timeSlot === slot.value}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                          formData.timeSlot === slot.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="text-2xl mb-2">{slot.icon}</div>
                          <div className="font-medium">{slot.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    偏好會議平台 *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {meetingPlatforms.map((platform) => (
                      <label key={platform.value} className="relative">
                        <input
                          type="radio"
                          name="preferredMeeting"
                          value={platform.value}
                          checked={formData.preferredMeeting === platform.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center ${
                          formData.preferredMeeting === platform.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <span className="text-xl mr-3">{platform.icon}</span>
                          <span className="font-medium">{platform.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 提交狀態顯示 */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700 font-medium">
                    預約申請已成功送出！我們將在24小時內與您聯絡安排會議時間。
                  </span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 font-medium">
                    送出時發生錯誤，請稍後再試或直接撥打客服專線。
                  </span>
                </div>
              )}

              {/* 提交按鈕 */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      送出中...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      立即預約諮詢
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 額外資訊 */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-3">💼</span>
                專業服務承諾
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24小時內回覆您的諮詢申請
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  專業顧問一對一服務
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  完全免費諮詢服務
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  個資絕對保密安全
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-3">📍</span>
                其他聯絡方式
              </h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">辦公室地址</p>
                    <p className="text-sm">台北市大安區復興南路一段390號12樓</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium">緊急聯絡專線</p>
                    <p className="text-sm">0800-123-456 (24小時服務)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div>
                    <p className="font-medium">LINE 官方帳號</p>
                    <p className="text-sm">@realestate-tw</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;