// server/database/mongodb.js - 升級版 (支援角色系統)
const { MongoClient } = require('mongodb');

class MongoDatabase {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return this.db;

    try {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI 環境變數未設定');
      }

      console.log('正在連接 MongoDB...');
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('real-estate');
      this.isConnected = true;
      console.log('✅ MongoDB 連線成功');
      
      // 初始化資料
      await this.initializeArticles();
      await this.initializeRoles();
      
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB 連線失敗:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('MongoDB 連線已關閉');
    }
  }

  // ================================
  // 用戶與角色管理
  // ================================

  // 創建或更新用戶（包含角色資訊）
  async createOrUpdateUser(userData) {
    const db = await this.connect();
    const collection = db.collection('users');
    
    const userDocument = {
      id: userData.id,
      name: userData.name,
      picture: userData.picture,
      lineUserId: userData.lineUserId,
      email: userData.email,
      role: userData.role || 'user', // 預設為一般用戶
      permissions: await this.getRolePermissions(userData.role || 'user'),
      isActive: true,
      lastLogin: new Date(),
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date()
    };

    console.log('正在創建/更新用戶:', userDocument.name, '角色:', userDocument.role);
    
    const result = await collection.replaceOne(
      { id: userData.id },
      userDocument,
      { upsert: true }
    );

    return userDocument;
  }

  // 獲取用戶資訊（包含角色）
  async getUserById(userId) {
    const db = await this.connect();
    const collection = db.collection('users');
    
    const user = await collection.findOne({ id: userId });
    return user;
  }

  // 獲取所有用戶（管理員功能）
  async getAllUsers(options = {}) {
    const db = await this.connect();
    const collection = db.collection('users');
    
    const { 
      page = 1, 
      limit = 20, 
      role, 
      search,
      isActive 
    } = options;
    
    let filter = {};
    
    // 角色篩選
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    // 活躍狀態篩選
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    // 搜尋功能
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter)
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // 更新用戶角色
  async updateUserRole(userId, newRole) {
    const db = await this.connect();
    const collection = db.collection('users');
    
    const permissions = await this.getRolePermissions(newRole);
    
    console.log(`正在更新用戶 ${userId} 角色為: ${newRole}`);
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $set: { 
          role: newRole,
          permissions: permissions,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('找不到該用戶');
    }

    return { userId, newRole, permissions };
  }

  // 禁用/啟用用戶
  async toggleUserStatus(userId, isActive) {
    const db = await this.connect();
    const collection = db.collection('users');
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $set: { 
          isActive: isActive,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('找不到該用戶');
    }

    return { userId, isActive };
  }

  // ================================
  // 角色與權限系統
  // ================================

  // 初始化角色系統
  async initializeRoles() {
    const db = await this.connect();
    const collection = db.collection('roles');
    
    const count = await collection.countDocuments();
    
    if (count === 0) {
      console.log('正在初始化角色系統...');
      
      const roles = [
        {
          name: 'super_admin',
          displayName: '超級管理員',
          description: '擁有所有系統權限',
          permissions: [
            'users.read', 'users.write', 'users.delete',
            'roles.read', 'roles.write', 'roles.delete',
            'contacts.read', 'contacts.write', 'contacts.delete',
            'articles.read', 'articles.write', 'articles.delete',
            'analytics.read', 'system.settings'
          ],
          level: 100
        },
        {
          name: 'admin',
          displayName: '管理員',
          description: '管理聯絡申請和文章',
          permissions: [
            'users.read',
            'contacts.read', 'contacts.write',
            'articles.read', 'articles.write',
            'analytics.read'
          ],
          level: 80
        },
        {
          name: 'agent',
          displayName: '業務專員',
          description: '處理客戶聯絡申請',
          permissions: [
            'contacts.read', 'contacts.write',
            'analytics.read'
          ],
          level: 60
        },
        {
          name: 'user',
          displayName: '一般用戶',
          description: '基本用戶權限',
          permissions: [
            'contacts.create', 'profile.read', 'profile.write'
          ],
          level: 10
        }
      ];

      await collection.insertMany(roles);
      console.log('✅ 角色系統初始化完成');
    }
  }

  // 獲取角色權限
  async getRolePermissions(roleName) {
    const db = await this.connect();
    const collection = db.collection('roles');
    
    const role = await collection.findOne({ name: roleName });
    return role ? role.permissions : [];
  }

  // 獲取所有角色
  async getAllRoles() {
    const db = await this.connect();
    const collection = db.collection('roles');
    
    const roles = await collection
      .find({})
      .sort({ level: -1 })
      .toArray();
    
    return roles;
  }

  // 檢查用戶權限
  async checkUserPermission(userId, permission) {
    const user = await this.getUserById(userId);
    
    if (!user || !user.isActive) {
      return false;
    }

    return user.permissions && user.permissions.includes(permission);
  }

  // ================================
  // 管理員專用 - 聯絡申請管理
  // ================================

  // 獲取所有聯絡申請（管理員視圖）
  async getAllContactRequests(options = {}) {
    const db = await this.connect();
    const collection = db.collection('contactRequests');
    
    const { 
      page = 1, 
      limit = 20, 
      status, 
      dateFrom, 
      dateTo,
      search 
    } = options;
    
    let filter = {};
    
    // 狀態篩選
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // 日期範圍篩選
    if (dateFrom || dateTo) {
      filter.submittedAt = {};
      if (dateFrom) filter.submittedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.submittedAt.$lte = new Date(dateTo);
    }
    
    // 搜尋功能
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { 'formData.name': { $regex: search, $options: 'i' } },
        { 'formData.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [requests, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter)
    ]);

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // 管理員更新聯絡申請狀態
  async adminUpdateContactRequest(requestId, updates, adminUserId) {
    const db = await this.connect();
    const collection = db.collection('contactRequests');
    
    const updateData = {
      ...updates,
      updatedAt: new Date(),
      updatedBy: adminUserId
    };

    console.log(`管理員 ${adminUserId} 正在更新申請 ${requestId}`);
    
    const result = await collection.updateOne(
      { id: parseInt(requestId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new Error('找不到該申請記錄');
    }

    // 記錄管理員操作
    await this.logAdminAction(adminUserId, 'update_contact', {
      requestId,
      updates
    });

    return { requestId, ...updateData };
  }

  // ================================
  // 數據分析功能
  // ================================

  // 獲取系統統計數據
  async getSystemStats() {
    const db = await this.connect();
    
    const [
      totalUsers,
      totalContacts,
      pendingContacts,
      contactsByStatus,
      recentUsers,
      contactTrends
    ] = await Promise.all([
      // 總用戶數
      db.collection('users').countDocuments(),
      
      // 總聯絡申請數
      db.collection('contactRequests').countDocuments(),
      
      // 待處理申請數
      db.collection('contactRequests').countDocuments({ status: 'pending' }),
      
      // 各狀態申請統計
      db.collection('contactRequests').aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray(),
      
      // 最近7天新用戶
      db.collection('users').countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      
      // 最近30天申請趨勢
      db.collection('contactRequests').aggregate([
        {
          $match: {
            submittedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()
    ]);

    return {
      summary: {
        totalUsers,
        totalContacts,
        pendingContacts,
        recentUsers
      },
      contactsByStatus: contactsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      contactTrends
    };
  }

  // ================================
  // 管理員操作日誌
  // ================================

  // 記錄管理員操作
  async logAdminAction(adminUserId, action, details = {}) {
    const db = await this.connect();
    const collection = db.collection('adminLogs');
    
    const logEntry = {
      adminUserId,
      action,
      details,
      timestamp: new Date(),
      ip: details.ip || null
    };

    await collection.insertOne(logEntry);
    return logEntry;
  }

  // 獲取管理員操作日誌
  async getAdminLogs(options = {}) {
    const db = await this.connect();
    const collection = db.collection('adminLogs');
    
    const { page = 1, limit = 50, adminUserId, action } = options;
    
    let filter = {};
    if (adminUserId) filter.adminUserId = adminUserId;
    if (action) filter.action = action;

    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter)
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // ================================
  // 原有的聯絡申請方法 (保持不變)
  // ================================

  async createContactRequest(requestData) {
    const db = await this.connect();
    const collection = db.collection('contactRequests');
    
    const document = {
      ...requestData,
      id: Date.now(),
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('正在儲存聯絡申請到 MongoDB...');
    const result = await collection.insertOne(document);
    console.log('✅ 聯絡申請已儲存，ID:', document.id);
    
    return { ...document, _id: result.insertedId };
  }

  async getContactRequestsByUser(userId) {
    const db = await this.connect();
    const collection = db.collection('contactRequests');
    
    console.log('正在獲取用戶聯絡記錄:', userId);
    const requests = await collection
      .find({ userId })
      .sort({ submittedAt: -1 })
      .toArray();
    
    console.log(`✅ 找到 ${requests.length} 筆聯絡記錄`);
    return requests;
  }

  async updateContactRequestStatus(requestId, userId, status, cancelReason = null) {
    const db = await this.connect();
    const collection = db.collection('contactRequests');
    
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = cancelReason;
    }

    console.log(`正在更新申請狀態: ${requestId} -> ${status}`);
    const result = await collection.updateOne(
      { id: parseInt(requestId), userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new Error('找不到該申請記錄');
    }

    console.log('✅ 申請狀態已更新');
    return { id: requestId, status, ...updateData };
  }

  // ================================
  // 原有的文章方法 (保持不變)
  // ================================

  async getAllArticles() {
    const db = await this.connect();
    const collection = db.collection('articles');
    
    console.log('正在獲取所有文章...');
    const articles = await collection
      .find({})
      .sort({ publishDate: -1 })
      .toArray();
    
    console.log(`✅ 找到 ${articles.length} 篇文章`);
    return articles;
  }

  async getArticleById(id) {
    const db = await this.connect();
    const collection = db.collection('articles');
    
    console.log('正在獲取文章:', id);
    const article = await collection.findOne({ id: parseInt(id) });
    
    if (article) {
      console.log('✅ 找到文章:', article.title);
    } else {
      console.log('❌ 找不到文章');
    }
    
    return article;
  }

  async initializeArticles() {
    const db = await this.connect();
    const collection = db.collection('articles');
    
    const count = await collection.countDocuments();
    console.log(`資料庫中有 ${count} 篇文章`);
    
    if (count === 0) {
      console.log('正在初始化文章資料...');
      const articles = [
        {
          id: 1,
          title: '台北房市2024年趨勢解析',
          author: '房地產專家',
          publishDate: '2024-01-15',
          category: '市場分析',
          tags: ['房地產', '投資', '台北'],
          coverImage: '/placeholder-article.jpg',
          summary: '深入分析2024年台北房地產市場的發展趨勢和投資機會。',
          content: `## 台北房市2024年展望\n\n2024年，台北房地產市場預計將呈現以下特點：\n\n1. **價格趨勢**\n   - 預計整體房價將保持穩定\n   - 優質地段的房產仍具有投資價值\n\n2. **市場動能**\n   - 青年首購需求持續\n   - 高品質、交通便利的房源最受歡迎\n\n3. **投資建議**\n   - 關注捷運沿線房源\n   - 選擇具升值潛力的區域`
        },
        {
          id: 2,
          title: '如何選擇適合自住的房地產',
          author: '置業顧問',
          publishDate: '2024-02-01',
          category: '購屋指南',
          tags: ['自住', '購屋', '建議'],
          coverImage: '/placeholder-article.jpg',
          summary: '專業建議幫助您找到理想的自住房產。',
          content: `## 自住房地產選擇指南\n\n選擇適合自住的房產需要考慮多個因素：\n\n1. **位置考量**\n   - 交通便利性\n   - 周邊生活機能\n   - 鄰近學校、醫院\n\n2. **房屋類型**\n   - 公寓\n   - 電梯大樓\n   - 透天厝\n\n3. **預算規劃**\n   - 了解自身負擔能力\n   - 考慮長期居住成本`
        },
        {
          id: 3,
          title: '2024年房地產投資策略',
          author: '投資專家',
          publishDate: '2024-03-10',
          category: '投資建議',
          tags: ['房地產', '投資', '策略'],
          coverImage: '/placeholder-article.jpg',
          summary: '全面解析2024年房地產投資的機會與風險。',
          content: `## 2024年房地產投資策略\n\n在當前市場環境下，投資房地產應考慮以下策略：\n\n1. **區域選擇**\n   - 新興發展區域\n   - 交通建設沿線區域\n   - 產業聚集區\n\n2. **物業類型**\n   - 小坪數住宅\n   - 商辦混合型物業\n   - 特殊用途不動產\n\n3. **風險管理**\n   - 分散投資組合\n   - 關注現金流\n   - 預留資金緩衝`
        }
      ];

      await collection.insertMany(articles);
      console.log('✅ 初始文章資料已插入 MongoDB');
    }
  }
}

// 單例模式
let mongoInstance = null;

function getMongoDatabase() {
  if (!mongoInstance) {
    mongoInstance = new MongoDatabase();
  }
  return mongoInstance;
}

module.exports = { getMongoDatabase };