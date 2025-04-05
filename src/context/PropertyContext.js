import React, { createContext, useState, useContext, useReducer, useCallback } from 'react';
import { propertyService } from '../services/propertyService';

// 定義初始狀態
const initialState = {
    properties: [],
    featuredProperties: [],
    loading: false,
    error: null
  };

// Reducer函數
const propertyReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_PROPERTIES_START':
        return { ...state, loading: true, error: null };
      case 'FETCH_PROPERTIES_SUCCESS':
        return { 
          ...state, 
          properties: action.payload,
          loading: false 
        };
      case 'FETCH_PROPERTIES_ERROR':
        return { ...state, loading: false, error: action.payload };
      case 'FETCH_FEATURED_PROPERTIES_SUCCESS':
        return { ...state, featuredProperties: action.payload };
      default:
        return state;
    }
  };
  
// 創建Context
const PropertyContext = createContext();

// Provider元件
export const PropertyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  // 載入房源
  const fetchProperties = useCallback(async () => {
    dispatch({ type: 'FETCH_PROPERTIES_START' });
    try {
      const result = await propertyService.getAllProperties(state.filters);
      dispatch({ 
        type: 'FETCH_PROPERTIES_SUCCESS', 
        payload: result 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_PROPERTIES_ERROR', 
        payload: error.message 
      });
    }
  }, [state.filters]);

  // 載入推薦房源
  const fetchFeaturedProperties = useCallback(async () => {
    try {
      const properties = await propertyService.getFeaturedProperties();
      dispatch({ 
        type: 'FETCH_FEATURED_PROPERTIES_SUCCESS', 
        payload: properties 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_PROPERTIES_ERROR', 
        payload: error.message 
      });
    }
  }, []);

  // 更新篩選條件
  const updateFilters = useCallback((newFilters) => {
    dispatch({ 
      type: 'UPDATE_FILTERS', 
      payload: newFilters 
    });
  }, []);

  // 換頁
  const changePage = useCallback((page) => {
    dispatch({ 
      type: 'CHANGE_PAGE', 
      payload: page 
    });
  }, []);

  // 提供的值
  const value = {
    ...state,
    fetchProperties,
    fetchFeaturedProperties,
    updateFilters,
    changePage
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

// 自定義Hook，方便在其他元件中使用Context
export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext必須在PropertyProvider內使用');
  }
  return context;
};