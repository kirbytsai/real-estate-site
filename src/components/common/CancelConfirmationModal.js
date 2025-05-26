// src/components/common/CancelConfirmationModal.js
import React, { useState } from 'react';

const CancelConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  requestId, 
  isLoading = false 
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  // 預設取消原因選項
  const cancelReasons = [
    { value: 'schedule_conflict', label: '時間衝突，無法配合' },
    { value: 'found_alternative', label: '已找到其他解決方案' },
    { value: 'changed_mind', label: '改變主意，暫不需要' },
    { value: 'wrong_info', label: '填寫資訊有誤' },
    { value: 'other', label: '其他原因' }
  ];

  // 修正：這裡需要同時傳遞 requestId 和 reason
  const handleConfirm = () => {
    const reason = selectedReason === 'other' ? cancelReason : 
                  cancelReasons.find(r => r.value === selectedReason)?.label || '';
    
    // 檢查 requestId 是否存在
    if (!requestId) {
      console.error('requestId 不存在');
      return;
    }
    
    console.log('確認取消，傳遞參數:', { requestId, reason });
    
    // 正確傳遞兩個參數：requestId 和 reason
    onConfirm(requestId, reason);
  };

  const handleClose = () => {
    setCancelReason('');
    setSelectedReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          {/* 標題 */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                確認取消申請
              </h3>
              <p className="text-sm text-gray-600">
                申請 #{requestId}
              </p>
            </div>
          </div>

          {/* 警告訊息 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-sm">
                <p className="text-yellow-800 font-medium mb-1">請注意：</p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• 取消後將無法復原</li>
                  <li>• 如需重新預約需要重新提交申請</li>
                  <li>• 我們的顧問團隊將收到取消通知</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 除錯資訊 - 開發階段可以保留 */}
          <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs text-gray-600">
            <strong>除錯資訊:</strong><br />
            requestId: {requestId} (類型: {typeof requestId})<br />
            selectedReason: {selectedReason}<br />
            customReason: {cancelReason}
          </div>

          {/* 取消原因選擇 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              請選擇取消原因 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {cancelReasons.map((reason) => (
                <label key={reason.value} className="flex items-center">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 自訂原因輸入框 */}
          {selectedReason === 'other' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                請說明具體原因
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="請詳細說明取消原因..."
                required
              />
            </div>
          )}

          {/* 按鈕區域 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              返回
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !selectedReason || (selectedReason === 'other' && !cancelReason.trim())}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  取消中...
                </>
              ) : (
                '確認取消'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationModal;