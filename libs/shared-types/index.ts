// Inventory types
export * from './inventory';

// Order types
export * from './orders';

// Fleet types
export * from './fleet';

// Warehouse types
export * from './warehouse';

// Common types used across the application
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
} 