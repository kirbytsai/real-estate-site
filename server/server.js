// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// 中間件設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 導入中間件和路由
const auth = require('./middleware/auth');
const articlesRouter = require('./routes/articles');
const contactRouter = require('./routes/contact'); // 新增聯絡路由



// 服務啟動時檢查環境變數
console.log('Server starting with environment variables:');
console.log('LINE_REDIRECT_URI:', process.env.LINE_REDIRECT_URI);
console.log('LINE_CLIENT_ID exists:', !!process.env.LINE_CLIENT_ID);
console.log('LINE_CLIENT_SECRET exists:', !!process.env.LINE_CLIENT_SECRET);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// 檢查必要環境變數
const checkRequiredEnvVars = () => {
  const requiredVars = ['LINE_CLIENT_ID', 'LINE_CLIENT_SECRET', 'LINE_REDIRECT_URI', 'JWT_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`缺少必要的環境變數: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// LINE 登入回調處理
app.post('/api/auth/line/callback', async (req, res) => {
  try {
    const { code } = req.body;
    console.log('Received authorization code:', code);

    if (!checkRequiredEnvVars()) {
      return res.status(500).json({ 
        error: '伺服器設定錯誤：缺少必要的環境變數'
      });
    }

    if (!process.env.LINE_CLIENT_ID || !process.env.LINE_CLIENT_SECRET || !process.env.LINE_REDIRECT_URI) {
      console.error('Missing required environment variables for LINE authentication');
      return res.status(500).json({ error: '伺服器設定錯誤：缺少必要的環境變數' });
    }

    try {
      // 向 LINE 交換 access token
      const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.LINE_REDIRECT_URI,
          client_id: process.env.LINE_CLIENT_ID,
          client_secret: process.env.LINE_CLIENT_SECRET
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, id_token } = tokenResponse.data;
      console.log('Received tokens from LINE');

      // 獲取用戶資料
      let userData;
      
      if (id_token) {
        try {
          const base64Payload = id_token.split('.')[1];
          const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
          userData = {
            userId: payload.sub,
            displayName: payload.name,
            pictureUrl: payload.picture,
            email: payload.email
          };
          console.log('Extracted user data from id_token');
        } catch (error) {
          console.error('Error parsing id_token:', error);
        }
      }
      
      if (!userData) {
        const userResponse = await axios.get('https://api.line.me/v2/profile', {
          headers: { 
            Authorization: `Bearer ${access_token}`
          }
        });
        userData = userResponse.data;
        console.log('Received user data from LINE API');
      }

      if (!process.env.JWT_SECRET) {
        console.error('Missing JWT_SECRET environment variable');
        return res.status(500).json({ error: '伺服器設定錯誤：缺少 JWT 密鑰' });
      }

      // 建立 JWT token
      const token = jwt.sign(
        {
          userId: userData.userId || userData.sub,
          name: userData.displayName || userData.name,
          picture: userData.pictureUrl || userData.picture
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ 
        token,
        user: {
          id: userData.userId || userData.sub,
          name: userData.displayName || userData.name,
          picture: userData.pictureUrl || userData.picture
        }
      });
    } catch (lineError) {
      console.error('LINE API error:', lineError.message);
      
      if (lineError.response?.data?.error === 'invalid_grant') {
        return res.status(400).json({ 
          error: 'invalid_grant',
          message: '授權碼已失效或已被使用，請重新登入'
        });
      }
      
      if (lineError.response) {
        console.error('LINE API error response:', lineError.response.data);
        return res.status(lineError.response.status).json({
          error: lineError.response.data.error || 'line_api_error',
          message: lineError.response.data.error_description || '與 LINE 服務通信時出錯'
        });
      }
      
      throw lineError;
    }
  } catch (error) {
    console.error('LINE login error:', error.message);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    
    res.status(500).json({ 
      error: '登入處理失敗',
      details: error.message,
      serverTime: new Date().toISOString()
    });
  }
});

// 測試路由
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API server is working!',
    serverTime: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      envVarsSet: {
        LINE_CLIENT_ID: !!process.env.LINE_CLIENT_ID,
        LINE_CLIENT_SECRET: !!process.env.LINE_CLIENT_SECRET,
        LINE_REDIRECT_URI: !!process.env.LINE_REDIRECT_URI,
        JWT_SECRET: !!process.env.JWT_SECRET
      }
    }
  });
});

// 健康檢查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 受保護的用戶資訊路由
app.get('/api/user', auth, (req, res) => {
  res.json({ 
    user: req.user,
    message: '已通過身份驗證'
  });
});

// 使用路由
app.use('/api/articles', articlesRouter);
app.use('/api/contact', contactRouter); // 新增聯絡路由

// 📍 新增除錯路由來測試
app.get('/api/contact/test', (req, res) => {
  res.json({ 
    message: 'Contact routes are working!',
    timestamp: new Date().toISOString()
  });
});

// 📍 顯示所有註冊的路由（除錯用）
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      routes.push({
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path
      });
    } else if (r.name === 'router') {
      r.handle.stack.forEach(function(nestedR) {
        if (nestedR.route) {
          routes.push({
            method: Object.keys(nestedR.route.methods)[0].toUpperCase(),
            path: r.regexp.source.replace('\\/?(?=\\/|$)', '') + nestedR.route.path
          });
        }
      });
    }
  });
  res.json({ routes });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('📍 測試聯絡路由: http://localhost:5000/api/contact/test');
  console.log('📍 查看所有路由: http://localhost:5000/api/routes');
});

// 處理未捕獲的異常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});