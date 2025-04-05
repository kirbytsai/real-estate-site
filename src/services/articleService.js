// src/services/articleService.js

// 模擬文章資料
const mockArticles = [
    {
      id: 1,
      title: '台北房市2024年趨勢解析',
      author: '房地產專家',
      publishDate: '2024-01-15',
      category: '市場分析',
      tags: ['房地產', '投資', '台北'],
      coverImage: '/images/article-1.jpg',
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
      coverImage: '/images/article-2.jpg',
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
    }
  ];
  
  // 文章服務
  export const articleService = {
    // 獲取所有文章
    async getAllArticles() {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockArticles;
    },
  
    // 依ID獲取單一文章
    async getArticleById(id) {
      return mockArticles.find(article => article.id === Number(id));
    },
  
    // 依分類獲取文章
    async getArticlesByCategory(category) {
      return mockArticles.filter(article => article.category === category);
    },
  
    // 依標籤獲取文章
    async getArticlesByTag(tag) {
      return mockArticles.filter(article => article.tags.includes(tag));
    }
  };