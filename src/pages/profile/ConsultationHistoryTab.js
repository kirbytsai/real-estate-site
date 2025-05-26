// src/pages/profile/ConsultationHistoryTab.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CancelConfirmationModal from '../../components/common/CancelConfirmationModal';

const ConsultationHistoryTab = ({ setCancelMessage }) => {
  const [contactHistory, setContactHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  
  // 取消功能相關狀態
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingRequestId, setCancellingRequestId] = useState(null);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [processingCancellations, setProcessingCancellations] = useState(new Set()); // 正在處理取消的申請

  // 載入諮詢記錄
  const loadContactHistory = async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    
    try {
      const response = await axios.get('/api/contact/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('諮詢記錄載入成功:', response.data);
      setContactHistory(response.data.requests || []);
    } catch (error) {
      console.error('載入諮詢記錄失敗:', error);
      setHistoryError('載入諮詢記錄失敗，請稍後再試');
    } finally {
      setLoadingHistory(false);
    }
  };

  // 取消申請 - 完整版本
  const handleCancelRequest = async (requestId, reason) => {
    console.log('準備取消申請:', { requestId, reason });
    
    setIsCancelLoading(true);
    
    // 添加到正在處理的集合中
    setProcessingCancellations(prev => new Set([...prev, requestId]));
    
    try {
      const numericRequestId = parseInt(requestId);
      
      if (isNaN(numericRequestId)) {
        throw new Error('無效的申請 ID');
      }
      
      console.log('發送取消請求到:', `/api/contact/cancel/${numericRequestId}`);
      console.log('請求內容:', { reason });
      
      const response = await axios.post(`/api/contact/cancel/${numericRequestId}`, {
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10秒超時
      });
      
      console.log('申請取消成功:', response.data);
      
      // 立即更新本地狀態，將該申請標記為已取消
      setContactHistory(prevHistory => 
        prevHistory.map(request => 
          request.id === numericRequestId 
            ? { 
                ...request, 
                status: 'cancelled',
                cancelledAt: new Date().toISOString(),
                cancelReason: reason
              }
            : request
        )
      );
      
      // 關閉對話框
      setShowCancelModal(false);
      setCancellingRequestId(null);
      
      // 顯示成功訊息
      setCancelMessage('申請已成功取消');
      
      // 3秒後清除訊息
      setTimeout(() => {
        setCancelMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('取消申請失敗:', error);
      console.error('錯誤詳情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      let errorMessage = '取消申請失敗，請稍後再試';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = '請求超時，請檢查網路連接';
      } else if (error.response?.status === 404) {
        errorMessage = '找不到該申請記錄或 API 路由不存在';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.error || '無法取消該申請';
      } else if (error.response?.status === 401) {
        errorMessage = '登入已過期，請重新登入';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = `錯誤：${error.message}`;
      }
      
      setCancelMessage(errorMessage);
      
      // 5秒後清除錯誤訊息
      setTimeout(() => {
        setCancelMessage('');
      }, 5000);
    } finally {
      setIsCancelLoading(false);
      // 無論成功或失敗，都從處理集合中移除
      setProcessingCancellations(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // 開啟取消確認對話框
  const openCancelModal = (requestId) => {
    console.log('開啟取消對話框，申請 ID:', requestId);
    setCancellingRequestId(requestId);
    setShowCancelModal(true);
  };

  // 關閉取消確認對話框
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancellingRequestId(null);
  };

  // 當組件載入時自動載入資料
  useEffect(() => {
    loadContactHistory();
  }, []);

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化諮詢類型
  const formatInquiryType = (type) => {
    const types = {
      'buying': '我想購買房產',
      'selling': '我想出售房產',
      'investment': '投資諮詢',
      'market-analysis': '市場分析',
      'valuation': '房屋估價',
      'other': '其他問題'
    };
    return types[type] || type;
  };

  // 格式化時段
  const formatTimeSlot = (slot) => {
    const slots = {
      'morning': '上午時段 (09:00 - 12:00)',
      'afternoon': '下午時段 (14:00 - 17:00)',
      'evening': '晚上時段 (19:00 - 21:00)'
    };
    return slots[slot] || slot;
  };

  // 格式化會議平台
  const formatMeetingPlatform = (platform) => {
    const platforms = {
      'google-meet': 'Google Meet',
      'zoom': 'Zoom',
      'teams': 'Microsoft Teams',
      'phone': '電話會議'
    };
    return platforms[platform] || platform;
  };

  // 狀態顏色
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 狀態文字
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待處理';
      case 'contacted':
        return '已聯絡';
      case 'resolved':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  // 檢查申請是否可以取消
  const canCancelRequest = (status) => {
    return status === 'pending' || status === 'contacted';
  };

  // 檢查申請是否正在處理取消中
  const isRequestProcessing = (requestId) => {
    return processingCancellations.has(requestId);
  };

  // 獲取按鈕狀態和文字
  const getCancelButtonState = (request) => {
    if (request.status === 'cancelled') {
      return {
        show: true,
        disabled: true,
        text: '已取消',
        className: 'px-4 py-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed flex items-center text-sm',
        icon: (
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    }
    
    if (isRequestProcessing(request.id)) {
      return {
        show: true,
        disabled: true,
        text: '取消中...',
        className: 'px-4 py-2 bg-orange-100 text-orange-700 rounded-lg cursor-not-allowed flex items-center text-sm',
        icon: (
          <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )
      };
    }
    
    if (canCancelRequest(request.status)) {
      return {
        show: true,
        disabled: false,
        text: '取消申請',
        className: 'px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center text-sm',
        icon: (
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      };
    }
    
    return { show: false };
  };

  // 過濾要顯示的申請（選擇性隱藏已取消的）
  const getDisplayRequests = () => {
    // 可以選擇是否顯示已取消的申請
    // return contactHistory.filter(request => request.status !== 'cancelled'); // 隱藏已取消的
    return contactHistory; // 顯示所有申請（包括已取消的）
  };

  const displayRequests = getDisplayRequests();

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg" data-aos="fade-up">
        <div className="px-8 py-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">諮詢記錄</h2>
              <p className="text-sm text-gray-500 mt-1">
                共 {displayRequests.length} 筆記錄
                {displayRequests.filter(r => r.status === 'cancelled').length > 0 && 
                  ` (包含 ${displayRequests.filter(r => r.status === 'cancelled').length} 筆已取消)`
                }
              </p>
            </div>
            <button
              onClick={loadContactHistory}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新載入
            </button>
          </div>
        </div>

        <div className="p-8">
          {loadingHistory ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">載入中...</span>
            </div>
          ) : historyError ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">{historyError}</p>
              </div>
              <button
                onClick={loadContactHistory}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                重試
              </button>
            </div>
          ) : displayRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">還沒有諮詢記錄</h3>
              <p className="text-gray-600 mb-6">您尚未提交過任何諮詢申請</p>
              <Link
                to="/contact"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                立即預約諮詢
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {displayRequests.map((request) => {
                const buttonState = getCancelButtonState(request);
                
                return (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 mr-3">
                            申請 #{request.id}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          提交時間：{formatDate(request.submittedAt)}
                        </p>
                        {request.status === 'cancelled' && request.cancelledAt && (
                          <p className="text-red-600 text-sm">
                            取消時間：{formatDate(request.cancelledAt)}
                          </p>
                        )}
                        {request.cancelReason && (
                          <p className="text-gray-600 text-sm">
                            取消原因：{request.cancelReason}
                          </p>
                        )}
                      </div>
                      
                      {/* 動態取消按鈕 */}
                      {buttonState.show && (
                        <div>
                          {buttonState.disabled ? (
                            <div className={buttonState.className}>
                              {buttonState.icon}
                              {buttonState.text}
                            </div>
                          ) : (
                            <button
                              onClick={() => openCancelModal(request.id)}
                              className={buttonState.className}
                            >
                              {buttonState.icon}
                              {buttonState.text}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-700">諮詢類型：</span>
                          <span className="text-sm text-gray-900 ml-2">
                            {formatInquiryType(request.formData.inquiryType)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">偏好時段：</span>
                          <span className="text-sm text-gray-900 ml-2">
                            {formatTimeSlot(request.formData.timeSlot)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">會議平台：</span>
                          <span className="text-sm text-gray-900 ml-2">
                            {formatMeetingPlatform(request.formData.preferredMeeting)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">問題描述：</span>
                        <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                          {request.formData.message}
                        </p>
                      </div>
                    </div>
                    
                    {/* 除錯資訊 */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>ID: {request.id} | 類型: {typeof request.id}</span>
                        <span>處理中: {isRequestProcessing(request.id) ? '是' : '否'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 取消確認對話框 */}
      <CancelConfirmationModal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        onConfirm={handleCancelRequest}
        requestId={cancellingRequestId}
        isLoading={isCancelLoading}
      />
    </>
  );
};

export default ConsultationHistoryTab;