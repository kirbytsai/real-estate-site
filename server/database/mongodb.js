// server/database/mongodb.js
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
      
      // 初始化文章資料
      await this.initializeArticles();
      
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

  // 聯絡申請相關方法
  async createContactRequest(requestData) {
    const db = await this.connect();
    const collection = db.collection('contactRequests');
    
    const document = {
      ...requestData,
      id: Date.now(), // 簡單的 ID 生成
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

  // 文章相關方法
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

  // 初始化文章資料
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
          content: `## 台北房市2024年展望

2024年，台北房地產市場預計將呈現以下特點：

1. **價格趨勢**
   - 預計整體房價將保持穩定
   - 優質地段的房產仍具有投資價值

2. **市場動能**
   - 青年首購需求持續
   - 高品質、交通便利的房源最受歡迎

3. **投資建議**
   - 關注捷運沿線房源
   - 選擇具升值潛力的區域`
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
          content: `## 自住房地產選擇指南

選擇適合自住的房產需要考慮多個因素：

1. **位置考量**
   - 交通便利性
   - 周邊生活機能
   - 鄰近學校、醫院

2. **房屋類型**
   - 公寓
   - 電梯大樓
   - 透天厝

3. **預算規劃**
   - 了解自身負擔能力
   - 考慮長期居住成本`
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
          content: `## 2024年房地產投資策略

在當前市場環境下，投資房地產應考慮以下策略：

1. **區域選擇**
   - 新興發展區域
   - 交通建設沿線區域
   - 產業聚集區

2. **物業類型**
   - 小坪數住宅
   - 商辦混合型物業
   - 特殊用途不動產

3. **風險管理**
   - 分散投資組合
   - 關注現金流
   - 預留資金緩衝`
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