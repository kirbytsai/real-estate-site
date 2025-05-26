// server/server.js - 更新版本 (加入管理員功能)
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const { getMongoDatabase } = require('./database/mongodb');

const app = express();

// 中間件設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 導入中間件和路由
const auth = require('./middleware/auth');
const articlesRouter = require('./routes/articles');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin'); // 新增管理員路由

// 服務啟動時檢查環境變數
console.log('Server starting with environment variables:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('LINE_REDIRECT_URI:', process.env.LINE_REDIRECT_URI);
console.log('LINE_CLIENT_ID exists:', !!process.env.LINE_CLIENT_ID);
console.log('LINE_CLIENT_SECRET exists:', !!process.env.LINE_CLIENT_SECRET);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// 檢查必要環境變數
const checkRequiredEnvVars = () => {
  const requiredVars = ['LINE_CLIENT_ID', 'LINE_CLIENT_SECRET', 'LINE_REDIRECT_URI', 'JWT_SECRET', 'MONGODB_URI'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`缺少必要的環境變數: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// LINE 登入回調處理 - 更新版本 (包含角色系統)
app.post('/api/auth/line/callback', async (req, res) => {
  try {
    const { code } = req.body;
    console.log('Received authorization code:', code);

    if (!checkRequiredEnvVars()) {
      return res.status(500).json({ 
        error: '伺服器設定錯誤：缺少必要的環境變數'
      });
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

      // 準備用戶資料並儲存到資料庫
      const userInfo = {
        id: userData.userId || userData.sub,
        name: userData.displayName || userData.name,
        picture: userData.pictureUrl || userData.picture,
        lineUserId: userData.userId || userData.sub,
        email: userData.email
      };

      // 檢查是否為第一個用戶（自動設為超級管理員）
      const db = getMongoDatabase();
      
      // 先檢查資料庫中是否已有用戶
      const existingUser = await db.getUserById(userInfo.id);
      
      if (!existingUser) {
        // 檢查是否為第一個用戶
        const allUsers = await db.getAllUsers({ limit: 1 });
        const isFirstUser = allUsers.users.length === 0;
        
        // 第一個用戶自動成為超級管理員
        userInfo.role = isFirstUser ? 'super_admin' : 'user';
        
        console.log(`新用戶註冊: ${userInfo.name}, 角色: ${userInfo.role}`);
      } else {
        // 使用現有角色
        userInfo.role = existingUser.role;
        console.log(`用戶登入: ${userInfo.name}, 角色: ${userInfo.role}`);
      }

      // 儲存/更新用戶資料到 MongoDB
      const savedUser = await db.createOrUpdateUser(userInfo);

      // 建立 JWT token
      const token = jwt.sign(
        {
          userId: savedUser.id,
          name: savedUser.name,
          picture: savedUser.picture,
          role: savedUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ 
        token,
        user: {
          id: savedUser.id,
          name: savedUser.name,
          picture: savedUser.picture,
          role: savedUser.role,
          permissions: savedUser.permissions
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
        JWT_SECRET: !!process.env.JWT_SECRET,
        MONGODB_URI: !!process.env.MONGODB_URI
      }
    }
  });
});

// MongoDB 連接測試路由
app.get('/api/test-mongodb', async (req, res) => {
  try {
    console.log('🧪 測試 MongoDB 連接...');
    
    const db = getMongoDatabase();
    
    // 嘗試連接
    await db.connect();
    
    // 測試資料庫操作
    const mongoDb = await db.connect();
    const collections = await mongoDb.listCollections().toArray();
    
    console.log('✅ MongoDB 測試成功');
    
    res.json({
      success: true,
      message: 'MongoDB 連接測試成功！',
      database: 'real-estate',
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ MongoDB 測試失敗:', error);
    
    res.status(500).json({
      success: false,
      message: 'MongoDB 連接測試失敗',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 健康檢查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 受保護的用戶資訊路由 - 更新版本
app.get('/api/user', auth, async (req, res) => {
  try {
    // 從資料庫獲取最新的用戶資料
    const db = getMongoDatabase();
    const user = await db.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: '用戶不存在'
      });
    }

    res.json({ 
      user: {
        id: user.id,
        name: user.name,
        picture: user.picture,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive
      },
      message: '已通過身份驗證'
    });
  } catch (error) {
    console.error('獲取用戶資訊失敗:', error);
    res.status(500).json({
      error: '獲取用戶資訊失敗'
    });
  }
});

// 使用路由
app.use('/api/articles', articlesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter); // 新增管理員路由

// 除錯路由
app.get('/api/contact/test', (req, res) => {
  res.json({ 
    message: 'Contact routes are working!',
    timestamp: new Date().toISOString()
  });
});

// 顯示所有註冊的路由（除錯用）
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

// 管理員快速設定路由 (開發用)
app.post('/api/dev/make-admin/:userId', async (req, res) => {
  try {
    // 僅在開發環境中使用
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: '此功能僅在開發環境中可用'
      });
    }

    const { userId } = req.params;
    const { role = 'admin' } = req.body;
    
    const db = getMongoDatabase();
    const result = await db.updateUserRole(userId, role);
    
    console.log(`🔧 開發工具: 用戶 ${userId} 已設為 ${role}`);
    
    res.json({
      success: true,
      message: `用戶已設為 ${role}`,
      data: result
    });
    
  } catch (error) {
    console.error('設定管理員失敗:', error);
    res.status(500).json({
      error: '設定管理員失敗',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('📍 測試聯絡路由: http://localhost:5000/api/contact/test');
  console.log('📍 查看所有路由: http://localhost:5000/api/routes');
  console.log('🏠 管理員 API: http://localhost:5000/api/admin');
  console.log('📊 系統統計: http://localhost:5000/api/admin/dashboard/stats');
  
  // 初始化資料庫連接
  console.log('🔄 初始化資料庫連接...');
  const db = getMongoDatabase();
  db.connect().then(() => {
    console.log('✅ 資料庫初始化完成');
  }).catch(error => {
    console.error('❌ 資料庫初始化失敗:', error);
  });
});

// 處理未捕獲的異常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});