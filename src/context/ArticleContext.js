import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { articleService } from '../services/articleService';

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
    try {
      const articles = await articleService.getAllArticles();
      dispatch({ 
        type: 'FETCH_ARTICLES_SUCCESS', 
        payload: articles 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_ARTICLES_ERROR', 
        payload: error.message 
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