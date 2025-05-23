import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { articleService } from '../services/articleService';
import axios from 'axios';

// 初始狀態
const initialState = {
  articles: [],
  featuredArticles: [],
  currentArticle: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    tag: ''
  }
};

// Reducer 函數
const articleReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ARTICLES_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_ARTICLES_SUCCESS':
      return { 
        ...state, 
        articles: action.payload,
        loading: false 
      };
    
    case 'FETCH_ARTICLE_DETAIL_SUCCESS':
      return { 
        ...state, 
        currentArticle: action.payload,
        loading: false 
      };
    
    case 'FETCH_ARTICLES_ERROR':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    
    case 'SET_CATEGORY_FILTER':
      return { 
        ...state, 
        filters: { 
          ...state.filters, 
          category: action.payload 
        } 
      };
    
    case 'SET_TAG_FILTER':
      return { 
        ...state, 
        filters: { 
          ...state.filters, 
          tag: action.payload 
        } 
      };
    
    default:
      return state;
  }
};

// 創建 Context
const ArticleContext = createContext();

// Provider 元件
export const ArticleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(articleReducer, initialState);

  // 獲取所有文章
  const fetchArticles = useCallback(async () => {
    dispatch({ type: 'FETCH_ARTICLES_START' });
    console.log('開始獲取文章...');
    
    try {
      // 添加超時處理
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // 使用 axios 調用後端 API
      const response = await axios.get('/api/articles', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('文章獲取成功:', response.data);
      
      dispatch({ 
        type: 'FETCH_ARTICLES_SUCCESS', 
        payload: response.data 
      });
    } catch (error) {
      console.error('獲取文章失敗:', error);
      console.error('錯誤詳情:', error.response?.data || error.message);
      
      // 更友好的錯誤信息
      let errorMessage = '獲取文章失敗';
      if (error.code === 'ERR_CANCELED') {
        errorMessage = '請求超時，請檢查網絡連接';
      } else if (error.response?.status === 401) {
        errorMessage = '您需要登入才能訪問文章';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({ 
        type: 'FETCH_ARTICLES_ERROR', 
        payload: errorMessage
      });
    }
  }, []);

  // 獲取單一文章詳情
  const fetchArticleDetail = useCallback(async (id) => {
    dispatch({ type: 'FETCH_ARTICLES_START' });
    try {
      const article = await articleService.getArticleById(id);
      dispatch({ 
        type: 'FETCH_ARTICLE_DETAIL_SUCCESS', 
        payload: article 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_ARTICLES_ERROR', 
        payload: error.message 
      });
    }
  }, []);

  // 設置分類篩選
  const setCategoryFilter = useCallback((category) => {
    dispatch({ 
      type: 'SET_CATEGORY_FILTER', 
      payload: category 
    });
  }, []);

  // 設置標籤篩選
  const setTagFilter = useCallback((tag) => {
    dispatch({ 
      type: 'SET_TAG_FILTER', 
      payload: tag 
    });
  }, []);

  // 提供的值
  const value = {
    ...state,
    fetchArticles,
    fetchArticleDetail,
    setCategoryFilter,
    setTagFilter
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};

// 自定義 Hook
export const useArticleContext = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticleContext 必須在 ArticleProvider 內使用');
  }
  return context;
};