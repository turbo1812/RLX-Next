/**
 * Error message constants
 */

export const ERROR_MESSAGES = {
  // General errors
  GENERAL: {
    UNKNOWN_ERROR: 'An unknown error occurred',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
  },
  
  // Inventory errors
  INVENTORY: {
    NOT_FOUND: 'Inventory item not found.',
    SKU_EXISTS: 'An item with this SKU already exists.',
    INSUFFICIENT_STOCK: 'Insufficient stock available.',
    INVALID_QUANTITY: 'Quantity must be a positive number.',
    INVALID_PRICE: 'Price must be a positive number.',
  },
  
  // Order errors
  ORDERS: {
    NOT_FOUND: 'Order not found.',
    INVALID_STATUS: 'Invalid order status.',
    CANNOT_CANCEL: 'Order cannot be cancelled in its current status.',
    INSUFFICIENT_STOCK: 'Some items in the order have insufficient stock.',
    INVALID_ITEMS: 'Order must contain at least one item.',
  },
  
  // Fleet errors
  FLEET: {
    NOT_FOUND: 'Fleet vehicle not found.',
    VEHICLE_IN_USE: 'Vehicle is currently in use.',
    MAINTENANCE_REQUIRED: 'Vehicle requires maintenance.',
    INVALID_LICENSE: 'Invalid license plate format.',
  },
  
  // Warehouse errors
  WAREHOUSE: {
    NOT_FOUND: 'Warehouse not found.',
    LOCATION_OCCUPIED: 'Storage location is already occupied.',
    INVALID_LAYOUT: 'Invalid warehouse layout.',
    ZONE_FULL: 'Warehouse zone is at full capacity.',
  },
} as const;

export const SUCCESS_MESSAGES = {
  // General success messages
  GENERAL: {
    CREATED: 'Item created successfully.',
    UPDATED: 'Item updated successfully.',
    DELETED: 'Item deleted successfully.',
    SAVED: 'Changes saved successfully.',
  },
  
  // Inventory success messages
  INVENTORY: {
    CREATED: 'Inventory item created successfully.',
    UPDATED: 'Inventory item updated successfully.',
    STOCK_UPDATED: 'Stock level updated successfully.',
  },
  
  // Order success messages
  ORDERS: {
    CREATED: 'Order created successfully.',
    STATUS_UPDATED: 'Order status updated successfully.',
    SHIPPED: 'Order marked as shipped.',
    DELIVERED: 'Order marked as delivered.',
  },
  
  // Fleet success messages
  FLEET: {
    CREATED: 'Fleet vehicle added successfully.',
    UPDATED: 'Fleet vehicle updated successfully.',
    STATUS_UPDATED: 'Vehicle status updated successfully.',
  },
} as const; 