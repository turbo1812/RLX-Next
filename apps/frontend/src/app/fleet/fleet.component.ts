import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, TagModule, BreadcrumbModule],
  template: `
    <div class="p-4">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <p-breadcrumb [model]="breadcrumbItems" [home]="home"></p-breadcrumb>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p class="text-gray-600 mt-2">Manage delivery vehicles and drivers</p>
        </div>
        <div class="flex space-x-3">
          <p-button label="Add Vehicle" 
                   icon="pi pi-plus" 
                   severity="primary"
                   (onClick)="addVehicle()"></p-button>
          <p-button label="Schedule Maintenance" 
                   icon="pi pi-wrench" 
                   severity="warn"
                   (onClick)="scheduleMaintenance()"></p-button>
        </div>
      </div>

      <!-- Fleet Table -->
      <p-card>
        <p-table [value]="fleetVehicles" 
                 [paginator]="true" 
                 [rows]="10" 
                 [showCurrentPageReport]="true" 
                 responsiveLayout="scroll"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                 [rowsPerPageOptions]="[10,25,50]"
                 [globalFilterFields]="['vehicleNumber','make','model','driverName']">
          
          <ng-template pTemplate="header">
            <tr>
              <th>Vehicle #</th>
              <th>Make/Model</th>
              <th>Type</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Location</th>
              <th>Next Maintenance</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-vehicle>
            <tr>
              <td>
                <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{{vehicle.vehicleNumber}}</span>
              </td>
              <td>
                <div>
                  <div class="font-semibold">{{vehicle.make}} {{vehicle.model}}</div>
                  <div class="text-sm text-gray-500">{{vehicle.year}}</div>
                </div>
              </td>
              <td>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {{vehicle.type}}
                </span>
              </td>
              <td>
                <p-tag [value]="vehicle.status" 
                       [severity]="getStatusSeverity(vehicle.status)">
                </p-tag>
              </td>
              <td>
                <div v-if="vehicle.driverName; else noDriver">
                  <div class="font-semibold">{{vehicle.driverName}}</div>
                  <div class="text-sm text-gray-500">{{vehicle.driverPhone}}</div>
                </div>
                <ng-template #noDriver>
                  <span class="text-gray-400 italic">Unassigned</span>
                </ng-template>
              </td>
              <td>
                <div class="flex items-center">
                  <i class="pi pi-map-marker text-red-500 mr-2"></i>
                  {{vehicle.currentLocation}}
                </div>
              </td>
              <td>
                <span [class]="getMaintenanceClass(vehicle.nextMaintenance)">
                  {{vehicle.nextMaintenance | date:'shortDate'}}
                </span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <p-button icon="pi pi-eye" 
                           severity="info" 
                           size="small"
                           (onClick)="viewVehicle(vehicle)"></p-button>
                  <p-button icon="pi pi-pencil" 
                           severity="secondary" 
                           size="small"
                           (onClick)="editVehicle(vehicle)"></p-button>
                  <p-button icon="pi pi-wrench" 
                           severity="warn" 
                           size="small"
                           (onClick)="maintainVehicle(vehicle)"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    
    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }
  `]
})
export class FleetComponent {
  fleetVehicles: any[] = [
    {
      vehicleNumber: 'TRK-001',
      make: 'Ford',
      model: 'F-150',
      year: '2023',
      type: 'Truck',
      status: 'Available',
      driverName: '',
      driverPhone: '',
      currentLocation: 'Warehouse A',
      nextMaintenance: new Date('2024-02-15')
    },
    {
      vehicleNumber: 'VAN-001',
      make: 'Mercedes',
      model: 'Sprinter',
      year: '2022',
      type: 'Van',
      status: 'InUse',
      driverName: 'John Driver',
      driverPhone: '(555) 123-4567',
      currentLocation: 'On Route',
      nextMaintenance: new Date('2024-01-30')
    },
    {
      vehicleNumber: 'CAR-001',
      make: 'Toyota',
      model: 'Camry',
      year: '2021',
      type: 'Car',
      status: 'Maintenance',
      driverName: 'Sarah Wilson',
      driverPhone: '(555) 987-6543',
      currentLocation: 'Service Center',
      nextMaintenance: new Date('2024-01-20')
    },
    {
      vehicleNumber: 'TRK-002',
      make: 'Chevrolet',
      model: 'Silverado',
      year: '2023',
      type: 'Truck',
      status: 'Available',
      driverName: '',
      driverPhone: '',
      currentLocation: 'Warehouse B',
      nextMaintenance: new Date('2024-03-01')
    }
  ];

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Fleet Management' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Available': return 'success';
      case 'InUse': return 'info';
      case 'Maintenance': return 'warn';
      case 'OutOfService': return 'danger';
      default: return 'info';
    }
  }

  getMaintenanceClass(date: Date): string {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays <= 7) return 'text-orange-600 font-semibold';
    return 'text-green-600 font-semibold';
  }

  addVehicle() {
    console.log('Add vehicle clicked');
    // TODO: Implement add vehicle functionality
  }

  scheduleMaintenance() {
    console.log('Schedule maintenance clicked');
    // TODO: Implement schedule maintenance functionality
  }

  viewVehicle(vehicle: any) {
    console.log('View vehicle:', vehicle);
    // TODO: Implement view vehicle functionality
  }

  editVehicle(vehicle: any) {
    console.log('Edit vehicle:', vehicle);
    // TODO: Implement edit vehicle functionality
  }

  maintainVehicle(vehicle: any) {
    console.log('Maintain vehicle:', vehicle);
    // TODO: Implement maintain vehicle functionality
  }
} 