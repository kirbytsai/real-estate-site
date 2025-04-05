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
import { 
  formatPrice, 
  formatArea, 
  formatPropertyAge, 
  generatePropertyDescription 
} from '../utils/formatters';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const propertyData = await propertyService.getPropertyById(id);
        setProperty(propertyData);
        setLoading(false);
      } catch (error) {
        console.error('載入房源詳細資訊失敗', error);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">找不到房源資訊</h2>
        <p className="text-gray-600 mt-4">您所查詢的房源可能已下架或不存在</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10">
        {/* 房源圖片 */}
        <div>
          <div className="relative mb-4">
            <img 
              src={property.images[currentImageIndex]} 
              alt={`${property.title} - 圖片${currentImageIndex + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          {/* 圖片縮圖 */}
          <div className="flex space-x-2 overflow-x-auto">
            {property.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                  index === currentImageIndex ? 'border-4 border-blue-500' : ''
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
        </div>

        {/* 房源詳細資訊 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {property.title}
          </h1>

          {/* 基本資訊 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <MapPinIcon className="h-6 w-6 mr-2 text-blue-500" />
              <span>{property.region} {property.district}</span>
            </div>
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 mr-2 text-blue-500" />
              <span>{property.propertyType}</span>
            </div>
            <div className="flex items-center">
              <ScaleIcon className="h-6 w-6 mr-2 text-blue-500" />
              <span>{formatArea(property.area)}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2 text-blue-500" />
              <span>{formatPropertyAge(property.age)}</span>
            </div>
          </div>

          {/* 價格 */}
          <div className="text-2xl font-bold text-blue-600 mb-6">
            {formatPrice(property.price)}
          </div>

          {/* 房源描述 */}
          <p className="text-gray-700 mb-6">
            {property.description}
          </p>

          {/* 房源特色 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">房源特色</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.features.map(feature => (
                <div key={feature} className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 聯絡按鈕 */}
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
              預約看屋
            </button>
            <button className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition duration-300">
              聯絡仲介
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;