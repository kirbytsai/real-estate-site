// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// 中間件設定
app.use(cors());  // 允許跨域請求
app.use(express.json());  // 解析 JSON 請求體
app.use(express.static(path.join(__dirname, 'public'))); // 靜態文件服務

// 導入中間件和路由
const auth = require('./middleware/auth');
const articlesRouter = require('./routes/articles');

// 服務啟動時檢查環境變數
console.log('Server starting with environment variables:');
console.log('LINE_REDIRECT_URI:', process.env.LINE_REDIRECT_URI);
console.log('LINE_CLIENT_ID exists:', !!process.env.LINE_CLIENT_ID);
console.log('LINE_CLIENT_SECRET exists:', !!process.env.LINE_CLIENT_SECRET);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// 在路由處理前檢查環境變數
const checkRequiredEnvVars = () => {
  // 使用與實際代碼中一致的環境變數名稱
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

    // 檢查環境變數
    if (!checkRequiredEnvVars()) {
      return res.status(500).json({ 
        error: '伺服器設定錯誤：缺少必要的環境變數'
      });
    }

    if (!process.env.LINE_CLIENT_ID || !process.env.LINE_CLIENT_SECRET || !process.env.LINE_REDIRECT_URI) {
      console.error('Missing required environment variables for LINE authentication');
      console.log('Environment variables status:', {
        LINE_CLIENT_ID: process.env.LINE_CLIENT_ID ? 'set' : 'missing',
        LINE_CLIENT_SECRET: process.env.LINE_CLIENT_SECRET ? 'set' : 'missing',
        LINE_REDIRECT_URI: process.env.LINE_REDIRECT_URI || 'missing'
      });
      return res.status(500).json({ error: '伺服器設定錯誤：缺少必要的環境變數' });
    }

    console.log('Preparing to exchange token with LINE using:', {
      grant_type: 'authorization_code',
      code: 'REDACTED',
      redirect_uri: process.env.LINE_REDIRECT_URI,
      client_id: process.env.LINE_CLIENT_ID,
      client_secret_exists: !!process.env.LINE_CLIENT_SECRET
    });

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
      console.log('Received tokens from LINE:', {
        access_token_exists: !!access_token,
        id_token_exists: !!id_token
      });

      // 用 access token 取得用戶資料
      let userData;
      
      // 如果有 id_token，可以直接從中獲取基本資訊
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
      
      // 如果沒有從 id_token 獲取到資料，使用 access token 請求用戶資料
      if (!userData) {
        const userResponse = await axios.get('https://api.line.me/v2/profile', {
          headers: { 
            Authorization: `Bearer ${access_token}`
          }
        });
        userData = userResponse.data;
        console.log('Received user data from LINE API');
      }
      
      console.log('User data:', {
        userId: userData.userId || userData.sub,
        name: userData.displayName || userData.name,
        picture_exists: !!(userData.pictureUrl || userData.picture)
      });

      // 確保 JWT_SECRET 存在
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
      
      throw lineError; // 重新拋出以便被外部 catch 捕獲
    }
  } catch (error) {
    console.error('LINE login error:', error.message);
    
    // 詳細錯誤信息記錄
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
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

// 使用文章路由
app.use('/api/articles', articlesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// 處理未捕獲的異常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// 處理未處理的 Promise 拒絕
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});