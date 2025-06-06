// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import { ArticleProvider } from './context/ArticleContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import LoginPage from './pages/login/LoginPage';
import LineCallback from './pages/login/LineCallback';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/profile/ProfilePage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <ArticleProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* ========== 公開路由 ========== */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/property/:id" element={<PropertyDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/line/callback" element={<LineCallback />} />
                  
                  {/* ========== 受保護的路由（需要登入）========== */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/article/:id" element={<ArticleDetailPage />} />
                    <Route path="/contact" element={<ContactPage />} /> {/* 移到受保護路由 */}
                  </Route>
                  
                  {/* 404 路由 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ArticleProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;