import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPinIcon, 
  HomeModernIcon, 
  ScaleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { propertyService } from '../services/propertyService';
import { formatPrice, formatArea, formatPropertyAge } from '../utils/formatters';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const propertyData = await propertyService.getPropertyById(id);
        setProperty(propertyData);
        
        // 獲取相關推薦房源
        const allProperties = await propertyService.getAllProperties();
        const related = allProperties
          .filter(p => p.id !== Number(id) && p.region === propertyData.region)
          .slice(0, 2);
        setRelatedProperties(related);
        
        setLoading(false);
      } catch (error) {
        console.error('載入房源詳細資訊失敗', error);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
    // 回到頁面頂部
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">找不到房源資訊</h2>
        <p className="text-gray-600 mt-4">您所查詢的房源可能已下架或不存在</p>
        <a 
          href="/properties" 
          className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          返回所有房源
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 房源標題與位置 */}
        <div className="mb-8 text-center" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {property.title}
          </h1>
          <div className="flex justify-center items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>{property.region} {property.district}</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {/* 左側：房源圖片 */}
          <div className="md:col-span-2" data-aos="fade-right">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative">
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={`${property.title} - 圖片${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
                
                {/* 左右箭頭 */}
                {property.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* 縮圖列表 */}
              {property.images.length > 1 && (
                <div className="flex space-x-2 p-4 overflow-x-auto">
                  {property.images.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`縮圖 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* 房源詳細說明 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6" data-aos="fade-up">
              <h2 className="text-xl font-bold mb-4 pb-4 border-b border-gray-100">房源詳細資訊</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {property.description}
              </p>
              
              <h3 className="text-lg font-semibold mb-3">房源特色</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {property.features.map(feature => (
                  <div key={feature} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-primary-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 相關推薦房源 */}
            {relatedProperties.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
                <h2 className="text-xl font-bold mb-6">您可能也會喜歡</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedProperties.map(relatedProperty => (
                    <a 
                      key={relatedProperty.id}
                      href={`/property/${relatedProperty.id}`}
                      className="flex bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={relatedProperty.images[0]} 
                          alt={relatedProperty.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{relatedProperty.title}</h3>
                        <p className="text-primary-600 font-medium text-sm">{formatPrice(relatedProperty.price)}</p>
                        <p className="text-gray-500 text-xs mt-1">{relatedProperty.region} {relatedProperty.district}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 右側：房源資訊與聯絡方式 */}
          <div className="md:col-span-1" data-aos="fade-left">
            {/* 價格卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="text-2xl font-bold text-primary-600 mb-4">
                {formatPrice(property.price)}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-500" />
                    <span>類型</span>
                  </div>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <ScaleIcon className="h-5 w-5 mr-2 text-gray-500" />
                    <span>面積</span>
                  </div>
                  <span className="font-medium">{formatArea(property.area)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <HomeModernIcon className="h-5 w-5 mr-2 text-gray-500" />
                    <span>樓層</span>
                  </div>
                  <span className="font-medium">{property.floor}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                    <span>屋齡</span>
                  </div>
                  <span className="font-medium">{formatPropertyAge(property.age)}</span>
                </div>
              </div>
            </div>
            
            {/* 聯絡卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">對此房源有興趣？</h2>
              <p className="text-gray-600 mb-6">
                立即聯絡我們的專業顧問，獲取更多資訊或安排看屋。
              </p>
              
              <div className="space-y-4">
                <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex justify-center items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  立即聯絡
                </button>
                
                <button className="w-full py-3 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex justify-center items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  預約看屋
                </button>
              </div>
            </div>
            
            {/* 分享與收藏 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">分享與收藏</h2>
              <div className="flex justify-between mb-4">
                <button className="flex items-center justify-center w-1/2 py-2 mr-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="h-5 w-5 mr-2 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                  </svg>
                  分享
                </button>
                
                <button className="flex items-center justify-center w-1/2 py-2 ml-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  收藏
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;