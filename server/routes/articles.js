// server/routes/articles.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// 模擬文章數據
const articles = [
  {
    id: 1,
    title: '台北房市2024年趨勢解析',
    author: '房地產專家',
    publishDate: '2024-01-15',
    category: '市場分析',
    tags: ['房地產', '投資', '台北'],
    coverImage: '/images/articles/article1.jpg',
    summary: '深入分析2024年台北房地產市場的發展趨勢和投資機會。',
    content: `
## 台北房市2024年展望

2024年，台北房地產市場預計將呈現以下特點：

1. **價格趨勢**
   - 預計整體房價將保持穩定
   - 優質地段的房產仍具有投資價值

2. **市場動能**
   - 青年首購需求持續
   - 高品質、交通便利的房源最受歡迎

3. **投資建議**
   - 關注捷運沿線房源
   - 選擇具升值潛力的區域
    `
  },
  {
    id: 2,
    title: '如何選擇適合自住的房地產',
    author: '置業顧問',
    publishDate: '2024-02-01',
    category: '購屋指南',
    tags: ['自住', '購屋', '建議'],
    coverImage: '/images/articles/article2.jpg',
    summary: '專業建議幫助您找到理想的自住房產。',
    content: `
## 自住房地產選擇指南

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
   - 考慮長期居住成本
    `
  },
  {
    id: 3,
    title: '2024年房地產投資策略',
    author: '投資專家',
    publishDate: '2024-03-10',
    category: '投資建議',
    tags: ['房地產', '投資', '策略'],
    coverImage: '/images/articles/article3.jpg',
    summary: '全面解析2024年房地產投資的機會與風險。',
    content: `
## 2024年房地產投資策略

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
   - 預留資金緩衝
    `
  }
];

// 獲取所有文章 (需要身份驗證)
router.get('/', auth, (req, res) => {
  console.log('獲取所有文章，用戶:', req.user);
  res.json(articles);
});

// 獲取單一文章 (需要身份驗證)
router.get('/:id', auth, (req, res) => {
  console.log(`獲取ID為${req.params.id}的文章，用戶:`, req.user);
  const article = articles.find(a => a.id === parseInt(req.params.id));
  
  if (!article) {
    return res.status(404).json({ message: '找不到文章' });
  }
  
  res.json(article);
});

module.exports = router;