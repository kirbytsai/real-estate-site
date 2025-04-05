import React from 'react';
import { formatPrice, formatArea, truncateText } from '../../utils/formatters';

const PropertyCard = ({ property, index = 0 }) => {
  // 處理圖片加載錯誤的函數
  const handleImageError = (e) => {
    e.target.src = '/placeholder-property.jpg';
  };

  return (
    <div 
      className="card group card-hover relative z-10 bg-white/90 backdrop-blur-sm"
      data-aos="fade-up" 
      data-aos-delay={index * 100}
    >
      {/* 房源圖片 */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={property.images[0] || '/placeholder-property.jpg'} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={handleImageError}
        />
        
        {/* 類型標籤 */}
        <div className="absolute top-4 right-4">
          <span className="tag tag-primary">
            {property.propertyType}
          </span>
        </div>
        
        {/* 價格標籤 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
          <div className="text-lg font-bold">
            {formatPrice(property.price)}
          </div>
        </div>
      </div>

      {/* 房源詳情 */}
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
          {truncateText(property.title, 25)}
        </h3>
        
        <div className="flex items-center text-secondary-500 mb-3">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.region} {property.district}</span>
        </div>
        
        {/* 房源資訊 */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9h-6M8 9h2M8 13h2M18 13h-6M8 17h2" />
            </svg>
            <span>{formatArea(property.area)}</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>屋齡 {property.age} 年</span>
          </div>
        </div>

        {/* 房源特色 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 3).map(feature => (
            <span 
              key={feature}
              className="tag tag-secondary"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* 查看詳情按鈕 */}
        <a 
          href={`/property/${property.id}`}
          className="block w-full py-3 text-center text-primary-500 font-medium border-t border-gray-200 hover:text-primary-600 transition-colors mt-4 pt-4 group-hover:border-primary-200"
        >
          <span className="relative inline-block transition-all duration-300 group-hover:pl-2">
            查看詳情
            <svg className="h-4 w-4 inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
};

export default PropertyCard;