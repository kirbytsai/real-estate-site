// src/components/articles/ArticleCard.js
import React from 'react';

const ArticleCard = ({ article }) => {
  // 基本檢查，確保 article 存在
  if (!article) {
    console.error('ArticleCard 收到無效的文章數據');
    return (
      <div className="bg-white rounded-xl shadow-md p-5 text-center">
        <p className="text-red-500">無法顯示文章</p>
      </div>
    );
  }

  // 設置默認圖片，以防 coverImage 缺失
  const coverImage = article.coverImage || '/placeholder-article.jpg';
  
  // 確保 tags 是數組
  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group hover:-translate-y-2">
      {/* 添加臨時邊框，方便檢查卡片是否正確渲染 */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={coverImage} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            console.error('文章圖片載入失敗:', article.title);
            e.target.src = '/placeholder-article.jpg'; // 設置備用圖片
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* 文章分類標籤 */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            {article.category || '未分類'}
          </span>
        </div>
      </div>

      {/* 文章資訊 */}
      <div className="p-5">
        {/* 文章標題 */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
          {article.title || '無標題'}
        </h3>

        {/* 文章摘要 */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.summary || '無摘要'}
        </p>

        {/* 作者和日期 */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{article.author || '匿名'}</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{article.publishDate || '無日期'}</span>
          </div>
        </div>

        {/* 標籤 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={`${tag}-${index}`} 
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 閱讀更多按鈕 */}
        <a 
          href={`/article/${article.id}`}
          className="block w-full text-center py-2 border-t border-gray-100 pt-4 text-primary-600 font-medium hover:text-primary-800 transition-colors group-hover:border-primary-100"
        >
          <span className="relative inline-block transition-all duration-300 group-hover:pl-2">
            閱讀全文
            <svg className="h-4 w-4 inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;