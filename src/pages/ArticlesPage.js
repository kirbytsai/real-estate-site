// src/pages/ArticlesPage.js
import React, { useEffect, useState } from 'react';
import { useArticleContext } from '../context/ArticleContext';
import ArticleCard from '../components/articles/ArticleCard'; // 添加 ArticleCard 導入
import axios from 'axios';

const ArticlesPage = () => {
  const { 
    articles, 
    loading, 
    fetchArticles, 
    setCategoryFilter, 
    setTagFilter,
    filters 
  } = useArticleContext();
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 文章分類列表
  const categories = [
    '市場分析', 
    '購屋指南', 
    '投資建議', 
    '區域介紹'
  ];

  // 在 ArticlesPage.js 的 useEffect 中
  useEffect(() => {
    let isMounted = true; // 跟踪組件是否仍然掛載
    
    const loadArticles = async (retryCount = 0) => {
      try {
        console.log('開始載入文章...');
        await fetchArticles();
        
        // 只有在組件仍然掛載時才記錄日誌
        if (isMounted) {
          // 我們不在這裡引用 articles，而是在渲染階段使用它
          console.log('文章載入完成');
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Failed to fetch articles:', err);
        
        if (err.response?.status === 401 && retryCount < 2) {
          console.log(`Retry attempt ${retryCount + 1}...`);
          
          const token = localStorage.getItem('token');
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setTimeout(() => loadArticles(retryCount + 1), 500);
          } else {
            setError('您需要登入後才能訪問此頁面');
          }
        } else {
          setError('載入文章失敗，請稍後再試');
              }
            }
          };
          
          loadArticles();
          
          // 清理函數
          return () => {
            isMounted = false;
          };
        }, [fetchArticles]); // 只依賴 fetchArticles

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-gray-600">載入文章中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">載入文章時出現錯誤</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          重新載入
        </button>
      </div>
    );
  }

  // 篩選邏輯
  const filteredArticles = articles.filter(article => {
    const categoryMatch = !filters.category || article.category === filters.category;
    const tagMatch = !filters.tag || article.tags.includes(filters.tag);
    return categoryMatch && tagMatch;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* 頁面標題區塊 */}
      <div className="relative bg-gradient-to-r from-secondary-700 to-secondary-900 py-16 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-pattern"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div data-aos="fade-up">
            <h1 className="text-4xl font-bold text-white text-center mb-4">
              房地產知識專欄
            </h1>
            <p className="text-white/80 text-center max-w-2xl mx-auto">
              分享最新的房地產市場趨勢、投資策略和購屋知識
            </p>
          </div>
        </div>
        
        {/* 波浪底部 */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="fill-white">
            <path d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,21.3C840,11,960,21,1080,32C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"></path>
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        {/* 篩選器 */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-12" data-aos="fade-up">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">文章篩選</h2>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg flex items-center hover:bg-secondary-200 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21v-7m0 0V5a2 2 0 012-2h12a2 2 0 012 2v9m-14 0h14"></path>
                <path d="M9 21h6"></path>
              </svg>
              {isFilterOpen ? '收起篩選' : '展開篩選'}
            </button>
          </div>
          
          {isFilterOpen && (
            <div className="mt-6 grid md:grid-cols-2 gap-6" data-aos="fade-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文章分類
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">全部分類</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文章標籤
                </label>
                <input
                  type="text"
                  value={filters.tag}
                  onChange={(e) => setTagFilter(e.target.value)}
                  placeholder="輸入標籤"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* 文章列表 */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              找不到符合條件的文章
            </h2>
            <p className="text-gray-600">請調整搜尋條件並重新嘗試</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <div key={article.id || index} data-aos="fade-up" data-aos-delay={index * 100}>
                {/* 添加文章卡片的渲染 */}
                <ArticleCard article={article} />
                {/* 臨時檢查以診斷問題 */}
                {console.log('渲染文章:', article)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;