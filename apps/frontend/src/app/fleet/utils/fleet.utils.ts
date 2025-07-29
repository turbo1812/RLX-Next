import { VehicleStatus, VehicleType, FuelType } from '../models/fleet-vehicle.model';

/**
 * Get severity level for vehicle status
 */
export function getStatusSeverity(status: VehicleStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  switch (status) {
    case VehicleStatus.ACTIVE:
      return 'success';
    case VehicleStatus.MAINTENANCE:
      return 'warn';
    case VehicleStatus.OUT_OF_SERVICE:
      return 'danger';
    case VehicleStatus.AVAILABLE:
      return 'info';
    case VehicleStatus.IN_TRANSIT:
      return 'secondary';
    default:
      return 'secondary';
  }
}

/**
 * Get icon for vehicle type
 */
export function getVehicleTypeIcon(type: VehicleType): string {
  switch (type) {
    case VehicleType.DELIVERY_VAN:
      return 'pi pi-truck';
    case VehicleType.BOX_TRUCK:
      return 'pi pi-box';
    case VehicleType.FLATBED:
      return 'pi pi-car';
    case VehicleType.REFRIGERATED:
      return 'pi pi-snowflake';
    case VehicleType.PICKUP:
      return 'pi pi-car';
    case VehicleType.TRAILER:
      return 'pi pi-link';
    default:
      return 'pi pi-truck';
  }
}

/**
 * Get color class for vehicle type
 */
export function getVehicleTypeColor(type: VehicleType): string {
  switch (type) {
    case VehicleType.DELIVERY_VAN:
      return 'bg-blue-500';
    case VehicleType.BOX_TRUCK:
      return 'bg-green-500';
    case VehicleType.FLATBED:
      return 'bg-orange-500';
    case VehicleType.REFRIGERATED:
      return 'bg-cyan-500';
    case VehicleType.PICKUP:
      return 'bg-purple-500';
    case VehicleType.TRAILER:
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Format capacity for display
 */
export function formatCapacity(capacity: number): string {
  if (capacity >= 1000) {
    return `${(capacity / 1000).toFixed(1)}k lbs`;
  }
  return `${capacity} lbs`;
}

/**
 * Format mileage for display
 */
export function formatMileage(mileage: number): string {
  if (mileage >= 1000000) {
    return `${(mileage / 1000000).toFixed(1)}M mi`;
  } else if (mileage >= 1000) {
    return `${(mileage / 1000).toFixed(0)}k mi`;
  }
  return `${mileage} mi`;
}

/**
 * Check if maintenance is due soon (within 30 days)
 */
export function isMaintenanceDueSoon(nextMaintenance: Date): boolean {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return nextMaintenance <= thirtyDaysFromNow;
}

/**
 * Check if maintenance is overdue
 */
export function isMaintenanceOverdue(nextMaintenance: Date): boolean {
  return nextMaintenance < new Date();
}

/**
 * Get maintenance status
 */
export function getMaintenanceStatus(nextMaintenance: Date): 'good' | 'warning' | 'critical' {
  const now = new Date();
  const daysUntilMaintenance = Math.ceil((nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilMaintenance < 0) {
    return 'critical';
  } else if (daysUntilMaintenance <= 30) {
    return 'warning';
  } else {
    return 'good';
  }
}

/**
 * Get fuel type icon
 */
export function getFuelTypeIcon(fuelType: FuelType): string {
  switch (fuelType) {
    case FuelType.GASOLINE:
      return 'pi pi-fire';
    case FuelType.DIESEL:
      return 'pi pi-fire';
    case FuelType.ELECTRIC:
      return 'pi pi-bolt';
    case FuelType.HYBRID:
      return 'pi pi-leaf';
    case FuelType.CNG:
      return 'pi pi-cloud';
    default:
      return 'pi pi-fire';
  }
}

/**
 * Validate VIN number
 */
export function isValidVIN(vin: string): boolean {
  // Basic VIN validation (17 characters, alphanumeric)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin.toUpperCase());
}

/**
 * Validate license plate
 */
export function isValidLicensePlate(plate: string): boolean {
  // Basic license plate validation (3-8 characters, alphanumeric)
  const plateRegex = /^[A-Z0-9]{3,8}$/;
  return plateRegex.test(plate.toUpperCase());
}

/**
 * Generate vehicle number
 */
export function generateVehicleNumber(prefix: string = 'TRK'): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Get vehicle age in years
 */
export function getVehicleAge(year: number): number {
  return new Date().getFullYear() - year;
}

/**
 * Check if vehicle is eligible for replacement (over 10 years old)
 */
export function isEligibleForReplacement(year: number): boolean {
  return getVehicleAge(year) >= 10;
}