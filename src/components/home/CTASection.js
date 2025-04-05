import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* 漸層背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
      
      {/* 裝飾元素 */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-8 border-white"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full border-8 border-white"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white"></div>
      </div>
      
      {/* 波浪效果 */}
      <div className="absolute top-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
          <path d="M0,0L40,0C80,0,160,0,240,16.7C320,33,400,67,480,83.3C560,100,640,100,720,83.3C800,67,880,33,960,16.7C1040,0,1120,0,1200,16.7C1280,33,1360,67,1400,83.3L1440,100L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            準備好開始您的置產之旅了嗎？
          </h2>
          <p className="text-xl mb-10 text-white/80 max-w-2xl mx-auto">
            我們的專業團隊隨時準備協助您找到最適合的房產，立即與我們聯繫，開啟您的置產之旅。
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl" data-aos="fade-up" data-aos-delay="100">
              <svg className="h-12 w-12 mx-auto mb-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">購屋諮詢</h3>
              <p className="text-white/70">提供專業購屋建議，協助您評估各項條件</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl" data-aos="fade-up" data-aos-delay="200">
              <svg className="h-12 w-12 mx-auto mb-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">專業團隊</h3>
              <p className="text-white/70">經驗豐富的顧問團隊，全程為您服務</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl" data-aos="fade-up" data-aos-delay="300">
              <svg className="h-12 w-12 mx-auto mb-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">完整流程</h3>
              <p className="text-white/70">從看屋到交屋，提供全方位支援與服務</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/contact" 
              className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              預約諮詢
            </a>
            <a 
              href="/properties"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              瀏覽房源
            </a>
          </div>
        </div>
      </div>
      
      {/* 底部波浪 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
          <path d="M0,100L40,90.7C80,81,160,63,240,53.3C320,44,400,44,480,50C560,56,640,69,720,74.7C800,81,880,81,960,69.3C1040,56,1120,31,1200,22.3C1280,13,1360,19,1400,22.3L1440,25L1440,100L1400,100C1360,100,1280,100,1200,100C1120,100,1040,100,960,100C880,100,800,100,720,100C640,100,560,100,480,100C400,100,320,100,240,100C160,100,80,100,40,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default CTASection;