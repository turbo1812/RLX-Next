import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { FleetVehicle, FleetVehicleFilters, FleetVehicleFormData, VehicleStatus } from '../models/fleet-vehicle.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  private vehiclesSubject = new BehaviorSubject<FleetVehicle[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public vehicles$ = this.vehiclesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Load all fleet vehicles
   */
  loadVehicles(): Observable<FleetVehicle[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.apiService.getFleetVehicles().pipe(
      map(vehicles => this.mapToFleetVehicles(vehicles)),
      tap(vehicles => {
        this.vehiclesSubject.next(vehicles);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Failed to load fleet vehicles:', error);
        this.errorSubject.next('Failed to load fleet vehicles');
        this.loadingSubject.next(false);
        
        // Return mock data as fallback
        const mockVehicles = this.getMockVehicles();
        this.vehiclesSubject.next(mockVehicles);
        return of(mockVehicles);
      })
    );
  }

  /**
   * Get vehicle by ID
   */
  getVehicleById(id: string): Observable<FleetVehicle | null> {
    return this.vehicles$.pipe(
      map(vehicles => vehicles.find(v => v.id === id) || null)
    );
  }

  /**
   * Add new vehicle
   */
  addVehicle(vehicleData: FleetVehicleFormData): Observable<FleetVehicle> {
    const newVehicle: FleetVehicle = {
      id: this.generateId(),
      ...vehicleData,
      status: VehicleStatus.AVAILABLE,
      mileage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.apiService.addFleetVehicle(newVehicle).pipe(
      tap(vehicle => {
        const currentVehicles = this.vehiclesSubject.value;
        this.vehiclesSubject.next([...currentVehicles, vehicle]);
      }),
      catchError(error => {
        console.error('Failed to add vehicle:', error);
        this.errorSubject.next('Failed to add vehicle');
        throw error;
      })
    );
  }

  /**
   * Update vehicle
   */
  updateVehicle(id: string, updates: Partial<FleetVehicle>): Observable<FleetVehicle> {
    const updatedVehicle = {
      ...updates,
      updatedAt: new Date()
    };

    return this.apiService.updateFleetVehicle(id, updatedVehicle).pipe(
      tap(vehicle => {
        const currentVehicles = this.vehiclesSubject.value;
        const updatedVehicles = currentVehicles.map(v => 
          v.id === id ? vehicle : v
        );
        this.vehiclesSubject.next(updatedVehicles);
      }),
      catchError(error => {
        console.error('Failed to update vehicle:', error);
        this.errorSubject.next('Failed to update vehicle');
        throw error;
      })
    );
  }

  /**
   * Delete vehicle
   */
  deleteVehicle(id: string): Observable<void> {
    return this.apiService.deleteFleetVehicle(id).pipe(
      tap(() => {
        const currentVehicles = this.vehiclesSubject.value;
        const filteredVehicles = currentVehicles.filter(v => v.id !== id);
        this.vehiclesSubject.next(filteredVehicles);
      }),
      catchError(error => {
        console.error('Failed to delete vehicle:', error);
        this.errorSubject.next('Failed to delete vehicle');
        throw error;
      })
    );
  }

  /**
   * Filter vehicles
   */
  filterVehicles(filters: FleetVehicleFilters): Observable<FleetVehicle[]> {
    return this.vehicles$.pipe(
      map(vehicles => {
        return vehicles.filter(vehicle => {
          if (filters.status && vehicle.status !== filters.status) return false;
          if (filters.type && vehicle.type !== filters.type) return false;
          if (filters.driver && !vehicle.driver?.toLowerCase().includes(filters.driver.toLowerCase())) return false;
          if (filters.location && !vehicle.currentLocation?.toLowerCase().includes(filters.location.toLowerCase())) return false;
          return true;
        });
      })
    );
  }

  /**
   * Get vehicle statistics
   */
  getVehicleStats(): Observable<{
    total: number;
    active: number;
    maintenance: number;
    available: number;
    outOfService: number;
  }> {
    return this.vehicles$.pipe(
      map(vehicles => ({
        total: vehicles.length,
        active: vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length,
        maintenance: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length,
        available: vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length,
        outOfService: vehicles.filter(v => v.status === VehicleStatus.OUT_OF_SERVICE).length
      }))
    );
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Map API response to FleetVehicle objects
   */
  private mapToFleetVehicles(data: any[]): FleetVehicle[] {
    return data.map(item => ({
      id: item.id || this.generateId(),
      vehicleNumber: item.vehicleNumber,
      make: item.make,
      model: item.model,
      year: item.year,
      type: item.type,
      status: item.status,
      currentLocation: item.currentLocation,
      lastMaintenance: item.lastMaintenance ? new Date(item.lastMaintenance) : undefined,
      nextMaintenance: item.nextMaintenance ? new Date(item.nextMaintenance) : undefined,
      driver: item.driver,
      capacity: item.capacity,
      licensePlate: item.licensePlate || 'N/A',
      vin: item.vin || 'N/A',
      fuelType: item.fuelType || 'Gasoline',
      mileage: item.mileage || 0,
      insuranceExpiry: item.insuranceExpiry ? new Date(item.insuranceExpiry) : undefined,
      registrationExpiry: item.registrationExpiry ? new Date(item.registrationExpiry) : undefined,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
    }));
  }

  /**
   * Generate mock vehicles for fallback
   */
  private getMockVehicles(): FleetVehicle[] {
    return [
      {
        id: '1',
        vehicleNumber: 'TRK-001',
        make: 'Ford',
        model: 'Transit',
        year: 2022,
        type: 'Delivery Van',
        status: VehicleStatus.ACTIVE,
        currentLocation: 'Warehouse A',
        lastMaintenance: new Date('2024-01-01'),
        nextMaintenance: new Date('2024-02-01'),
        driver: 'John Smith',
        capacity: 1000,
        licensePlate: 'ABC-123',
        vin: '1HGBH41JXMN109186',
        fuelType: 'Gasoline',
        mileage: 15000,
        insuranceExpiry: new Date('2024-12-31'),
        registrationExpiry: new Date('2024-12-31'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        vehicleNumber: 'TRK-002',
        make: 'Mercedes',
        model: 'Sprinter',
        year: 2021,
        type: 'Delivery Van',
        status: VehicleStatus.MAINTENANCE,
        currentLocation: 'Service Center',
        lastMaintenance: new Date('2024-01-15'),
        nextMaintenance: new Date('2024-01-20'),
        driver: 'Jane Doe',
        capacity: 1200,
        licensePlate: 'DEF-456',
        vin: '2T1BURHE0JC123456',
        fuelType: 'Diesel',
        mileage: 25000,
        insuranceExpiry: new Date('2024-12-31'),
        registrationExpiry: new Date('2024-12-31'),
        createdAt: new Date('2022-06-01'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '3',
        vehicleNumber: 'TRK-003',
        make: 'Isuzu',
        model: 'NQR',
        year: 2023,
        type: 'Box Truck',
        status: VehicleStatus.ACTIVE,
        currentLocation: 'Route 101',
        lastMaintenance: new Date('2024-01-10'),
        nextMaintenance: new Date('2024-02-10'),
        driver: 'Bob Johnson',
        capacity: 3000,
        licensePlate: 'GHI-789',
        vin: '3VWDX7AJ5DM123456',
        fuelType: 'Diesel',
        mileage: 8000,
        insuranceExpiry: new Date('2024-12-31'),
        registrationExpiry: new Date('2024-12-31'),
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2024-01-12')
      }
    ];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}