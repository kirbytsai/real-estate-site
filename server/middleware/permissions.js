// server/middleware/permissions.js - 權限檢查中間件 (完整版)

const { getMongoDatabase } = require('../database/mongodb');

// 基本權限檢查中間件
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      // 確保用戶已經通過基本認證
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          error: '請先登入',
          code: 'UNAUTHORIZED'
        });
      }

      const db = getMongoDatabase();
      
      // 檢查用戶權限
      const hasPermission = await db.checkUserPermission(req.user.userId, permission);
      
      if (!hasPermission) {
        console.log(`用戶 ${req.user.name} 嘗試存取需要 ${permission} 權限的資源`);
        
        return res.status(403).json({
          error: '權限不足',
          code: 'FORBIDDEN',
          required: permission
        });
      }

      // 獲取完整用戶資訊並添加到 request 中
      const fullUser = await db.getUserById(req.user.userId);
      req.user.role = fullUser?.role || 'user';
      req.user.permissions = fullUser?.permissions || [];

      console.log(`✅ 用戶 ${req.user.name} (${req.user.role}) 通過權限檢查: ${permission}`);
      next();
      
    } catch (error) {
      console.error('權限檢查失敗:', error);
      res.status(500).json({
        error: '權限檢查失敗',
        code: 'PERMISSION_CHECK_ERROR'
      });
    }
  };
};

// 角色檢查中間件
const requireRole = (roles) => {
  // 支援單一角色或角色陣列
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          error: '請先登入',
          code: 'UNAUTHORIZED'
        });
      }

      const db = getMongoDatabase();
      const user = await db.getUserById(req.user.userId);
      
      if (!user || !user.isActive) {
        return res.status(403).json({
          error: '帳號已被停用',
          code: 'ACCOUNT_DISABLED'
        });
      }

      if (!allowedRoles.includes(user.role)) {
        console.log(`用戶 ${req.user.name} (${user.role}) 嘗試存取需要 ${allowedRoles.join('或')} 角色的資源`);
        
        return res.status(403).json({
          error: '角色權限不足',
          code: 'INSUFFICIENT_ROLE',
          userRole: user.role,
          requiredRoles: allowedRoles
        });
      }

      // 添加完整用戶資訊到 request
      req.user.role = user.role;
      req.user.permissions = user.permissions;
      req.user.isActive = user.isActive;

      console.log(`✅ 用戶 ${req.user.name} (${user.role}) 通過角色檢查`);
      next();
      
    } catch (error) {
      console.error('角色檢查失敗:', error);
      res.status(500).json({
        error: '角色檢查失敗',
        code: 'ROLE_CHECK_ERROR'
      });
    }
  };
};

// 管理員檢查中間件 (admin 或 super_admin)
const requireAdmin = requireRole(['admin', 'super_admin']);

// 超級管理員檢查中間件
const requireSuperAdmin = requireRole(['super_admin']);

// 業務人員檢查中間件 (agent, admin, super_admin)
const requireAgent = requireRole(['agent', 'admin', 'super_admin']);

// 組合式權限檢查 - 同時檢查角色和權限
const requireRoleAndPermission = (roles, permission) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          error: '請先登入',
          code: 'UNAUTHORIZED'
        });
      }

      const db = getMongoDatabase();
      const user = await db.getUserById(req.user.userId);
      
      if (!user || !user.isActive) {
        return res.status(403).json({
          error: '帳號已被停用',
          code: 'ACCOUNT_DISABLED'
        });
      }

      // 檢查角色
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: '角色權限不足',
          code: 'INSUFFICIENT_ROLE',
          userRole: user.role,
          requiredRoles: allowedRoles
        });
      }

      // 檢查權限
      const hasPermission = user.permissions && user.permissions.includes(permission);
      if (!hasPermission) {
        return res.status(403).json({
          error: '操作權限不足',
          code: 'INSUFFICIENT_PERMISSION',
          required: permission
        });
      }

      // 添加完整用戶資訊到 request
      req.user.role = user.role;
      req.user.permissions = user.permissions;
      req.user.isActive = user.isActive;

      console.log(`✅ 用戶 ${req.user.name} (${user.role}) 通過組合權限檢查`);
      next();
      
    } catch (error) {
      console.error('組合權限檢查失敗:', error);
      res.status(500).json({
        error: '權限檢查失敗',
        code: 'PERMISSION_CHECK_ERROR'
      });
    }
  };
};

// 記錄管理員操作的中間件
const logAdminAction = (action) => {
  return async (req, res, next) => {
    // 保存原始的 send 方法
    const originalSend = res.send;
    
    // 重寫 send 方法來捕獲響應
    res.send = function(data) {
      // 只記錄成功的操作 (2xx 狀態碼)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const db = getMongoDatabase();
        
        // 異步記錄，不影響響應速度
        setImmediate(async () => {
          try {
            await db.logAdminAction(req.user.userId, action, {
              path: req.path,
              method: req.method,
              params: req.params,
              body: req.body,
              query: req.query,
              ip: req.ip || req.connection.remoteAddress,
              userAgent: req.get('User-Agent')
            });
            console.log(`📝 已記錄管理員操作: ${req.user.name} - ${action}`);
          } catch (error) {
            console.error('記錄管理員操作失敗:', error);
          }
        });
      }
      
      // 調用原始的 send 方法
      originalSend.call(this, data);
    };
    
    next();
  };
};

// 用戶自己的資源存取檢查
const requireOwnershipOrAdmin = (getUserIdFromParams) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          error: '請先登入',
          code: 'UNAUTHORIZED'
        });
      }

      // 獲取資源擁有者ID
      const resourceUserId = getUserIdFromParams ? getUserIdFromParams(req) : req.params.userId;
      
      // 如果是資源擁有者，直接通過
      if (req.user.userId === resourceUserId) {
        next();
        return;
      }

      // 如果不是擁有者，檢查是否為管理員
      const db = getMongoDatabase();
      const user = await db.getUserById(req.user.userId);
      
      const isAdmin = user && user.isActive && ['admin', 'super_admin'].includes(user.role);
      
      if (!isAdmin) {
        return res.status(403).json({
          error: '只能存取自己的資源，或需要管理員權限',
          code: 'OWNERSHIP_OR_ADMIN_REQUIRED'
        });
      }

      // 管理員權限，添加用戶資訊並通過
      req.user.role = user.role;
      req.user.permissions = user.permissions;
      req.user.isActive = user.isActive;
      
      console.log(`✅ 管理員 ${req.user.name} (${user.role}) 存取他人資源`);
      next();
      
    } catch (error) {
      console.error('擁有權檢查失敗:', error);
      res.status(500).json({
        error: '權限檢查失敗',
        code: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};

// 檢查用戶是否可以管理指定角色的用戶
const canManageRole = (targetRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          error: '請先登入',
          code: 'UNAUTHORIZED'
        });
      }

      const db = getMongoDatabase();
      const user = await db.getUserById(req.user.userId);
      
      if (!user || !user.isActive) {
        return res.status(403).json({
          error: '帳號已被停用',
          code: 'ACCOUNT_DISABLED'
        });
      }

      // 角色等級定義
      const roleLevels = {
        'user': 10,
        'agent': 60,
        'admin': 80,
        'super_admin': 100
      };

      const userLevel = roleLevels[user.role] || 0;
      const targetLevel = roleLevels[targetRole] || 0;

      // 只能管理等級較低或相等的角色
      if (userLevel < targetLevel) {
        return res.status(403).json({
          error: '無權管理該角色的用戶',
          code: 'INSUFFICIENT_ROLE_LEVEL',
          userRole: user.role,
          targetRole: targetRole
        });
      }

      // 只有超級管理員可以設定超級管理員
      if (targetRole === 'super_admin' && user.role !== 'super_admin') {
        return res.status(403).json({
          error: '只有超級管理員可以設定超級管理員角色',
          code: 'SUPER_ADMIN_ONLY'
        });
      }

      req.user.role = user.role;
      req.user.permissions = user.permissions;
      next();
      
    } catch (error) {
      console.error('角色管理權限檢查失敗:', error);
      res.status(500).json({
        error: '權限檢查失敗',
        code: 'ROLE_MANAGEMENT_CHECK_ERROR'
      });
    }
  };
};

// 開發環境專用中間件
const devOnly = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: '此功能僅在開發環境中可用',
      code: 'DEV_ONLY'
    });
  }
  next();
};

// 導出所有中間件
module.exports = {
  requirePermission,
  requireRole,
  requireAdmin,
  requireSuperAdmin,
  requireAgent,
  requireRoleAndPermission,
  logAdminAction,
  requireOwnershipOrAdmin,
  canManageRole,
  devOnly
};

// 權限常數定義
module.exports.PERMISSIONS = {
  // 用戶管理
  USERS_READ: 'users.read',
  USERS_WRITE: 'users.write',
  USERS_DELETE: 'users.delete',
  
  // 角色管理
  ROLES_READ: 'roles.read',
  ROLES_WRITE: 'roles.write',
  ROLES_DELETE: 'roles.delete',
  
  // 聯絡申請管理
  CONTACTS_READ: 'contacts.read',
  CONTACTS_WRITE: 'contacts.write',
  CONTACTS_DELETE: 'contacts.delete',
  CONTACTS_CREATE: 'contacts.create',
  
  // 文章管理
  ARTICLES_READ: 'articles.read',
  ARTICLES_WRITE: 'articles.write',
  ARTICLES_DELETE: 'articles.delete',
  
  // 數據分析
  ANALYTICS_READ: 'analytics.read',
  
  // 個人資料
  PROFILE_READ: 'profile.read',
  PROFILE_WRITE: 'profile.write',
  
  // 系統設定
  SYSTEM_SETTINGS: 'system.settings'
};

// 角色常數定義
module.exports.ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user'
};

// 權限檢查工具函數
module.exports.hasPermission = async (userId, permission) => {
  try {
    const db = getMongoDatabase();
    return await db.checkUserPermission(userId, permission);
  } catch (error) {
    console.error('權限檢查工具函數失敗:', error);
    return false;
  }
};

// 角色檢查工具函數
module.exports.hasRole = async (userId, roles) => {
  try {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const db = getMongoDatabase();
    const user = await db.getUserById(userId);
    return user && user.isActive && allowedRoles.includes(user.role);
  } catch (error) {
    console.error('角色檢查工具函數失敗:', error);
    return false;
  }
};