/**
 * Validation utility functions
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const isValidSKU = (sku: string): boolean => {
  // SKU should be alphanumeric and between 3-20 characters
  const skuRegex = /^[A-Z0-9\-]{3,20}$/;
  return skuRegex.test(sku.toUpperCase());
};

export const isValidOrderNumber = (orderNumber: string): boolean => {
  // Order number format: ORD-YYYYMMDD-XXXX
  const orderNumberRegex = /^ORD-\d{8}-[A-Z0-9]{4}$/;
  return orderNumberRegex.test(orderNumber);
};

export const isValidVehicleNumber = (vehicleNumber: string): boolean => {
  // Vehicle number should be alphanumeric and between 3-20 characters
  const vehicleNumberRegex = /^[A-Z0-9\-]{3,20}$/;
  return vehicleNumberRegex.test(vehicleNumber.toUpperCase());
};

export const isValidLicensePlate = (licensePlate: string): boolean => {
  // Basic license plate validation (can be customized per region)
  const licensePlateRegex = /^[A-Z0-9\-\s]{2,10}$/;
  return licensePlateRegex.test(licensePlate.toUpperCase());
};

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value > 0;
};

export const isNonNegativeNumber = (value: number): boolean => {
  return typeof value === 'number' && value >= 0;
};

export const isValidStringLength = (value: string, minLength: number, maxLength: number): boolean => {
  return typeof value === 'string' && value.length >= minLength && value.length <= maxLength;
};

export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateInventoryItem = (item: any): string[] => {
  const errors: string[] = [];
  
  if (!isRequired(item.name)) {
    errors.push('Name is required');
  } else if (!isValidStringLength(item.name, 1, 100)) {
    errors.push('Name must be between 1 and 100 characters');
  }
  
  if (!isRequired(item.SKU)) {
    errors.push('SKU is required');
  } else if (!isValidSKU(item.SKU)) {
    errors.push('SKU must be 3-20 alphanumeric characters');
  }
  
  if (!isNonNegativeNumber(item.quantity)) {
    errors.push('Quantity must be a non-negative number');
  }
  
  if (!isPositiveNumber(item.unitPrice)) {
    errors.push('Unit price must be a positive number');
  }
  
  return errors;
};

export const validateOrder = (order: any): string[] => {
  const errors: string[] = [];
  
  if (!isRequired(order.customerName)) {
    errors.push('Customer name is required');
  }
  
  if (!isRequired(order.shippingAddress)) {
    errors.push('Shipping address is required');
  }
  
  if (!Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  return errors;
}; 