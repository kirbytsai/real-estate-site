// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 從 Authorization 頭部獲取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header or invalid format:', authHeader);
      return res.status(401).json({ message: '未提供授權令牌' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Verifying token...');
    
    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user:', decoded);
    
    // 將用戶數據添加到請求對象
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '登入已過期，請重新登入' });
    }
    
    res.status(401).json({ message: '無效的令牌，請重新登入' });
  }
};