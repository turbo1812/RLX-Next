import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FleetService } from './services/fleet.service';
import { FleetHeaderComponent } from './components/fleet-header/fleet-header.component';
import { FleetActionBarComponent } from './components/fleet-action-bar/fleet-action-bar.component';
import { FleetVehicle, FleetVehicleFilters, VehicleStatus } from './models/fleet-vehicle.model';
import { getStatusSeverity, formatCapacity, formatMileage, getMaintenanceStatus } from './utils/fleet.utils';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    TooltipModule,
    FleetHeaderComponent,
    FleetActionBarComponent
  ],
  template: `
    <div class="fleet-container">
      <!-- Loading Spinner -->
      <p-progressSpinner *ngIf="loading$ | async" 
                        styleClass="p-d-block p-mx-auto p-my-8" 
                        strokeWidth="4" 
                        fill="var(--surface-ground)" 
                        animationDuration=".5s">
      </p-progressSpinner>

      <!-- Error Toast -->
      <p-toast position="top-right"></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Header Section -->
      <app-fleet-header [vehicles]="vehicles$ | async"></app-fleet-header>

      <!-- Action Bar -->
      <app-fleet-action-bar 
        [loading]="loading$ | async"
        (onAddVehicle)="addVehicle()"
        (onScheduleMaintenance)="scheduleMaintenance()"
        (onExportData)="exportData()"
        (onFiltersChange)="onFiltersChange($event)">
      </app-fleet-action-bar>

      <!-- Fleet Table -->
      <div class="fleet-table-card">
        <p-table [value]="filteredVehicles$ | async" 
                 [paginator]="true" 
                 [rows]="10" 
                 [showCurrentPageReport]="true" 
                 responsiveLayout="scroll"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                 [rowsPerPageOptions]="[10,25,50]"
                 [globalFilterFields]="['vehicleNumber','make','model','driver','currentLocation']"
                 styleClass="p-datatable-sm fleet-table">
          
          <ng-template pTemplate="header">
            <tr>
              <th class="fleet-th fleet-th-left">Vehicle #</th>
              <th class="fleet-th fleet-th-left">Vehicle</th>
              <th class="fleet-th fleet-th-center">Type</th>
              <th class="fleet-th fleet-th-center">Status</th>
              <th class="fleet-th fleet-th-left">Driver</th>
              <th class="fleet-th fleet-th-left">Location</th>
              <th class="fleet-th fleet-th-center">Mileage</th>
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
                  <div class="fleet-vehicle-year">{{ vehicle.year }} • {{ formatCapacity(vehicle.capacity) }}</div>
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
                <span class="fleet-mileage">{{ formatMileage(vehicle.mileage) }}</span>
              </td>
              <td class="fleet-td fleet-td-center">
                <div class="fleet-maintenance-info">
                  <span class="fleet-next-maintenance" 
                        [class]="getMaintenanceStatusClass(vehicle.nextMaintenance)">
                    {{ vehicle.nextMaintenance | date:'short' }}
                  </span>
                </div>
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
              <td colspan="9" class="fleet-empty-message">
                <div class="fleet-empty-flex">
                  <i class="pi pi-truck fleet-empty-icon"></i>
                  <div>
                    <h3 class="fleet-empty-title">No Fleet Vehicles Found</h3>
                    <p class="fleet-empty-desc">Try adjusting your search criteria or add a new vehicle</p>
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

    .fleet-mileage {
      color: #a1a1aa;
      font-size: 0.95rem;
    }

    .fleet-maintenance-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .fleet-next-maintenance {
      color: #fbbf24;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .fleet-next-maintenance.maintenance-good {
      color: #22c55e;
    }

    .fleet-next-maintenance.maintenance-warning {
      color: #f59e0b;
    }

    .fleet-next-maintenance.maintenance-critical {
      color: #ef4444;
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
      .fleet-th, .fleet-td { padding: 0.7rem 0.5rem; }
    }

    @media (max-width: 600px) {
      .fleet-container { padding: 1rem 0.25rem; width: 100vw; }
      .fleet-th, .fleet-td { font-size: 0.95rem; padding: 0.5rem 0.2rem; }
    }
  `]
})
export class FleetComponent implements OnInit, OnDestroy {
  vehicles$ = this.fleetService.vehicles$;
  loading$ = this.fleetService.loading$;
  error$ = this.fleetService.error$;
  filteredVehicles$ = this.vehicles$;

  private subscriptions = new Subscription();
  private currentFilters: FleetVehicleFilters = {};

  constructor(private fleetService: FleetService) {}

  ngOnInit(): void {
    this.loadFleetVehicles();
    this.subscribeToErrorState();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadFleetVehicles(): void {
    this.fleetService.loadVehicles();
  }

  private subscribeToErrorState(): void {
    this.subscriptions.add(
      this.error$.subscribe(error => {
        if (error) {
          console.error('Fleet Error:', error);
          // TODO: Show toast notification
        }
      })
    );
  }

  onFiltersChange(filters: FleetVehicleFilters): void {
    this.currentFilters = filters;
    this.fleetService.filterVehicles(filters).subscribe(filtered => {
      // Update filtered vehicles
    });
  }

  // Utility functions
  getStatusSeverity = getStatusSeverity;
  formatCapacity = formatCapacity;
  formatMileage = formatMileage;

  getMaintenanceStatusClass(nextMaintenance: Date | undefined): string {
    if (!nextMaintenance) return '';
    const status = getMaintenanceStatus(nextMaintenance);
    return `maintenance-${status}`;
  }

  // Action handlers
  addVehicle(): void {
    // TODO: Implement add vehicle functionality
    console.log('Add vehicle clicked');
  }

  scheduleMaintenance(): void {
    // TODO: Implement schedule maintenance functionality
    console.log('Schedule maintenance clicked');
  }

  exportData(): void {
    // TODO: Implement export functionality
    console.log('Export data clicked');
  }

  viewVehicle(vehicle: FleetVehicle): void {
    // TODO: Implement view vehicle functionality
    console.log('View vehicle:', vehicle);
  }

  editVehicle(vehicle: FleetVehicle): void {
    // TODO: Implement edit vehicle functionality
    console.log('Edit vehicle:', vehicle);
  }

  maintainVehicle(vehicle: FleetVehicle): void {
    // TODO: Implement maintain vehicle functionality
    console.log('Maintain vehicle:', vehicle);
  }
} 