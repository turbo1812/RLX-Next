export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  totalAmount: number;
  shippingAddress: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  inventoryItemId: string;
  itemName: string;
  SKU: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export interface CreateOrderRequest {
  customerId: string;
  customerName: string;
  items: CreateOrderItemRequest[];
  shippingAddress: string;
  notes?: string;
}

export interface CreateOrderItemRequest {
  inventoryItemId: string;
  quantity: number;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippedDate?: string;
  deliveredDate?: string;
  notes?: string;
} 