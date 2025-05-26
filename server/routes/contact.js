// server/routes/contact.js - MongoDB 版本
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMongoDatabase } = require('../database/mongodb');

const db = getMongoDatabase();

// 提交聯絡表單 (需要身份驗證)
router.post('/submit', auth, async (req, res) => {
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
    const contactRequestData = {
      userId: req.user.userId,
      userName: req.user.name,
      formData: {
        name,
        email,
        phone,
        inquiryType,
        timeSlot,
        message,
        preferredMeeting
      },
      status: 'pending'
    };

    // 保存到 MongoDB
    const savedRequest = await db.createContactRequest(contactRequestData);

    console.log('聯絡請求已儲存到 MongoDB:', savedRequest.id);

    // 模擬發送通知
    sendNotificationToTeam(savedRequest);
    
    res.json({
      success: true,
      message: '您的諮詢申請已成功送出！我們將在 24 小時內與您聯絡。',
      requestId: savedRequest.id,
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
router.post('/cancel/:id', auth, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const { reason } = req.body;
    
    console.log(`用戶 ${req.user.name} 嘗試取消申請 #${requestId}`);
    
    // 更新 MongoDB 中的申請狀態
    await db.updateContactRequestStatus(requestId, req.user.userId, 'cancelled', reason);
    
    console.log(`申請 #${requestId} 已在 MongoDB 中標記為取消`);
    
    // 發送取消通知
    sendCancellationNotification({ 
      id: requestId, 
      formData: { name: req.user.name },
      cancelReason: reason 
    });
    
    res.json({
      success: true,
      message: '申請已成功取消',
      requestId: requestId
    });
    
  } catch (error) {
    console.error('取消申請時發生錯誤:', error);
    
    if (error.message === '找不到該申請記錄') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({
      error: '取消申請失敗，請稍後再試'
    });
  }
});

// 獲取用戶的聯絡請求歷史
router.get('/history', auth, async (req, res) => {
  try {
    const requests = await db.getContactRequestsByUser(req.user.userId);

    res.json({
      requests: requests,
      total: requests.length
    });
  } catch (error) {
    console.error('獲取聯絡歷史失敗:', error);
    res.status(500).json({
      error: '獲取聯絡歷史失敗'
    });
  }
});

// 獲取單一申請詳情
router.get('/:id', auth, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    
    const requests = await db.getContactRequestsByUser(req.user.userId);
    const request = requests.find(r => r.id === requestId);
    
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
  console.log(`取消原因: ${contactRequest.cancelReason}`);
  console.log('==============================');
}

module.exports = router;