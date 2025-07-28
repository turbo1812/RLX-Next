import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, BreadcrumbModule, ProgressSpinnerModule, ToastModule, ConfirmDialogModule, TagModule],
  template: `
    <div class="fleet-container">
      <!-- Loading Spinner -->
      <p-progressSpinner *ngIf="loading" 
                        styleClass="p-d-block p-mx-auto p-my-8" 
                        strokeWidth="4" 
                        fill="var(--surface-ground)" 
                        animationDuration=".5s">
      </p-progressSpinner>

      <!-- Error Toast -->
      <p-toast position="top-right"></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Header Section -->
      <div class="fleet-header-card">
        <div class="fleet-header-flex">
          <div>
            <h1 class="fleet-title">
              Fleet Management
            </h1>
            <p class="fleet-subtitle">Manage delivery vehicles and maintenance schedules</p>
          </div>
          <div class="fleet-summary-flex">
            <div class="fleet-summary-card">
              <p class="fleet-summary-label">Total Vehicles</p>
              <p class="fleet-summary-value">{{ fleetVehicles.length }}</p>
            </div>
            <div class="fleet-summary-divider"></div>
            <div class="fleet-summary-card">
              <p class="fleet-summary-label">Active</p>
              <p class="fleet-summary-value fleet-summary-active">{{ getActiveCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="fleet-action-bar">
        <div class="fleet-action-flex">
          <div class="fleet-action-btns">
            <p-button label="Add Vehicle" 
                     icon="pi pi-plus" 
                     severity="primary"
                     [disabled]="loading"
                     (onClick)="addVehicle()"></p-button>
            <p-button label="Schedule Maintenance" 
                     icon="pi pi-wrench" 
                     severity="secondary"
                     [outlined]="true"
                     [disabled]="loading"
                     (onClick)="scheduleMaintenance()"></p-button>
          </div>
          <div class="fleet-filter-flex">
            <span class="fleet-filter-label">Filter by:</span>
            <p-button label="All" styleClass="p-button-sm" [outlined]="true"></p-button>
            <p-button label="Active" styleClass="p-button-sm" [outlined]="true"></p-button>
            <p-button label="Maintenance" styleClass="p-button-sm" [outlined]="true"></p-button>
          </div>
        </div>
      </div>

      <!-- Fleet Table -->
      <div class="fleet-table-card">
        <p-table [value]="fleetVehicles" 
                 [paginator]="true" 
                 [rows]="10" 
                 [showCurrentPageReport]="true" 
                 responsiveLayout="scroll"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                 [rowsPerPageOptions]="[10,25,50]"
                 [globalFilterFields]="['vehicleNumber','make','model','driver']"
                 styleClass="p-datatable-sm fleet-table">
          <ng-template pTemplate="header">
            <tr>
              <th class="fleet-th fleet-th-left">Vehicle #</th>
              <th class="fleet-th fleet-th-left">Vehicle</th>
              <th class="fleet-th fleet-th-center">Type</th>
              <th class="fleet-th fleet-th-center">Status</th>
              <th class="fleet-th fleet-th-left">Driver</th>
              <th class="fleet-th fleet-th-left">Location</th>
              <th class="fleet-th fleet-th-center">Next Maintenance</th>
              <th class="fleet-th fleet-th-center">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-vehicle>
            <tr class="fleet-row">
              <td class="fleet-td fleet-td-left">
                <span class="fleet-vehicle-number">{{ vehicle.vehicleNumber }}</span>
              </td>
              <td class="fleet-td fleet-td-left">
                <div>
                  <div class="fleet-vehicle-name">{{ vehicle.make }} {{ vehicle.model }}</div>
                  <div class="fleet-vehicle-year">{{ vehicle.year }}</div>
                </div>
              </td>
              <td class="fleet-td fleet-td-center">
                <span class="fleet-type-badge">{{ vehicle.type }}</span>
              </td>
              <td class="fleet-td fleet-td-center">
                <p-tag [value]="vehicle.status" 
                      [severity]="getStatusSeverity(vehicle.status)"
                      styleClass="fleet-status-tag">
                </p-tag>
              </td>
              <td class="fleet-td fleet-td-left">
                <span class="fleet-driver">{{ vehicle.driver || 'Unassigned' }}</span>
              </td>
              <td class="fleet-td fleet-td-left">
                <div class="fleet-location-flex">
                  <i class="pi pi-map-marker fleet-location-icon"></i>
                  <span class="fleet-location">{{ vehicle.currentLocation || 'Unknown' }}</span>
                </div>
              </td>
              <td class="fleet-td fleet-td-center">
                <span class="fleet-next-maintenance">{{ vehicle.nextMaintenance | date:'short' }}</span>
              </td>
              <td class="fleet-td fleet-td-center">
                <div class="fleet-actions-flex">
                  <p-button icon="pi pi-eye" 
                           styleClass="p-button-sm p-button-text p-button-primary"
                           (onClick)="viewVehicle(vehicle)"
                           pTooltip="View Details"></p-button>
                  <p-button icon="pi pi-pencil" 
                           styleClass="p-button-sm p-button-text p-button-warning"
                           (onClick)="editVehicle(vehicle)"
                           pTooltip="Edit Vehicle"></p-button>
                  <p-button icon="pi pi-wrench" 
                           styleClass="p-button-sm p-button-text p-button-info"
                           (onClick)="maintainVehicle(vehicle)"
                           pTooltip="Maintain Vehicle"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="fleet-empty-message">
                <div class="fleet-empty-flex">
                  <i class="pi pi-truck fleet-empty-icon"></i>
                  <div>
                    <h3 class="fleet-empty-title">No Fleet Vehicles</h3>
                    <p class="fleet-empty-desc">Start by adding your first vehicle</p>
                  </div>
                  <p-button label="Add First Vehicle" 
                           icon="pi pi-plus" 
                           severity="primary"
                           (onClick)="addVehicle()"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [`
    .fleet-container {
      width: 100vw;
      min-height: 100vh;
      padding: 2rem 2vw;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      background: #18181b;
      height: 100vh;
      box-sizing: border-box;
    }
    .fleet-header-card {
      width: 100%;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
      background: #23232a !important;
      border-radius: 1.25rem;
      box-shadow: 0 2px 12px 0 rgba(30,41,59,0.10);
      margin-bottom: 1.5rem;
      padding: 2rem 2.5rem;
      color: #fff !important;
    }
    .fleet-header-flex {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 2rem;
    }
    .fleet-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .fleet-subtitle {
      color: #a1a1aa;
      font-size: 1.15rem;
      margin-top: 0.5rem;
    }
    .fleet-summary-flex {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 2rem;
      justify-content: center;
    }
    .fleet-summary-card {
      flex: 1 1 220px;
      background: #23232a;
      border-radius: 1rem;
      box-shadow: 0 2px 8px 0 rgba(30,41,59,0.08);
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.5rem;
      min-width: 220px;
      max-width: 320px;
      text-align: right;
    }
    .fleet-summary-label {
      color: #a1a1aa;
      font-size: 0.95rem;
      font-weight: 500;
    }
    .fleet-summary-value {
      font-size: 1.7rem;
      font-weight: 700;
      color: #fff;
    }
    .fleet-summary-active {
      color: #22c55e;
    }
    .fleet-summary-divider {
      width: 2px;
      height: 3rem;
      background: #e5e7eb;
      border-radius: 1rem;
    }
    .fleet-action-bar {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      width: 100%;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
      background: #23232a !important;
      border-radius: 1.25rem;
      box-shadow: 0 2px 12px 0 rgba(30,41,59,0.10);
      padding: 1.5rem 2.5rem;
      color: #fff !important;
    }
    .fleet-action-flex {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
    }
    @media (min-width: 768px) {
      .fleet-action-flex {
        flex-direction: row;
        align-items: center;
      }
    }
    .fleet-action-btns {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
    .fleet-filter-flex {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }
    .fleet-filter-label {
      color: #a1a1aa;
      font-size: 0.95rem;
      margin-right: 0.5rem;
    }
    .fleet-table-card {
      background: #23232a !important;
      border-radius: 1.25rem;
      box-shadow: 0 2px 12px 0 rgba(30,41,59,0.10);
      overflow: hidden;
      padding-bottom: 1rem;
      flex: 1 1 auto;
      min-height: 0;
      max-width: 1400px;
      margin-bottom: 2rem;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      flex-direction: column;
      color: #fff !important;
    }
    .fleet-table {
      width: 100%;
      background: transparent;
      border-radius: 0 0 1.25rem 1.25rem;
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
    }
    .fleet-th, .fleet-td {
      padding: 1rem 1.25rem;
      font-size: 1.05rem;
      color: #e4e4e7 !important;
      background: transparent !important;
    }
    .fleet-th {
      background: #23232a !important;
      font-weight: 700;
      color: #fff !important;
      border-bottom: 1px solid #27272a;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .fleet-th-left { text-align: left; }
    .fleet-th-center { text-align: center; }
    .fleet-th-right { text-align: right; }
    .fleet-td-left { text-align: left; }
    .fleet-td-center { text-align: center; }
    .fleet-td-right { text-align: right; }
    .fleet-row:hover {
      background: #1c1c22 !important;
    }
    .fleet-vehicle-number {
      font-weight: 600;
      color: #60a5fa !important;
    }
    .fleet-vehicle-name {
      font-weight: 500;
      color: #fff;
    }
    .fleet-vehicle-year {
      color: #a1a1aa;
      font-size: 0.95rem;
    }
    .fleet-type-badge {
      background: #3730a3;
      color: #fff;
      border-radius: 0.5rem;
      padding: 0.2rem 0.7rem;
      font-size: 0.98rem;
      font-weight: 500;
    }
    .fleet-status-tag {
      font-size: 0.95rem;
      border-radius: 0.5rem;
      padding: 0.25rem 0.75rem;
    }
    .fleet-driver {
      color: #a1a1aa;
      font-size: 0.98rem;
    }
    .fleet-location-flex {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .fleet-location-icon {
      font-size: 1.1rem;
      color: #60a5fa;
    }
    .fleet-location {
      color: #a1a1aa;
    }
    .fleet-next-maintenance {
      color: #fbbf24;
      font-weight: 600;
    }
    .fleet-actions-flex {
      display: flex;
      flex-direction: row;
      gap: 0.25rem;
      justify-content: center;
    }
    .fleet-empty-message {
      padding: 3rem 0;
      text-align: center;
      background: #18181b !important;
    }
    .fleet-empty-flex {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .fleet-empty-icon {
      font-size: 3rem;
      color: #a1a1aa;
    }
    .fleet-empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #fff !important;
    }
    .fleet-empty-desc {
      color: #a1a1aa !important;
      font-size: 1rem;
    }
    @media (max-width: 900px) {
      .fleet-summary-flex { flex-direction: column; gap: 1rem; align-items: center; }
      .fleet-header-flex { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      .fleet-th, .fleet-td { padding: 0.7rem 0.5rem; }
    }
    @media (max-width: 600px) {
      .fleet-container { padding: 1rem 0.25rem; width: 100vw; }
      .fleet-summary-card { min-width: 0; max-width: 100%; padding: 1rem; }
      .fleet-header-flex { padding: 0.7rem; }
      .fleet-th, .fleet-td { font-size: 0.95rem; padding: 0.5rem 0.2rem; }
    }
  `]
})
export class FleetComponent implements OnInit, OnDestroy {
  fleetVehicles: any[] = [];
  loading = false;
  private subscriptions = new Subscription();

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Fleet', routerLink: '/fleet' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadFleetVehicles();
    this.subscribeToApiStates();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToApiStates(): void {
    // Subscribe to loading state
    this.subscriptions.add(
      this.apiService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    // Subscribe to error state
    this.subscriptions.add(
      this.apiService.error$.subscribe(error => {
        if (error) {
          console.error('API Error:', error);
        }
      })
    );
  }

  private loadFleetVehicles(): void {
    this.subscriptions.add(
      this.apiService.getFleetVehicles().subscribe({
        next: (vehicles) => {
          this.fleetVehicles = vehicles;
        },
        error: (error) => {
          console.error('Failed to load fleet vehicles:', error);
          // Fallback to mock data if API fails
          this.loadMockData();
        }
      })
    );
  }

  private loadMockData(): void {
    // Fallback mock data
    this.fleetVehicles = [
      {
        vehicleNumber: 'TRK-001',
        make: 'Ford',
        model: 'Transit',
        year: 2022,
        type: 'Delivery Van',
        status: 'Active',
        currentLocation: 'Warehouse A',
        lastMaintenance: new Date('2024-01-01'),
        nextMaintenance: new Date('2024-02-01'),
        driver: 'John Smith',
        capacity: 1000
      },
      {
        vehicleNumber: 'TRK-002',
        make: 'Mercedes',
        model: 'Sprinter',
        year: 2021,
        type: 'Delivery Van',
        status: 'Maintenance',
        currentLocation: 'Service Center',
        lastMaintenance: new Date('2024-01-15'),
        nextMaintenance: new Date('2024-01-20'),
        driver: 'Jane Doe',
        capacity: 1200
      },
      {
        vehicleNumber: 'TRK-003',
        make: 'Isuzu',
        model: 'NQR',
        year: 2023,
        type: 'Box Truck',
        status: 'Active',
        currentLocation: 'Route 101',
        lastMaintenance: new Date('2024-01-10'),
        nextMaintenance: new Date('2024-02-10'),
        driver: 'Bob Johnson',
        capacity: 3000
      }
    ];
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'maintenance': return 'warn';
      case 'out of service': return 'danger';
      case 'available': return 'info';
      default: return 'secondary';
    }
  }

  getActiveCount(): number {
    return this.fleetVehicles.filter(vehicle => vehicle.status === 'Active').length;
  }

  addVehicle(): void {
    // TODO: Implement add vehicle functionality
    console.log('Add vehicle clicked');
  }

  scheduleMaintenance(): void {
    // TODO: Implement schedule maintenance functionality
    console.log('Schedule maintenance clicked');
  }

  viewVehicle(vehicle: any): void {
    // TODO: Implement view vehicle functionality
    console.log('View vehicle:', vehicle);
  }

  editVehicle(vehicle: any): void {
    // TODO: Implement edit vehicle functionality
    console.log('Edit vehicle:', vehicle);
  }

  maintainVehicle(vehicle: any): void {
    // TODO: Implement maintain vehicle functionality
    console.log('Maintain vehicle:', vehicle);
  }
} 