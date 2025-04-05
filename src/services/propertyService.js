// src/services/propertyService.js
import axios from 'axios';

// 模擬房源資料
const mockProperties = [
  {
    id: 1,
    title: '市中心精品公寓',
    region: '台北市',
    district: '大安區',
    propertyType: '公寓',
    price: 1280000,
    area: 25,
    floor: '3/15',
    age: 10,
    images: ['/images/property1-1.jpg', '/images/property1-2.jpg'],
    description: '位於大安區核心地段，交通便利，鄰近捷運站，適合首購族或投資',
    features: ['近捷運', '商圈', '屋況良好']
  },
  {
    id: 2,
    title: '景觀三房電梯大樓',
    region: '新北市',
    district: '板橋區',
    propertyType: '電梯大樓',
    price: 1580000,
    area: 45,
    floor: '12/20',
    age: 5,
    images: ['/images/property2-1.jpg', '/images/property2-2.jpg'],
    description: '寬敞三房，採光充足，可欣賞城市景觀，適合小家庭',
    features: ['景觀戶', '車位', '學區']
  },
  // 更多模擬房源...
];

// 房源資料服務
export const propertyService = {
  // 獲取所有房源
  async getAllProperties() {
    // 模擬API延遲
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 確保總是返回一個數組
    return mockProperties || []; // 如果 mockProperties 未定義，返回空數組
  },

  // 依ID獲取單一房源
  async getPropertyById(id) {
    return mockProperties.find(p => p.id === Number(id)) || null;
  },

  // 獲取推薦房源
  async getFeaturedProperties() {
    return mockProperties.slice(0, 6) || [];
  }
};