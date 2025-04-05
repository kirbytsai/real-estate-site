// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();

// 中間件設定
app.use(cors());  // 允許跨域請求
app.use(express.json());  // 解析 JSON 請求體

// LINE 登入回調處理
app.post('/api/auth/line/callback', async (req, res) => {
  try {
    const { code } = req.body;
    console.log('Received authorization code:', code);

    // 向 LINE 交換 access token
    const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINE_REDIRECT_URI,
        client_id: process.env.LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = tokenResponse.data;
    console.log('Received access token from LINE');

    // 用 access token 取得用戶資料
    const userResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: { 
        Authorization: `Bearer ${access_token}`
      }
    });

    const userData = userResponse.data;
    console.log('Received user data:', userData);

    // 建立 JWT token
    const token = jwt.sign(
      {
        userId: userData.userId,
        name: userData.displayName,
        picture: userData.pictureUrl
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: {
        id: userData.userId,
        name: userData.displayName,
        picture: userData.pictureUrl
      }
    });

  } catch (error) {
    console.error('LINE login error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '登入處理失敗',
      details: error.message 
    });
  }
});

// 測試路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API server is working!' });
});

// 處理 Vercel 的 serverless 環境
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// 為 Vercel 導出 Express 應用
module.exports = app;