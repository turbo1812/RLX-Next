export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  SKU: string;
  quantity: number;
  location: string;
  category: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
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