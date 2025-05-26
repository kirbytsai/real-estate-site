// server/routes/articles.js - MongoDB 版本
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMongoDatabase } = require('../database/mongodb');

const db = getMongoDatabase();

// 獲取所有文章 (需要身份驗證)
router.get('/', auth, async (req, res) => {
  try {
    console.log('獲取所有文章，用戶:', req.user);
    
    const articles = await db.getAllArticles();
    
    console.log(`✅ 成功獲取 ${articles.length} 篇文章`);
    res.json(articles);
    
  } catch (error) {
    console.error('獲取文章失敗:', error);
    res.status(500).json({
      message: '獲取文章失敗',
      error: error.message
    });
  }
});

// 獲取單一文章 (需要身份驗證)
router.get('/:id', auth, async (req, res) => {
  try {
    const articleId = req.params.id;
    console.log(`獲取ID為${articleId}的文章，用戶:`, req.user);
    
    const article = await db.getArticleById(articleId);
    
    if (!article) {
      return res.status(404).json({ 
        message: '找不到文章',
        articleId: articleId 
      });
    }
    
    console.log(`✅ 成功獲取文章: ${article.title}`);
    res.json(article);
    
  } catch (error) {
    console.error('獲取文章詳情失敗:', error);
    res.status(500).json({
      message: '獲取文章詳情失敗',
      error: error.message
    });
  }
});

module.exports = router;