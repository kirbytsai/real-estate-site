// server/routes/contact.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// 模擬資料庫儲存聯絡請求
const contactRequests = [];

// 提交聯絡表單 (需要身份驗證)
router.post('/submit', auth, (req, res) => {
  try {
    console.log('收到聯絡表單提交，用戶:', req.user);
    
    const {
      name,
      email,
      phone,
      inquiryType,
      timeSlot,
      message,
      preferredMeeting
    } = req.body;

    // 驗證必填欄位
    if (!name || !email || !phone || !inquiryType || !timeSlot || !message) {
      return res.status(400).json({
        error: '請填寫所有必填欄位'
      });
    }

    // 創建聯絡請求記錄
    const contactRequest = {
      id: Date.now(),
      userId: req.user.userId,
      userName: req.user.name,
      submittedAt: new Date().toISOString(),
      formData: {
        name,
        email,
        phone,
        inquiryType,
        timeSlot,
        message,
        preferredMeeting
      },
      status: 'pending', // pending, contacted, resolved, cancelled
      cancelledAt: null,
      cancelReason: null
    };

    // 儲存到模擬資料庫
    contactRequests.push(contactRequest);

    console.log('聯絡請求已儲存:', contactRequest);

    // 模擬發送通知
    sendNotificationToTeam(contactRequest);
    
    res.json({
      success: true,
      message: '您的諮詢申請已成功送出！我們將在 24 小時內與您聯絡。',
      requestId: contactRequest.id,
      estimatedResponseTime: '24小時內'
    });

  } catch (error) {
    console.error('處理聯絡表單時發生錯誤:', error);
    res.status(500).json({
      error: '送出失敗，請稍後再試或直接撥打客服專線'
    });
  }
});

// 取消聯絡申請
router.post('/cancel/:id', auth, (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const { reason } = req.body;
    
    console.log(`用戶 ${req.user.name} 嘗試取消申請 #${requestId}`);
    
    // 找到對應的申請
    const requestIndex = contactRequests.findIndex(
      request => request.id === requestId && request.userId === req.user.userId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({
        error: '找不到該申請記錄'
      });
    }
    
    const request = contactRequests[requestIndex];
    
    // 檢查申請狀態是否可以取消
    if (request.status === 'cancelled') {
      return res.status(400).json({
        error: '該申請已經被取消'
      });
    }
    
    if (request.status === 'resolved') {
      return res.status(400).json({
        error: '已完成的申請無法取消'
      });
    }
    
    // 更新申請狀態
    contactRequests[requestIndex] = {
      ...request,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelReason: reason || '用戶主動取消'
    };
    
    console.log(`申請 #${requestId} 已被取消`);
    
    // 發送取消通知
    sendCancellationNotification(contactRequests[requestIndex]);
    
    res.json({
      success: true,
      message: '申請已成功取消',
      requestId: requestId
    });
    
  } catch (error) {
    console.error('取消申請時發生錯誤:', error);
    res.status(500).json({
      error: '取消申請失敗，請稍後再試'
    });
  }
});

// 獲取用戶的聯絡請求歷史
router.get('/history', auth, (req, res) => {
  try {
    const userRequests = contactRequests
      .filter(request => request.userId === req.user.userId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({
      requests: userRequests,
      total: userRequests.length
    });
  } catch (error) {
    console.error('獲取聯絡歷史失敗:', error);
    res.status(500).json({
      error: '獲取聯絡歷史失敗'
    });
  }
});

// 獲取單一申請詳情
router.get('/:id', auth, (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    
    const request = contactRequests.find(
      request => request.id === requestId && request.userId === req.user.userId
    );
    
    if (!request) {
      return res.status(404).json({
        error: '找不到該申請記錄'
      });
    }
    
    res.json({
      request: request
    });
    
  } catch (error) {
    console.error('獲取申請詳情失敗:', error);
    res.status(500).json({
      error: '獲取申請詳情失敗'
    });
  }
});

// 模擬發送通知給團隊
function sendNotificationToTeam(contactRequest) {
  console.log('📧 發送通知給業務團隊:');
  console.log('==============================');
  console.log(`新的諮詢申請 #${contactRequest.id}`);
  console.log(`客戶: ${contactRequest.formData.name}`);
  console.log(`諮詢類型: ${contactRequest.formData.inquiryType}`);
  console.log(`偏好時段: ${contactRequest.formData.timeSlot}`);
  console.log(`聯絡方式: ${contactRequest.formData.preferredMeeting}`);
  console.log(`提交時間: ${contactRequest.submittedAt}`);
  console.log('==============================');
}

// 模擬發送取消通知
function sendCancellationNotification(contactRequest) {
  console.log('🚫 發送取消通知給業務團隊:');
  console.log('==============================');
  console.log(`申請 #${contactRequest.id} 已被取消`);
  console.log(`客戶: ${contactRequest.formData.name}`);
  console.log(`原申請時間: ${contactRequest.submittedAt}`);
  console.log(`取消時間: ${contactRequest.cancelledAt}`);
  console.log(`取消原因: ${contactRequest.cancelReason}`);
  console.log('==============================');
}

module.exports = router;