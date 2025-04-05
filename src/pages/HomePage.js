import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import ServicesSection from '../components/home/ServicesSection'; // 新增這一行
import FeaturedProperties from '../components/home/FeaturedProperties';
import CTASection from '../components/home/CTASection';

const HomePage = () => {
  return (
    <div>
      {/* 首頁橫幅 */}
      <HeroBanner />

      {/* 服務特色區塊 */}
      <ServicesSection />

      {/* 精選房源 */}
      <FeaturedProperties />

      {/* 行動召喚區塊 */}
      <CTASection />
    
    </div>
  );
};

export default HomePage;