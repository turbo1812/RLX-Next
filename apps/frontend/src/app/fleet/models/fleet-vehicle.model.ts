export interface FleetVehicle {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  currentLocation?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  driver?: string;
  capacity: number;
  licensePlate: string;
  vin: string;
  fuelType: FuelType;
  mileage: number;
  insuranceExpiry?: Date;
  registrationExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum VehicleType {
  DELIVERY_VAN = 'Delivery Van',
  BOX_TRUCK = 'Box Truck',
  FLATBED = 'Flatbed',
  REFRIGERATED = 'Refrigerated',
  PICKUP = 'Pickup',
  TRAILER = 'Trailer'
}

export enum VehicleStatus {
  ACTIVE = 'Active',
  MAINTENANCE = 'Maintenance',
  OUT_OF_SERVICE = 'Out of Service',
  AVAILABLE = 'Available',
  IN_TRANSIT = 'In Transit'
}

export enum FuelType {
  GASOLINE = 'Gasoline',
  DIESEL = 'Diesel',
  ELECTRIC = 'Electric',
  HYBRID = 'Hybrid',
  CNG = 'CNG'
}

export interface FleetVehicleFilters {
  status?: VehicleStatus;
  type?: VehicleType;
  driver?: string;
  location?: string;
}

export interface FleetVehicleFormData {
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  licensePlate: string;
  vin: string;
  fuelType: FuelType;
  capacity: number;
  driver?: string;
}