import React, { useState, useEffect } from 'react';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../properties/PropertyCard';

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const properties = await propertyService.getFeaturedProperties();
        setFeaturedProperties(properties);
        setLoading(false);
      } catch (error) {
        console.error('載入特色房源失敗', error);
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
            <span className="sr-only">載入中...</span>
          </div>
          <p className="mt-4 text-gray-600">房源資料載入中...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* 背景裝飾 */}
      <div className="absolute top-0 right-0 w-full h-72 bg-gradient-to-br from-primary-50 to-transparent opacity-70"></div>
      
      {/* 幾何裝飾元素 */}
      <div className="absolute -top-20 left-1/3 w-64 h-64 border border-primary-200 rounded-full opacity-30"></div>
      <div className="absolute top-40 left-1/4 w-32 h-32 border border-primary-200 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 right-20 w-40 h-40 bg-primary-50 rounded-full opacity-40 blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">精選推薦</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            精選優質房源
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            為您精心挑選最新、最優質的房源，助您找到心目中的理想居所
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* 格狀背景裝飾 */}
          <div className="absolute inset-0 grid grid-cols-3 gap-8 pointer-events-none">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-full border-l-2 border-dashed border-gray-100"></div>
            ))}
          </div>
          
          {featuredProperties.map((property, index) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              index={index}
            />
          ))}
        </div>

        {/* 查看更多房源按鈕 */}
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="300">
          <a
            href="/properties"
            className="btn btn-outline relative overflow-hidden group"
          >
            <span className="relative z-10">探索更多房源</span>
            <span className="absolute left-0 top-0 w-0 h-full bg-primary-500 transition-all duration-300 group-hover:w-full -z-0"></span>
            <span className="absolute left-0 top-0 w-0 h-full bg-primary-600 transition-all duration-500 group-hover:w-full delay-75 -z-0"></span>
            <span className="absolute left-0 top-0 w-full h-full bg-transparent transition-colors duration-300 group-hover:text-white z-0"></span>
          </a>
        </div>
      </div>
      
      {/* 底部裝飾波浪 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg className="fill-gray-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
          <path d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,37.3C1120,21,1280,11,1360,5.3L1440,0L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default FeaturedProperties;