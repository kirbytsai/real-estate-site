import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* 背景圖片 - 使用 CSS 背景色作為備用 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-blue-800"
        style={{
          backgroundImage: 'linear-gradient(to right, #4a5568, #2d3748)'
        }}
      />
      
      {/* 背景疊加漸層 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
      
      {/* 內容 */}
      <div className="container relative mx-auto h-full px-6 flex items-center">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            尋找您理想的
            <br />
            <span className="text-primary-300">住宅夢想</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-10 text-gray-100">
            專業的房地產平台，幫助您找到最適合的居住空間，實現美好生活。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn btn-primary">
              立即探索房源
            </button>
            <button className="btn btn-outline text-white border-white hover:bg-white/10">
              了解更多
            </button>
          </div>
          
          {/* 統計數據 */}
          <div className="mt-12 md:mt-16 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-300">500+</div>
              <div className="text-sm text-gray-300 mt-1">優質房源</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-300">3K+</div>
              <div className="text-sm text-gray-300 mt-1">滿意客戶</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-300">15+</div>
              <div className="text-sm text-gray-300 mt-1">服務年限</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 波浪底部裝飾 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
          <path d="M0,64L80,53.3C160,43,320,21,480,32C640,43,800,85,960,85.3C1120,85,1280,43,1360,21.3L1440,0L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
        </svg>
      </div>
    </div>
  );
};

export default HeroBanner;