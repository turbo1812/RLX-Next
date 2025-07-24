/**
 * API endpoint constants
 */

export const API_ENDPOINTS = {
  // Inventory endpoints
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id: string) => `/inventory/${id}`,
    CREATE: '/inventory',
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  
  // Fleet endpoints
  FLEET: {
    BASE: '/fleet',
    BY_ID: (id: string) => `/fleet/${id}`,
    CREATE: '/fleet',
    UPDATE: (id: string) => `/fleet/${id}`,
    DELETE: (id: string) => `/fleet/${id}`,
    UPDATE_STATUS: (id: string) => `/fleet/${id}/status`,
  },
  
  // Warehouse endpoints
  WAREHOUSE: {
    BASE: '/warehouse',
    BY_ID: (id: string) => `/warehouse/${id}`,
    CREATE: '/warehouse',
    UPDATE: (id: string) => `/warehouse/${id}`,
    DELETE: (id: string) => `/warehouse/${id}`,
    LAYOUT: (id: string) => `/warehouse/${id}/layout`,
  },
} as const;

export const API_BASE_URL = 'http://localhost:7071/api';

export const getFullUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
}; 