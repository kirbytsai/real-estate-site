import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'prismjs/themes/prism-okaidia.css';
import Prism from 'prismjs';

const ArticleDetailPage = () => {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 從 URL 獲取文章 ID
    const pathParts = window.location.pathname.split('/');
    const articleId = pathParts[pathParts.length - 1];
    
    const fetchArticle = async () => {
      try {
        // 這裡應該調用實際的 API
        // 模擬從 API 獲取資料
        const articleData = {
          id: articleId,
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
        };
        
        setCurrentArticle(articleData);
        setLoading(false);
      } catch (error) {
        console.error('載入文章失敗', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, []);

  useEffect(() => {
    if (currentArticle) {
      Prism.highlightAll();
    }
  }, [currentArticle]);

  if (loading || !currentArticle) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern">
      {/* 文章頭部橫幅 */}
      <div className="relative h-80 md:h-96 bg-cover bg-center" style={{
        backgroundImage: `url(${currentArticle.coverImage})`
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-white">
            <path d="M0,64L80,64C160,64,320,64,480,58.7C640,53,800,43,960,42.7C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
        
        {/* 文章基本信息 */}
        <div className="container mx-auto px-6 relative h-full flex items-end pb-20">
          <div className="text-white" data-aos="fade-up">
            <div className="mb-4">
              <span className="bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                {currentArticle.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {currentArticle.title}
            </h1>
            <div className="flex flex-wrap items-center text-white/80 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{currentArticle.author}</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{currentArticle.publishDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl -mt-6 relative">
        {/* 文章內容卡片 */}
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-12" data-aos="fade-up">
          {/* 文章內容 */}
          <article className="prose prose-lg prose-primary max-w-none">
            <ReactMarkdown>
              {currentArticle.content}
            </ReactMarkdown>
          </article>
        </div>
        
        {/* 文章標籤與分享 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-3">相關標籤</h3>
              <div className="flex flex-wrap gap-2">
                {currentArticle.tags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full hover:bg-primary-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4 md:pt-0 md:border-t-0">
              <h3 className="text-lg font-semibold mb-3">分享文章</h3>
              <div className="flex space-x-4">
                <button className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-blue-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6z"/>
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-blue-700 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 相關文章推薦 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12" data-aos="fade-up">
          <h3 className="text-xl font-bold mb-6 text-center">推薦閱讀</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-4 flex hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <img src="/images/article-2.jpg" alt="推薦文章" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold hover:text-primary-600 transition-colors">2023年台北房市趨勢分析</h4>
                <p className="text-sm text-gray-500 mt-1">掌握最新市場動態，了解投資機會</p>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-800 mt-2 inline-block">閱讀全文</a>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 flex hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <img src="/images/article-1.jpg" alt="推薦文章" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold hover:text-primary-600 transition-colors">如何選擇合適的房貸方案</h4>
                <p className="text-sm text-gray-500 mt-1">專業建議幫助您選擇最適合的房貸</p>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-800 mt-2 inline-block">閱讀全文</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* 評論區域 */}
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
          <h3 className="text-xl font-bold mb-6">文章評論</h3>
          
          <div className="mb-8">
            <div className="flex mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                <svg className="h-full w-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-grow">
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="分享您的想法..."
                ></textarea>
                <button className="mt-2 px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  發表評論
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <p className="text-center text-gray-500">登入後參與討論</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;