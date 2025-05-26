// server/routes/admin.js - 管理員專用路由
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  requireAdmin, 
  requireSuperAdmin, 
  requirePermission, 
  logAdminAction,
  PERMISSIONS 
} = require('../middleware/permissions');
const { getMongoDatabase } = require('../database/mongodb');

const db = getMongoDatabase();

// ================================
// 管理員儀表板
// ================================

// 獲取系統統計數據
router.get('/dashboard/stats', 
  auth, 
  requirePermission(PERMISSIONS.ANALYTICS_READ), 
  async (req, res) => {
    try {
      console.log(`管理員 ${req.user.name} 正在查看系統統計`);
      
      const stats = await db.getSystemStats();
      
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('獲取系統統計失敗:', error);
      res.status(500).json({
        error: '獲取系統統計失敗',
        message: error.message
      });
    }
  }
);

// ================================
// 用戶管理
// ================================

// 獲取所有用戶列表
router.get('/users', 
  auth, 
  requirePermission(PERMISSIONS.USERS_READ),
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        role, 
        search, 
        isActive 
      } = req.query;
      
      console.log(`管理員 ${req.user.name} 正在查看用戶列表`);
      
      const result = await db.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        role,
        search,
        isActive: isActive !== undefined ? isActive === 'true' : undefined
      });
      
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
      
    } catch (error) {
      console.error('獲取用戶列表失敗:', error);
      res.status(500).json({
        error: '獲取用戶列表失敗',
        message: error.message
      });
    }
  }
);

// 獲取單一用戶詳情
router.get('/users/:userId', 
  auth, 
  requirePermission(PERMISSIONS.USERS_READ),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      console.log(`管理員 ${req.user.name} 正在查看用戶: ${userId}`);
      
      const user = await db.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          error: '找不到該用戶'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
      
    } catch (error) {
      console.error('獲取用戶詳情失敗:', error);
      res.status(500).json({
        error: '獲取用戶詳情失敗',
        message: error.message
      });
    }
  }
);

// 更新用戶角色
router.put('/users/:userId/role', 
  auth, 
  requirePermission(PERMISSIONS.USERS_WRITE),
  logAdminAction('update_user_role'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      // 驗證角色是否有效
      const validRoles = ['user', 'agent', 'admin', 'super_admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: '無效的角色',
          validRoles
        });
      }
      
      // 只有超級管理員可以設定超級管理員角色
      if (role === 'super_admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({
          error: '只有超級管理員可以設定超級管理員角色'
        });
      }
      
      console.log(`管理員 ${req.user.name} 正在更新用戶 ${userId} 角色為: ${role}`);
      
      const result = await db.updateUserRole(userId, role);
      
      res.json({
        success: true,
        message: '用戶角色已更新',
        data: result
      });
      
    } catch (error) {
      console.error('更新用戶角色失敗:', error);
      res.status(500).json({
        error: '更新用戶角色失敗',
        message: error.message
      });
    }
  }
);

// 禁用/啟用用戶
router.put('/users/:userId/status', 
  auth, 
  requirePermission(PERMISSIONS.USERS_WRITE),
  logAdminAction('toggle_user_status'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      
      // 不能禁用自己
      if (userId === req.user.userId) {
        return res.status(400).json({
          error: '不能禁用自己的帳號'
        });
      }
      
      console.log(`管理員 ${req.user.name} 正在${isActive ? '啟用' : '禁用'}用戶: ${userId}`);
      
      const result = await db.toggleUserStatus(userId, isActive);
      
      res.json({
        success: true,
        message: `用戶已${isActive ? '啟用' : '禁用'}`,
        data: result
      });
      
    } catch (error) {
      console.error('更新用戶狀態失敗:', error);
      res.status(500).json({
        error: '更新用戶狀態失敗',
        message: error.message
      });
    }
  }
);

// ================================
// 聯絡申請管理
// ================================

// 獲取所有聯絡申請
router.get('/contacts', 
  auth, 
  requirePermission(PERMISSIONS.CONTACTS_READ),
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        dateFrom, 
        dateTo, 
        search 
      } = req.query;
      
      console.log(`管理員 ${req.user.name} 正在查看聯絡申請列表`);
      
      const result = await db.getAllContactRequests({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        dateFrom,
        dateTo,
        search
      });
      
      res.json({
        success: true,
        data: result.requests,
        pagination: result.pagination
      });
      
    } catch (error) {
      console.error('獲取聯絡申請列表失敗:', error);
      res.status(500).json({
        error: '獲取聯絡申請列表失敗',
        message: error.message
      });
    }
  }
);

// 更新聯絡申請狀態
router.put('/contacts/:requestId', 
  auth, 
  requirePermission(PERMISSIONS.CONTACTS_WRITE),
  logAdminAction('update_contact_request'),
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status, notes, assignedTo } = req.body;
      
      // 驗證狀態是否有效
      const validStatuses = ['pending', 'contacted', 'in_progress', 'resolved', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: '無效的狀態',
          validStatuses
        });
      }
      
      console.log(`管理員 ${req.user.name} 正在更新聯絡申請 ${requestId}`);
      
      const updates = {
        status,
        ...(notes && { adminNotes: notes }),
        ...(assignedTo && { assignedTo })
      };
      
      const result = await db.adminUpdateContactRequest(requestId, updates, req.user.userId);
      
      res.json({
        success: true,
        message: '聯絡申請已更新',
        data: result
      });
      
    } catch (error) {
      console.error('更新聯絡申請失敗:', error);
      res.status(500).json({
        error: '更新聯絡申請失敗',
        message: error.message
      });
    }
  }
);

// ================================
// 角色管理
// ================================

// 獲取所有角色
router.get('/roles', 
  auth, 
  requirePermission(PERMISSIONS.ROLES_READ),
  async (req, res) => {
    try {
      console.log(`管理員 ${req.user.name} 正在查看角色列表`);
      
      const roles = await db.getAllRoles();
      
      res.json({
        success: true,
        data: roles
      });
      
    } catch (error) {
      console.error('獲取角色列表失敗:', error);
      res.status(500).json({
        error: '獲取角色列表失敗',
        message: error.message
      });
    }
  }
);

// ================================
// 管理員操作日誌
// ================================

// 獲取管理員操作日誌
router.get('/logs', 
  auth, 
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 50, 
        adminUserId, 
        action 
      } = req.query;
      
      console.log(`超級管理員 ${req.user.name} 正在查看操作日誌`);
      
      const result = await db.getAdminLogs({
        page: parseInt(page),
        limit: parseInt(limit),
        adminUserId,
        action
      });
      
      res.json({
        success: true,
        data: result.logs,
        pagination: result.pagination
      });
      
    } catch (error) {
      console.error('獲取操作日誌失敗:', error);
      res.status(500).json({
        error: '獲取操作日誌失敗',
        message: error.message
      });
    }
  }
);

// ================================
// 系統資訊
// ================================

// 獲取當前用戶的管理員資訊
router.get('/me', 
  auth, 
  requireAdmin,
  async (req, res) => {
    try {
      const user = await db.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          error: '用戶不存在'
        });
      }
      
      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          picture: user.picture,
          role: user.role,
          permissions: user.permissions,
          lastLogin: user.lastLogin
        }
      });
      
    } catch (error) {
      console.error('獲取管理員資訊失敗:', error);
      res.status(500).json({
        error: '獲取管理員資訊失敗',
        message: error.message
      });
    }
  }
);

module.exports = router;