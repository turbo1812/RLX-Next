export interface WarehouseLayout {
  id: string;
  name: string;
  description: string;
  width: number;
  length: number;
  height: number;
  zones: WarehouseZone[];
  aisles: WarehouseAisle[];
  storageLocations: StorageLocation[];
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseZone {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  width: number;
  length: number;
  zoneType: ZoneType;
  temperature?: number;
  humidity?: number;
  isActive: boolean;
}

export interface WarehouseAisle {
  id: string;
  name: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  aisleType: AisleType;
  isActive: boolean;
}

export interface StorageLocation {
  id: string;
  locationCode: string;
  zoneId: string;
  x: number;
  y: number;
  width: number;
  length: number;
  height: number;
  capacity: number;
  locationType: LocationType;
  isOccupied: boolean;
  currentInventoryItemId?: string;
  isActive: boolean;
}

export enum ZoneType {
  Receiving = 'Receiving',
  Storage = 'Storage',
  Picking = 'Picking',
  Packing = 'Packing',
  Shipping = 'Shipping',
  ColdStorage = 'ColdStorage',
  Hazardous = 'Hazardous'
}

export enum AisleType {
  Main = 'Main',
  Secondary = 'Secondary',
  Access = 'Access',
  Emergency = 'Emergency'
}

export enum LocationType {
  Pallet = 'Pallet',
  Shelf = 'Shelf',
  Bin = 'Bin',
  Floor = 'Floor',
  Rack = 'Rack'
}

export interface CreateWarehouseLayoutRequest {
  name: string;
  description: string;
  width: number;
  length: number;
  height: number;
}

export interface UpdateWarehouseLayoutRequest {
  name?: string;
  description?: string;
  width?: number;
  length?: number;
  height?: number;
} 