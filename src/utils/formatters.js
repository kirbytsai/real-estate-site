// src/utils/formatters.js

// 格式化金額（加入千分位逗號）
export const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // 格式化房源面積
  export const formatArea = (area) => {
    return `${area} 坪`;
  };
  
  // 格式化房齡
  export const formatPropertyAge = (age) => {
    return `${age} 年`;
  };
  
  // 截斷過長文字
  export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // 生成房源詳細資訊描述
  export const generatePropertyDescription = (property) => {
    const { region, district, propertyType, area, floor, age } = property;
    return `位於${region}${district}的${propertyType}，${area}坪，${floor}樓，屋齡${age}年`;
  };