// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { currentUser } = useAuth();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* 公司簡介 */}
        <div>
          <div className="flex items-center mb-4">
            <BuildingOfficeIcon className="h-8 w-8 mr-2 text-blue-400" />
            <h3 className="text-xl font-bold">房地產網站</h3>
          </div>
          <p className="text-sm text-gray-300">
            專業的房地產資訊平台，致力於為您找到最適合的居住空間。
          </p>
        </div>

        {/* 快速連結 */}
        <div>
          <h4 className="font-semibold mb-4">快速連結</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-300">首頁</Link></li>
            <li><Link to="/properties" className="hover:text-blue-300">房源列表</Link></li>
            <li><Link to="/about" className="hover:text-blue-300">關於我們</Link></li>
            {/* 只有登入用戶才顯示聯絡連結 */}
            {currentUser && (
              <li><Link to="/contact" className="hover:text-blue-300">聯絡我們</Link></li>
            )}
            {/* 非登入用戶顯示登入連結 */}
            {!currentUser && (
              <li><Link to="/login" className="hover:text-blue-300">會員登入</Link></li>
            )}
          </ul>
        </div>

        {/* 會員功能 */}
        <div>
          <h4 className="font-semibold mb-4">
            {currentUser ? '會員功能' : '服務項目'}
          </h4>
          <ul className="space-y-2">
            {currentUser ? (
              <>
                <li><Link to="/articles" className="hover:text-blue-300">文章專欄</Link></li>
                <li><Link to="/profile" className="hover:text-blue-300">個人資料</Link></li>
                <li>房屋收藏</li>
                <li>預約紀錄</li>
              </>
            ) : (
              <>
                <li>房源搜尋</li>
                <li>房產諮詢</li>
                <li>房屋估價</li>
                <li>投資顧問</li>
              </>
            )}
          </ul>
        </div>

        {/* 聯絡資訊 */}
        <div>
          <h4 className="font-semibold mb-4">聯絡資訊</h4>
          <ul className="space-y-3">
            <li className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-blue-400" />
              台北市大安區範例路123號
            </li>
            <li className="flex items-center">
              <PhoneIcon className="h-5 w-5 mr-2 text-blue-400" />
              (02) 1234-5678
            </li>
            <li className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-400" />
              service@realestate.com.tw
            </li>
          </ul>
          
          {/* 為非登入用戶提供登入提示 */}
          {!currentUser && (
            <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-200">
                <Link to="/login" className="hover:text-blue-100 underline">
                  登入會員
                </Link>
                享受更多專屬服務
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 版權宣告 */}
      <div className="border-t border-gray-700 mt-8 py-4 text-center">
        <p className="text-sm text-gray-400">
          © {currentYear} 房地產網站. 版權所有. 保留所有權利.
        </p>
      </div>
    </footer>
  );
};

export default Footer;