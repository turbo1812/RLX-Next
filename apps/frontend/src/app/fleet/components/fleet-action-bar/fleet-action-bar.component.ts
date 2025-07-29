import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { VehicleStatus, VehicleType, FleetVehicleFilters } from '../../models/fleet-vehicle.model';

@Component({
  selector: 'app-fleet-action-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule, DropdownModule, InputTextModule],
  template: `
    <div class="fleet-action-bar">
      <div class="fleet-action-flex">
        <div class="fleet-action-btns">
          <p-button label="Add Vehicle" 
                   icon="pi pi-plus" 
                   severity="primary"
                   [disabled]="loading"
                   (onClick)="onAddVehicle.emit()">
          </p-button>
          <p-button label="Schedule Maintenance" 
                   icon="pi pi-wrench" 
                   severity="secondary"
                   [outlined]="true"
                   [disabled]="loading"
                   (onClick)="onScheduleMaintenance.emit()">
          </p-button>
          <p-button label="Export Data" 
                   icon="pi pi-download" 
                   severity="info"
                   [outlined]="true"
                   [disabled]="loading"
                   (onClick)="onExportData.emit()">
          </p-button>
        </div>
        
        <div class="fleet-filter-section">
          <div class="fleet-search">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input pInputText 
                     type="text" 
                     placeholder="Search vehicles..."
                     [(ngModel)]="searchTerm"
                     (input)="onSearchChange()"
                     class="fleet-search-input" />
            </span>
          </div>
          
          <div class="fleet-filters">
            <p-dropdown [options]="statusOptions" 
                      [(ngModel)]="selectedStatus"
                      placeholder="Status"
                      [showClear]="true"
                      (onChange)="onFilterChange()"
                      class="fleet-filter-dropdown">
            </p-dropdown>
            
            <p-dropdown [options]="typeOptions" 
                      [(ngModel)]="selectedType"
                      placeholder="Type"
                      [showClear]="true"
                      (onChange)="onFilterChange()"
                      class="fleet-filter-dropdown">
            </p-dropdown>
            
            <p-button label="Clear Filters" 
                     icon="pi pi-times" 
                     severity="secondary"
                     [text]="true"
                     [disabled]="!hasActiveFilters()"
                     (onClick)="clearFilters()">
            </p-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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

    .fleet-action-btns {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .fleet-filter-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .fleet-search {
      width: 100%;
    }

    .fleet-search-input {
      width: 100%;
      background: #1c1c22 !important;
      border: 1px solid #374151 !important;
      color: #fff !important;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
    }

    .fleet-search-input::placeholder {
      color: #9ca3af !important;
    }

    .fleet-filters {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .fleet-filter-dropdown {
      min-width: 150px;
    }

    :host ::ng-deep .fleet-filter-dropdown .p-dropdown {
      background: #1c1c22 !important;
      border: 1px solid #374151 !important;
      color: #fff !important;
    }

    :host ::ng-deep .fleet-filter-dropdown .p-dropdown-label {
      color: #fff !important;
    }

    :host ::ng-deep .fleet-filter-dropdown .p-dropdown-trigger {
      color: #9ca3af !important;
    }

    :host ::ng-deep .fleet-filter-dropdown .p-dropdown-panel {
      background: #1c1c22 !important;
      border: 1px solid #374151 !important;
    }

    :host ::ng-deep .fleet-filter-dropdown .p-dropdown-item {
      color: #fff !important;
    }

    :host ::ng-deep .fleet-filter-dropdown .p-dropdown-item:hover {
      background: #374151 !important;
    }

    @media (min-width: 768px) {
      .fleet-action-flex {
        flex-direction: row;
        align-items: center;
      }

      .fleet-filter-section {
        flex-direction: row;
        align-items: center;
        width: auto;
      }

      .fleet-search {
        width: 300px;
      }
    }

    @media (max-width: 768px) {
      .fleet-action-bar {
        padding: 1rem;
      }

      .fleet-action-btns {
        justify-content: center;
      }

      .fleet-filters {
        justify-content: center;
      }

      .fleet-filter-dropdown {
        min-width: 120px;
      }
    }

    @media (max-width: 480px) {
      .fleet-action-btns {
        flex-direction: column;
        width: 100%;
      }

      .fleet-action-btns p-button {
        width: 100%;
      }

      .fleet-filters {
        flex-direction: column;
        width: 100%;
      }

      .fleet-filter-dropdown {
        width: 100%;
        min-width: 0;
      }
    }
  `]
})
export class FleetActionBarComponent {
  @Output() onAddVehicle = new EventEmitter<void>();
  @Output() onScheduleMaintenance = new EventEmitter<void>();
  @Output() onExportData = new EventEmitter<void>();
  @Output() onFiltersChange = new EventEmitter<FleetVehicleFilters>();

  loading = false;
  searchTerm = '';
  selectedStatus: VehicleStatus | null = null;
  selectedType: VehicleType | null = null;

  statusOptions = [
    { label: 'Active', value: VehicleStatus.ACTIVE },
    { label: 'Maintenance', value: VehicleStatus.MAINTENANCE },
    { label: 'Out of Service', value: VehicleStatus.OUT_OF_SERVICE },
    { label: 'Available', value: VehicleStatus.AVAILABLE },
    { label: 'In Transit', value: VehicleStatus.IN_TRANSIT }
  ];

  typeOptions = [
    { label: 'Delivery Van', value: VehicleType.DELIVERY_VAN },
    { label: 'Box Truck', value: VehicleType.BOX_TRUCK },
    { label: 'Flatbed', value: VehicleType.FLATBED },
    { label: 'Refrigerated', value: VehicleType.REFRIGERATED },
    { label: 'Pickup', value: VehicleType.PICKUP },
    { label: 'Trailer', value: VehicleType.TRAILER }
  ];

  onSearchChange(): void {
    this.emitFilters();
  }

  onFilterChange(): void {
    this.emitFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = null;
    this.selectedType = null;
    this.emitFilters();
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || !!this.selectedStatus || !!this.selectedType;
  }

  private emitFilters(): void {
    const filters: FleetVehicleFilters = {};
    
    if (this.searchTerm) {
      // Search in vehicle number, make, model, driver, and location
      filters.driver = this.searchTerm;
    }
    
    if (this.selectedStatus) {
      filters.status = this.selectedStatus;
    }
    
    if (this.selectedType) {
      filters.type = this.selectedType;
    }

    this.onFiltersChange.emit(filters);
  }
}