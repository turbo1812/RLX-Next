export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  SKU: string;
  sku: string; // alias for SKU to match component usage
  quantity: number;
  location: string;
  category: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: InventoryStatus;
}

export interface CreateInventoryItemRequest {
  name: string;
  description?: string;
  SKU: string;
  quantity: number;
  location?: string;
  category?: string;
  unitPrice: number;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  description?: string;
  quantity?: number;
  location?: string;
  category?: string;
  unitPrice?: number;
  isActive?: boolean;
}

export interface InventoryFilter {
  category?: string;
  location?: string;
  status?: InventoryStatus;
  searchTerm?: string;
}

export interface CreateInventoryRequest {
  name: string;
  description?: string;
  SKU: string;
  quantity: number;
  location?: string;
  category?: string;
  unitPrice: number;
}