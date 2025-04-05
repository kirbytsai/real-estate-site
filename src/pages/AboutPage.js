import React from 'react';

const AboutUsPage = () => {
  // 團隊成員資料
  const teamMembers = [
    {
      name: '張志偉',
      position: '創辦人兼執行長',
      description: '擁有超過15年房地產投資與管理經驗，專精於台北市精華地區物業評估與投資策略。曾成功帶領團隊完成多項大型不動產開發案，對市場趨勢有獨到見解。',
      image: '/images/team/member1.jpg'
    },
    {
      name: '林美玲',
      position: '首席銷售總監',
      description: '10年以上高端物業銷售經驗，擅長客戶需求分析與精準媒合。連續三年銷售業績突破10億，建立了廣泛的高資產客戶網絡，致力於提供客製化置產方案。',
      image: '/images/team/member2.jpg'
    },
    {
      name: '王建宏',
      position: '投資顧問總監',
      description: '具備財務分析與不動產估價專業背景，精通投資組合規劃與風險管理。協助客戶優化房地產投資策略，實現資產保值增值的目標。',
      image: '/images/team/member3.jpg'
    },
    {
      name: '陳雅琪',
      position: '客戶關係經理',
      description: '專注於提供卓越的客戶體驗，確保每位客戶在購房過程中得到全面支持。建立了完善的售後服務體系，使客戶滿意度達到業界領先水平。',
      image: '/images/team/member4.jpg'
    }
  ];

  // 公司里程碑
  const milestones = [
    {
      year: '2010',
      title: '公司成立',
      description: '在台北市中心成立首家辦公室，開始提供專業房地產諮詢服務。'
    },
    {
      year: '2014',
      title: '業務擴展',
      description: '拓展至新北市場，並開始發展高端物業銷售業務，業務範圍涵蓋整個北台灣。'
    },
    {
      year: '2017',
      title: '數位化轉型',
      description: '導入先進的房地產數據分析系統，提升市場預測準確度，為客戶提供更精準的投資建議。'
    },
    {
      year: '2020',
      title: '獲得行業認可',
      description: '榮獲「台灣房地產服務金獎」，被評為年度最具創新力房地產顧問公司。'
    },
    {
      year: '2023',
      title: '拓展國際業務',
      description: '與多家國際房地產機構建立合作關係，開始為客戶提供海外不動產投資服務。'
    }
  ];

  // 核心價值
  const values = [
    {
      title: '誠信透明',
      icon: (
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      description: '我們堅持誠實經營，確保交易流程透明化，讓客戶安心信賴。'
    },
    {
      title: '專業卓越',
      icon: (
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      description: '持續學習與精進，掌握市場脈動，提供專業的置產建議與服務。'
    },
    {
      title: '客戶至上',
      icon: (
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      description: '深入了解每位客戶的需求，提供個人化服務，創造最大客戶價值。'
    },
    {
      title: '創新前瞻',
      icon: (
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      description: '擁抱科技與創新思維，持續改進服務模式，引領行業發展趨勢。'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 頂部橫幅 */}
      <div className="relative bg-cover bg-center h-96 md:h-[70vh]" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6" data-aos="fade-up">
            <div className="max-w-3xl text-white relative">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">專業團隊，卓越服務</h1>
              <p className="text-xl text-white/90 mb-8">
                致力於提供最專業的房地產諮詢與置業服務，<br />
                成為您信賴的房地產夥伴
              </p>
              <div className="w-20 h-1.5 bg-primary-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="fill-white">
            <path d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,74.7C672,75,768,53,864,48C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"></path>
          </svg>
        </div>
      </div>
      
      {/* 公司簡介 */}
      <section className="py-20" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">我們的故事</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">關於我們</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              作為一家專業的房地產顧問公司，我們擁有超過十年的行業經驗，專注於台灣北部地區的住宅與商業不動產市場。我們的團隊由經驗豐富的不動產專家組成，致力於為客戶提供全方位的房地產服務。
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              我們深信，每一次房產交易都是客戶人生中的重要決策。因此，我們秉持誠信透明的原則，提供客觀專業的市場分析與建議，協助客戶做出明智的置產決策，實現資產增值的目標。無論您是首次購屋、換屋升級，還是進行房地產投資，我們都能為您提供最適合的解決方案。
            </p>
          </div>
        </div>
      </section>
      
      {/* 核心價值 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">核心理念</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">我們的核心價值</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              這些價值觀引導我們的每一個決策和行動，確保我們始終為客戶提供最優質的服務。
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-primary-500 mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 發展歷程 */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">成長歷程</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">公司發展里程碑</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              回顧我們的發展歷程，見證我們如何從小型顧問公司成長為行業領導者。
            </p>
          </div>
          
          <div className="relative">
            {/* 時間線 */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-primary-100 transform md:translate-x-0"></div>
            
            <div className="relative space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row md:items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all">
                      <span className="inline-block text-3xl font-bold text-primary-600 mb-2">{milestone.year}</span>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center justify-center relative">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-lg z-10">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* 團隊介紹 */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">專業團隊</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">認識我們的團隊</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              我們擁有業界最專業的團隊，每位成員都具備豐富的不動產經驗與專業知識。
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-4">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center space-x-4">
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 服務區域 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right">
                <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">服務區域</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">我們的服務範圍</h2>
                <div className="w-20 h-1 bg-primary-500 mb-8"></div>
                <p className="text-lg text-gray-600 mb-6">
                  我們的服務主要覆蓋大台北地區，包括台北市各區域以及新北市重點發展區，為客戶提供全方位的房地產諮詢與交易服務。
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-primary-500 mr-3 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                      <h3 className="font-bold mb-1">台北市核心區域</h3>
                      <p className="text-gray-600">信義區、大安區、中山區、松山區、南港區等台北市主要行政區</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-primary-500 mr-3 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                      <h3 className="font-bold mb-1">新北市重點區域</h3>
                      <p className="text-gray-600">板橋區、新板特區、新莊區、三重區、林口區等發展迅速區域</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-primary-500 mr-3 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                      <h3 className="font-bold mb-1">特色區域</h3>
                      <p className="text-gray-600">淡水、陽明山、北投等具有特色的居住區域</p>
                    </div>
                  </div>
                </div>
                
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center">
                  詳細了解我們的服務
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              
              <div className="relative" data-aos="fade-left">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-60 h-60 bg-primary-50 rounded-full opacity-50 blur-xl"></div>
                
                <div className="relative">
                  <div className="bg-white rounded-xl overflow-hidden shadow-xl relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" 
                      alt="台北市都市風貌" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 裝飾元素 */}
                  <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden shadow-lg z-0 hidden lg:block">
                    <img 
                      src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                      alt="都市街景" 
                      className="w-48 h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 聯絡部分 */}
      <section className="py-20 bg-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-700 rounded-full transform -translate-x-1/3 translate-y-1/3 opacity-30 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">希望了解更多？</h2>
            <p className="text-xl text-white/90 mb-8">
              無論您有任何房地產相關問題，我們都樂意為您解答。
              <br />立即與我們聯繫，開始您的置業之旅。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                聯絡我們
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all">
                預約諮詢
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;