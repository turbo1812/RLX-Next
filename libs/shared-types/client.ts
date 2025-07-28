// Client Management Types for 3PL Warehouse System

export interface Client {
  id: string;
  name: string;
  code: string; // Unique client identifier
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  warehouseId: string; // Associated warehouse
  status: 'active' | 'inactive' | 'suspended';
  serviceAgreements: ServiceAgreement[];
  billingInfo: BillingInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceAgreement {
  id: string;
  clientId: string;
  serviceType: 'storage' | 'delivery' | 'assembly' | 'packaging' | 'returns';
  rate: number;
  rateType: 'per_unit' | 'per_order' | 'monthly' | 'hourly';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  terms: string;
}

export interface BillingInfo {
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentTerms: string;
  taxId: string;
  creditLimit: number;
  currentBalance: number;
}

export interface ClientInventory {
  id: string;
  clientId: string;
  warehouseId: string;
  itemId: string;
  quantity: number;
  allocatedQuantity: number; // Reserved for orders
  availableQuantity: number; // quantity - allocatedQuantity
  location: string;
  lastUpdated: Date;
}

export interface ClientOrder {
  id: string;
  clientId: string;
  orderNumber: string;
  customerName: string;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: ClientOrderItem[];
  services: OrderService[];
  status: OrderStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryNotes?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientOrderItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'picked' | 'packed' | 'shipped' | 'delivered' | 'returned';
}

export interface OrderService {
  id: string;
  orderId: string;
  serviceType: 'delivery' | 'assembly' | 'packaging' | 'special_handling';
  description: string;
  rate: number;
  quantity: number;
  totalAmount: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'picking'
  | 'picked'
  | 'packing'
  | 'packed'
  | 'routed'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'returned'
  | 'cancelled';

export interface DeliveryAttempt {
  id: string;
  orderId: string;
  attemptNumber: number;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'rescheduled';
  driverId?: string;
  vehicleId?: string;
  notes?: string;
  failureReason?: string;
  nextAttemptDate?: Date;
}

export interface Return {
  id: string;
  orderId: string;
  returnNumber: string;
  returnDate: Date;
  reason: ReturnReason;
  items: ReturnItem[];
  status: 'pending' | 'received' | 'processed' | 'refunded';
  notes?: string;
  refundAmount?: number;
}

export interface ReturnItem {
  id: string;
  returnId: string;
  orderItemId: string;
  quantity: number;
  condition: 'good' | 'damaged' | 'defective';
  notes?: string;
}

export type ReturnReason = 
  | 'customer_cancelled'
  | 'damaged_in_transit'
  | 'wrong_item'
  | 'defective'
  | 'not_as_described'
  | 'delivery_failed'
  | 'other';

// Client Dashboard Data
export interface ClientDashboardData {
  clientId: string;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  failedDeliveries: number;
  totalInventory: number;
  lowStockItems: number;
  revenue: number;
  pendingReturns: number;
}

// Client Reports
export interface ClientReport {
  id: string;
  clientId: string;
  reportType: 'inventory' | 'orders' | 'deliveries' | 'returns' | 'revenue';
  dateRange: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  data: any; // Report-specific data structure
}