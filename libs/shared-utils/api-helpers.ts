/**
 * API helper functions for making HTTP requests
 */

import { ApiResponse, ApiError } from '../shared-types';

const API_BASE_URL = 'http://localhost:7071/api';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      const apiError: ApiError = {
        code: 'API_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };

      return {
        data: null as T,
        success: false,
        message: apiError.message,
        errors: [apiError.message],
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();

// Convenience functions for common API operations
export const getInventory = () => apiClient.get('/inventory');
export const getInventoryItem = (id: string) => apiClient.get(`/inventory/${id}`);
export const createInventoryItem = (data: any) => apiClient.post('/inventory', data);

export const getOrders = () => apiClient.get('/orders');
export const getOrder = (id: string) => apiClient.get(`/orders/${id}`);
export const createOrder = (data: any) => apiClient.post('/orders', data);

export const getFleet = () => apiClient.get('/fleet');
export const getFleetVehicle = (id: string) => apiClient.get(`/fleet/${id}`);
export const createFleetVehicle = (data: any) => apiClient.post('/fleet', data);

export const getWarehouseLayout = () => apiClient.get('/warehouse');
export const updateWarehouseLayout = (data: any) => apiClient.post('/warehouse', data);
export const getWarehouseZone = (id: string) => apiClient.get(`/warehouse/zone/${id}`);

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const isApiError = (response: ApiResponse<any>): boolean => {
  return !response.success || (response.errors ? response.errors.length > 0 : false);
}; 