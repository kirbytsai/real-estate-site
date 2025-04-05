import React from 'react';

const ServicesSection = () => {
  const services = [
    {
      icon: (
        <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      title: '優質房源',
      description: '嚴格篩選的高品質房源，確保每個物件都符合您的期望與需求。'
    },
    {
      icon: (
        <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
      title: '即時通知',
      description: '第一時間獲取最新房源資訊，不錯過任何理想的居住機會。'
    },
    {
      icon: (
        <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: '市場分析',
      description: '深入的市場趨勢分析，協助您做出更明智的房地產投資決策。'
    },
    {
      icon: (
        <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: '專業團隊',
      description: '經驗豐富的專業團隊，提供完整的房地產諮詢與售後服務。'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-100 rounded-full opacity-50 blur-3xl"></div>
      
      {/* 幾何裝飾元素 */}
      <div className="absolute top-40 left-10 w-20 h-20 border-4 border-primary-200 rounded-lg rotate-12 opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-accent-200 rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20" data-aos="fade-up">
          <h6 className="text-primary-500 font-semibold mb-3">我們的優勢</h6>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">為什麼選擇我們</h2>
          <p className="text-secondary-500 max-w-2xl mx-auto">
            我們致力於提供最優質的房地產服務，讓您的置產過程輕鬆愉快。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-lg group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center relative z-10"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="text-primary-500 mx-auto mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-500">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-secondary-500">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="400">
          <a href="/about" className="btn btn-primary inline-flex items-center">
            瞭解更多服務
            <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;