import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/properties/PropertyCard';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await propertyService.getAllProperties();
        const safeProperties = Array.isArray(result) ? result : [];
        setProperties(safeProperties);
        setLoading(false);
      } catch (error) {
        console.error('載入房源失敗', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">載入房源時發生錯誤</h2>
        <p className="text-gray-600 mt-4">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-pattern min-h-screen pb-20">
      {/* 頁面標題區塊 */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 py-16 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10 animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white/5 animate-float"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div data-aos="fade-up">
            <h1 className="text-4xl font-bold text-white text-center mb-4">
              探索精選房源
            </h1>
            <p className="text-white/80 text-center max-w-2xl mx-auto">
              瀏覽我們精心挑選的各類房源，找到您理想的居住空間
            </p>
          </div>
        </div>
        
        {/* 波浪底部 */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="fill-white">
            <path d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,74.7C672,75,768,53,864,48C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"></path>
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        {/* 搜尋篩選區塊 */}
     
        {/* 房源列表 */}
        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4" data-aos="fade-up">
              目前尚無房源
            </h2>
            <p className="text-gray-600" data-aos="fade-up" data-aos-delay="100">暫時沒有可供瀏覽的房源</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600" data-aos="fade-right">
                共 <span className="font-semibold text-primary-600">{properties.length}</span> 筆結果
              </p>
              <div className="flex space-x-2" data-aos="fade-left">
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>價格：由低至高</option>
                  <option>價格：由高至低</option>
                  <option>最新上架</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;