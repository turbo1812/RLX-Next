import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subscription } from 'rxjs';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-warehouse-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CardModule, ButtonModule, InputTextModule, InputNumberModule, DropdownModule, BreadcrumbModule, ProgressSpinnerModule, ToastModule, ConfirmDialogModule],
  template: `
    <div class="warehouse-container">
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
      <div class="warehouse-header">
        <div class="warehouse-header-content">
          <div class="warehouse-title-section">
            <h1 class="warehouse-title">Warehouse Layout Designer</h1>
            <p class="warehouse-subtitle">Design, configure, and optimize your warehouse zones and operational areas</p>
      </div>
          <div class="warehouse-header-actions">
          <p-button label="Save Layout" 
                   icon="pi pi-save" 
                   severity="primary"
                   [disabled]="loading"
                   (onClick)="saveLayout()"></p-button>
          <p-button label="Export Layout" 
                   icon="pi pi-download" 
                   severity="secondary"
                   [disabled]="loading"
                   (onClick)="exportLayout()"></p-button>
          </div>
        </div>
      </div>

      <!-- Actions Bar Section -->
      <div class="warehouse-actions-bar">
        <div class="warehouse-actions-content">
          <div class="warehouse-breadcrumb">
            <p-breadcrumb [model]="breadcrumbItems" [home]="home" />
          </div>
          <div class="warehouse-quick-stats">
            <div class="stat-item">
              <span class="stat-label">Total Zones</span>
              <span class="stat-value">{{ warehouse.zones.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Capacity</span>
              <span class="stat-value">{{ getTotalCapacity() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Utilization</span>
              <span class="stat-value">{{ getUtilizationRate() }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Section -->
      <div class="warehouse-section">
        <div class="section-header">
          <h2 class="section-title">Warehouse Configuration</h2>
          <p class="section-subtitle">Set up warehouse dimensions and basic information</p>
        </div>
        <div class="warehouse-config-grid">
        <!-- Warehouse Information -->
          <div class="warehouse-config-card">
            <p-card header="Basic Information" styleClass="config-card">
              <div class="config-form">
                <div class="form-field">
                  <label for="name">Warehouse Name</label>
                  <input id="name" type="text" pInputText [(ngModel)]="warehouse.name" placeholder="Enter warehouse name" />
                </div>
                <div class="form-row">
                  <div class="form-field">
                    <label for="width">Width (meters)</label>
                    <p-inputNumber id="width" [(ngModel)]="warehouse.width" [min]="1" [max]="1000" placeholder="Width" />
                  </div>
                  <div class="form-field">
                    <label for="height">Height (meters)</label>
                    <p-inputNumber id="height" [(ngModel)]="warehouse.height" [min]="1" [max]="1000" placeholder="Height" />
                </div>
                </div>
                <div class="form-field">
                  <label for="description">Description</label>
                  <textarea id="description" [(ngModel)]="warehouse.description" rows="3" placeholder="Enter warehouse description"></textarea>
                </div>
              </div>
          </p-card>
        </div>

        <!-- Zone Configuration -->
          <div class="warehouse-config-card">
            <p-card header="Add New Zone" styleClass="config-card">
              <div class="config-form">
                <div class="form-field">
                  <label for="zoneType">Zone Type</label>
                  <p-dropdown id="zoneType" [options]="zoneTypes" [(ngModel)]="selectedZoneType" 
                             optionLabel="name" placeholder="Select Zone Type" />
                </div>
                <div class="form-field">
                  <label for="zoneName">Zone Name</label>
                  <input id="zoneName" type="text" pInputText [(ngModel)]="newZone.name" placeholder="Enter zone name" />
                </div>
                <div class="form-row">
                  <div class="form-field">
                    <label for="capacity">Capacity</label>
                    <p-inputNumber id="capacity" [(ngModel)]="newZone.capacity" [min]="1" placeholder="Capacity" />
                  </div>
                  <div class="form-field">
                    <label for="zoneX">X Position</label>
                    <p-inputNumber id="zoneX" [(ngModel)]="newZone.x" [min]="0" placeholder="X" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-field">
                    <label for="zoneY">Y Position</label>
                    <p-inputNumber id="zoneY" [(ngModel)]="newZone.y" [min]="0" placeholder="Y" />
                  </div>
                  <div class="form-field">
                    <label for="zoneWidth">Width</label>
                    <p-inputNumber id="zoneWidth" [(ngModel)]="newZone.width" [min]="1" placeholder="Width" />
                  </div>
                </div>
                <div class="form-field">
                  <label for="zoneHeight">Height</label>
                  <p-inputNumber id="zoneHeight" [(ngModel)]="newZone.height" [min]="1" placeholder="Height" />
                </div>
                <p-button label="Add Zone" 
                         icon="pi pi-plus" 
                         (onClick)="addZone()"
                         [disabled]="!newZone.name || !selectedZoneType || loading"
                         class="add-zone-btn"></p-button>
              </div>
          </p-card>
          </div>
        </div>
                </div>
                
      <!-- Layout Preview Section -->
      <div class="warehouse-section">
        <div class="section-header">
          <h2 class="section-title">Layout Preview</h2>
          <p class="section-subtitle">Visual representation of your warehouse layout and zones</p>
        </div>
        <div class="warehouse-layout-container">
          <p-card styleClass="layout-card">
            <div class="layout-header">
              <div class="layout-info">
                <h3>{{ warehouse.name }}</h3>
                <span class="layout-dimensions">{{ warehouse.width }}m × {{ warehouse.height }}m</span>
              </div>
              <div class="layout-actions">
                <p-button icon="pi pi-refresh" 
                         styleClass="p-button-text p-button-sm" 
                         (onClick)="resetLayout()"
                         pTooltip="Reset Layout"></p-button>
                <p-button icon="pi pi-eye" 
                         styleClass="p-button-text p-button-sm" 
                         (onClick)="toggleFullscreen()"
                         pTooltip="Fullscreen View"></p-button>
              </div>
            </div>
            <div class="layout-canvas-wrapper">
              <div class="layout-canvas"
                     [style.width]="warehouse.width + 'px'"
                     [style.height]="warehouse.height + 'px'"
                     [style.max-width]="'100%'"
                   [style.max-height]="'500px'">
                  <!-- Zones -->
                  <div *ngFor="let zone of warehouse.zones" 
                     class="layout-zone"
                       [style.left]="zone.x + 'px'"
                       [style.top]="zone.y + 'px'"
                       [style.width]="zone.width + 'px'"
                       [style.height]="zone.height + 'px'"
                     [ngClass]="'zone-' + zone.type"
                       (click)="editZone(zone)">
                  <div class="zone-content">
                    <div class="zone-name">{{ zone.name }}</div>
                    <div class="zone-type">{{ zone.type }}</div>
                    <div class="zone-capacity">{{ zone.currentOccupancy }}/{{ zone.capacity }}</div>
                  </div>
                </div>
                  <!-- Empty State -->
                <div *ngIf="warehouse.zones.length === 0" class="layout-empty">
                  <div class="empty-icon">
                    <i class="pi pi-building"></i>
                  </div>
                  <h4>No Zones Configured</h4>
                  <p>Start by adding zones using the configuration panel above</p>
                </div>
              </div>
            </div>
          </p-card>
                  </div>
                </div>
                
      <!-- Zones Management Section -->
      <div class="warehouse-section" *ngIf="warehouse.zones.length > 0">
        <div class="section-header">
          <h2 class="section-title">Zone Management</h2>
          <p class="section-subtitle">Manage and monitor your warehouse zones</p>
        </div>
        <div class="zones-grid">
          <div *ngFor="let zone of warehouse.zones" class="zone-card">
            <p-card styleClass="zone-management-card">
              <div class="zone-card-header">
                <div class="zone-card-info">
                  <h4>{{ zone.name }}</h4>
                  <span class="zone-type-badge" [ngClass]="'badge-' + zone.type">{{ zone.type }}</span>
                          </div>
                <div class="zone-card-actions">
                            <p-button icon="pi pi-pencil" 
                           styleClass="p-button-text p-button-sm p-button-warning"
                                     (onClick)="editZone(zone)"
                                     pTooltip="Edit Zone"></p-button>
                            <p-button icon="pi pi-trash" 
                           styleClass="p-button-text p-button-sm p-button-danger"
                                     (onClick)="deleteZone(zone)"
                                     pTooltip="Delete Zone"></p-button>
                          </div>
                        </div>
              <div class="zone-card-content">
                <div class="zone-stats">
                  <div class="stat">
                    <span class="stat-label">Capacity</span>
                    <span class="stat-value">{{ zone.capacity }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Occupancy</span>
                    <span class="stat-value">{{ zone.currentOccupancy }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Utilization</span>
                    <span class="stat-value">{{ getZoneUtilization(zone) }}%</span>
                      </div>
                    </div>
                <div class="zone-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width]="getZoneUtilization(zone) + '%'"></div>
                  </div>
                </div>
              </div>
          </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .warehouse-container {
      width: 100vw;
      min-height: 100vh;
      background: #18181b;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Header Section */
    .warehouse-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      padding: 2.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .warehouse-header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .warehouse-title-section {
      flex: 1;
    }

    .warehouse-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .warehouse-subtitle {
      color: #cbd5e1;
      font-size: 1.1rem;
      margin: 0;
      line-height: 1.5;
    }

    .warehouse-header-actions {
      display: flex;
      gap: 1rem;
    }

    /* Actions Bar Section */
    .warehouse-actions-bar {
      background: #1e293b;
      padding: 1.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .warehouse-actions-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .warehouse-quick-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-label {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      color: #f8fafc;
      font-size: 1.2rem;
      font-weight: 600;
    }

    /* Section Styling */
    .warehouse-section {
      padding: 3rem 0;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .section-header {
      text-align: center;
      margin-bottom: 2.5rem;
      padding: 0 2rem;
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }

    .section-subtitle {
      color: #94a3b8;
      font-size: 1rem;
      margin: 0;
    }

    /* Configuration Grid */
    .warehouse-config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      padding: 0 2rem;
    }

    .warehouse-config-card {
      background: transparent;
    }

    .config-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-field label {
      color: #cbd5e1;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .add-zone-btn {
      margin-top: 0.5rem;
    }

    /* Layout Container */
    .warehouse-layout-container {
      padding: 0 2rem;
    }

    .layout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .layout-info h3 {
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
      font-size: 1.2rem;
    }

    .layout-dimensions {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .layout-actions {
      display: flex;
      gap: 0.5rem;
    }

    .layout-canvas-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .layout-canvas {
      background: #0f172a;
      border: 2px dashed #475569;
      border-radius: 1rem;
      position: relative;
      overflow: hidden;
      min-width: 300px;
      min-height: 200px;
      max-width: 100%;
      max-height: 500px;
      margin: 0 auto;
      transition: all 0.3s ease;
    }

    .layout-canvas:hover {
      border-color: #6366f1;
    }

    .layout-zone {
      position: absolute;
      border: 2px solid;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .layout-zone:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .zone-storage {
      background: rgba(59, 130, 246, 0.2);
      border-color: #3b82f6;
    }

    .zone-picking {
      background: rgba(16, 185, 129, 0.2);
      border-color: #10b981;
    }

    .zone-receiving {
      background: rgba(245, 158, 11, 0.2);
      border-color: #f59e0b;
    }

    .zone-shipping {
      background: rgba(139, 92, 246, 0.2);
      border-color: #8b5cf6;
    }

    .zone-cross-dock {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
    }

    .zone-content {
      text-align: center;
      padding: 0.5rem;
    }

    .zone-name {
      font-weight: 600;
      color: #f8fafc;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .zone-type {
      color: #cbd5e1;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .zone-capacity {
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .layout-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #64748b;
      text-align: center;
      padding: 2rem;
    }

    .empty-icon {
      font-size: 3rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .layout-empty h4 {
      color: #94a3b8;
      margin: 0 0 0.5rem 0;
    }

    .layout-empty p {
      color: #64748b;
      margin: 0;
    }

    /* Zones Management */
    .zones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 0 2rem;
    }

    .zone-card {
      background: transparent;
    }

    .zone-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .zone-card-info h4 {
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .zone-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-storage { background: #1e40af; color: #dbeafe; }
    .badge-picking { background: #065f46; color: #d1fae5; }
    .badge-receiving { background: #92400e; color: #fef3c7; }
    .badge-shipping { background: #5b21b6; color: #e9d5ff; }
    .badge-cross-dock { background: #991b1b; color: #fee2e2; }

    .zone-card-actions {
      display: flex;
      gap: 0.25rem;
    }

    .zone-card-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .zone-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat .stat-label {
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .stat .stat-value {
      color: #f8fafc;
      font-size: 1rem;
      font-weight: 600;
    }

    .zone-progress {
      width: 100%;
    }

    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #334155;
      border-radius: 0.25rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      transition: width 0.3s ease;
    }

    /* Card Styling */
    ::ng-deep .config-card,
    ::ng-deep .layout-card,
    ::ng-deep .zone-management-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
      border-radius: 1rem !important;
      color: #f8fafc !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid #475569 !important;
    }

    ::ng-deep .config-card .p-card-header,
    ::ng-deep .layout-card .p-card-header,
    ::ng-deep .zone-management-card .p-card-header {
      background: transparent !important;
      border-bottom: 1px solid #475569 !important;
      color: #f8fafc !important;
      font-weight: 600;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
    }

    ::ng-deep .config-card .p-card-body,
    ::ng-deep .layout-card .p-card-body,
    ::ng-deep .zone-management-card .p-card-body {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .warehouse-config-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .warehouse-header-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .warehouse-actions-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }

      .warehouse-quick-stats {
        justify-content: space-around;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .zones-grid {
        grid-template-columns: 1fr;
      }

      .warehouse-title {
        font-size: 2rem;
      }

      .section-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class WarehouseSetupComponent implements OnInit, OnDestroy {
  warehouse = {
    id: '1',
    name: 'Main Warehouse',
    width: 800,
    height: 600,
    description: 'Primary warehouse facility',
    zones: [] as any[]
  };

  zoneTypes = [
    { name: 'Storage', value: 'storage' },
    { name: 'Picking', value: 'picking' },
    { name: 'Receiving', value: 'receiving' },
    { name: 'Shipping', value: 'shipping' },
    { name: 'Cross Dock', value: 'cross-dock' }
  ];

  selectedZoneType = this.zoneTypes[0];
  newZone = {
    name: '',
    type: '',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    capacity: 100
  };

  loading = false;
  private subscriptions = new Subscription();

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Warehouse Setup', routerLink: '/warehouse-setup' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadWarehouseLayout();
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

  private loadWarehouseLayout(): void {
    this.subscriptions.add(
      this.apiService.getWarehouseLayout().subscribe({
        next: (layout) => {
          this.warehouse = layout;
        },
        error: (error) => {
          console.error('Failed to load warehouse layout:', error);
          // Fallback to mock data if API fails
          this.loadMockData();
        }
      })
    );
  }

  private loadMockData(): void {
    // Fallback mock data
    this.warehouse = {
      id: '1',
      name: 'Main Warehouse',
      width: 800,
      height: 600,
      description: 'Primary warehouse facility',
      zones: [
        {
          id: '1',
          name: 'Storage Zone A',
          type: 'storage',
          x: 50,
          y: 50,
          width: 200,
          height: 150,
          capacity: 500,
          currentOccupancy: 300
        },
        {
          id: '2',
          name: 'Picking Zone B',
          type: 'picking',
          x: 300,
          y: 50,
          width: 150,
          height: 100,
          capacity: 200,
          currentOccupancy: 150
        },
        {
          id: '3',
          name: 'Receiving Dock',
          type: 'receiving',
          x: 50,
          y: 250,
          width: 300,
          height: 80,
          capacity: 1000,
          currentOccupancy: 0
        }
      ]
    };
  }

  addZone(): void {
    if (this.newZone.name && this.selectedZoneType) {
      const zone = {
        id: Date.now().toString(),
        name: this.newZone.name,
        type: this.selectedZoneType.value,
        x: this.newZone.x,
        y: this.newZone.y,
        width: this.newZone.width,
        height: this.newZone.height,
        capacity: this.newZone.capacity,
        currentOccupancy: 0
      };

      this.warehouse.zones.push(zone);
      this.resetNewZone();
    }
  }

  editZone(zone: any): void {
    // TODO: Implement edit zone functionality
    console.log('Edit zone:', zone);
  }

  deleteZone(zone: any): void {
    const index = this.warehouse.zones.findIndex(z => z.id === zone.id);
    if (index > -1) {
      this.warehouse.zones.splice(index, 1);
    }
  }

  saveLayout(): void {
    // TODO: Implement save layout functionality
    console.log('Save layout clicked');
  }

  exportLayout(): void {
    // TODO: Implement export layout functionality
    console.log('Export layout clicked');
  }

  resetLayout(): void {
    // TODO: Implement reset layout functionality
    console.log('Reset layout clicked');
  }

  toggleFullscreen(): void {
    // TODO: Implement fullscreen view functionality
    console.log('Toggle fullscreen clicked');
  }

  getTotalCapacity(): number {
    return this.warehouse.zones.reduce((total, zone) => total + zone.capacity, 0);
  }

  getUtilizationRate(): number {
    const totalCapacity = this.getTotalCapacity();
    const totalOccupancy = this.warehouse.zones.reduce((total, zone) => total + zone.currentOccupancy, 0);
    return totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
  }

  getZoneUtilization(zone: any): number {
    return zone.capacity > 0 ? Math.round((zone.currentOccupancy / zone.capacity) * 100) : 0;
  }

  private resetNewZone(): void {
    this.newZone = {
      name: '',
      type: '',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      capacity: 100
    };
  }
} 