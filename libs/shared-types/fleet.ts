export interface FleetVehicle {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  driverId: string;
  driverName: string;
  capacity: number;
  currentLocation: string;
  lastMaintenance: string;
  nextMaintenance: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum VehicleType {
  Truck = 'Truck',
  Van = 'Van',
  Car = 'Car',
  Forklift = 'Forklift',
  Trailer = 'Trailer'
}

export enum VehicleStatus {
  Available = 'Available',
  InUse = 'InUse',
  Maintenance = 'Maintenance',
  OutOfService = 'OutOfService'
}

export interface CreateFleetVehicleRequest {
  vehicleNumber: string;
  make: string;
  model: string;
  year: string;
  licensePlate?: string;
  type: VehicleType;
  capacity: number;
  currentLocation?: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface UpdateFleetVehicleRequest {
  vehicleNumber?: string;
  make?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  type?: VehicleType;
  status?: VehicleStatus;
  driverId?: string;
  driverName?: string;
  capacity?: number;
  currentLocation?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  isActive?: boolean;
} 