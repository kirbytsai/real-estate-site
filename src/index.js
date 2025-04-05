import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AOS from 'aos';
import 'aos/dist/aos.css'; // 引入 AOS 樣式

// 初始化 AOS
AOS.init({
  duration: 800, // 動畫持續時間
  easing: 'ease-out-cubic', // 緩動函數
  once: true, // 只觸發一次動畫
  offset: 50, // 觸發動畫的偏移距離
  delay: 100, // 延遲時間
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);