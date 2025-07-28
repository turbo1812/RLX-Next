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
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, CardModule, ButtonModule, InputTextModule, 
    InputNumberModule, DropdownModule, BreadcrumbModule, ProgressSpinnerModule, 
    ToastModule, ConfirmDialogModule, TableModule, ChartModule, DialogModule
  ],
  template: `
    <div class="storage-container">
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
      <div class="storage-header">
        <div class="storage-header-content">
          <div class="storage-title-section">
            <h1 class="storage-title">Storage Management</h1>
            <p class="storage-subtitle">Optimize storage locations, capacity planning, and space utilization across your warehouse</p>
          </div>
          <div class="storage-header-actions">
            <p-button label="Add Location" 
                     icon="pi pi-plus" 
                     severity="primary"
                     [disabled]="loading"
                     (onClick)="addStorageLocation()"></p-button>
            <p-button label="Export Report" 
                     icon="pi pi-download" 
                     severity="secondary"
                     [disabled]="loading"
                     (onClick)="exportStorageReport()"></p-button>
          </div>
        </div>
      </div>

      <!-- Actions Bar Section -->
      <div class="storage-actions-bar">
        <div class="storage-actions-content">
          <div class="storage-breadcrumb">
            <p-breadcrumb [model]="breadcrumbItems" [home]="home" />
          </div>
          <div class="storage-quick-stats">
            <div class="stat-item">
              <span class="stat-label">Total Locations</span>
              <span class="stat-value">{{ storageStats.totalLocations }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Utilization</span>
              <span class="stat-value">{{ storageStats.utilization }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Available Space</span>
              <span class="stat-value">{{ storageStats.availableSpace }}m³</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Storage Overview Section -->
      <div class="storage-section">
        <div class="section-header">
          <h2 class="section-title">Storage Overview</h2>
          <p class="section-subtitle">Key metrics and performance indicators for your storage operations</p>
        </div>
        <div class="storage-kpi-grid">
          <div class="storage-kpi-card">
            <div class="kpi-icon total-icon">
              <i class="pi pi-database"></i>
            </div>
            <div class="kpi-content">
              <div class="storage-kpi-label">Total Storage Space</div>
              <div class="storage-kpi-value">{{ storageStats.totalSpace }}m³</div>
              <div class="storage-kpi-trend" [ngClass]="{'up': storageStats.spaceChange > 0, 'down': storageStats.spaceChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': storageStats.spaceChange > 0, 'pi-arrow-down': storageStats.spaceChange < 0}"></i>
                {{ storageStats.spaceChange > 0 ? '+' : '' }}{{ storageStats.spaceChange }}% vs last month
              </div>
            </div>
          </div>
          <div class="storage-kpi-card">
            <div class="kpi-icon occupied-icon">
              <i class="pi pi-box"></i>
            </div>
            <div class="kpi-content">
              <div class="storage-kpi-label">Occupied Space</div>
              <div class="storage-kpi-value">{{ storageStats.occupiedSpace }}m³</div>
              <div class="storage-kpi-trend" [ngClass]="{'up': storageStats.occupiedChange > 0, 'down': storageStats.occupiedChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': storageStats.occupiedChange > 0, 'pi-arrow-down': storageStats.occupiedChange < 0}"></i>
                {{ storageStats.occupiedChange > 0 ? '+' : '' }}{{ storageStats.occupiedChange }}% vs last month
              </div>
            </div>
          </div>
          <div class="storage-kpi-card">
            <div class="kpi-icon efficiency-icon">
              <i class="pi pi-chart-line"></i>
            </div>
            <div class="kpi-content">
              <div class="storage-kpi-label">Storage Efficiency</div>
              <div class="storage-kpi-value">{{ storageStats.efficiency }}%</div>
              <div class="storage-kpi-trend" [ngClass]="{'up': storageStats.efficiencyChange > 0, 'down': storageStats.efficiencyChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': storageStats.efficiencyChange > 0, 'pi-arrow-down': storageStats.efficiencyChange < 0}"></i>
                {{ storageStats.efficiencyChange > 0 ? '+' : '' }}{{ storageStats.efficiencyChange }}% vs last month
              </div>
            </div>
          </div>
          <div class="storage-kpi-card">
            <div class="kpi-icon turnover-icon">
              <i class="pi pi-refresh"></i>
            </div>
            <div class="kpi-content">
              <div class="storage-kpi-label">Turnover Rate</div>
              <div class="storage-kpi-value">{{ storageStats.turnoverRate }}x</div>
              <div class="storage-kpi-trend" [ngClass]="{'up': storageStats.turnoverChange > 0, 'down': storageStats.turnoverChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': storageStats.turnoverChange > 0, 'pi-arrow-down': storageStats.turnoverChange < 0}"></i>
                {{ storageStats.turnoverChange > 0 ? '+' : '' }}{{ storageStats.turnoverChange }}% vs last month
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Storage Locations Section -->
      <div class="storage-section">
        <div class="section-header">
          <h2 class="section-title">Storage Locations</h2>
          <p class="section-subtitle">Manage and monitor individual storage locations and their utilization</p>
        </div>
        <div class="storage-locations-grid">
          <div *ngFor="let location of storageLocations" class="location-card">
            <p-card styleClass="location-management-card">
              <div class="location-card-header">
                <div class="location-card-info">
                  <h4>{{ location.name }}</h4>
                  <span class="location-type-badge" [ngClass]="'badge-' + location.type">{{ location.type }}</span>
                </div>
                <div class="location-card-actions">
                  <p-button icon="pi pi-pencil" 
                           styleClass="p-button-text p-button-sm p-button-warning"
                           (onClick)="editLocation(location)"
                           pTooltip="Edit Location"></p-button>
                  <p-button icon="pi pi-trash" 
                           styleClass="p-button-text p-button-sm p-button-danger"
                           (onClick)="deleteLocation(location)"
                           pTooltip="Delete Location"></p-button>
                </div>
              </div>
              <div class="location-card-content">
                <div class="location-stats">
                  <div class="stat">
                    <span class="stat-label">Capacity</span>
                    <span class="stat-value">{{ location.capacity }}m³</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Used</span>
                    <span class="stat-value">{{ location.used }}m³</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Utilization</span>
                    <span class="stat-value">{{ getLocationUtilization(location) }}%</span>
                  </div>
                </div>
                <div class="location-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width]="getLocationUtilization(location) + '%'"></div>
                  </div>
                </div>
                <div class="location-details">
                  <div class="detail-item">
                    <span class="detail-label">Zone:</span>
                    <span class="detail-value">{{ location.zone }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" [ngClass]="'status-' + location.status">{{ location.status }}</span>
                  </div>
                </div>
              </div>
            </p-card>
          </div>
        </div>
      </div>

      <!-- Capacity Planning Section -->
      <div class="storage-section">
        <div class="section-header">
          <h2 class="section-title">Capacity Planning</h2>
          <p class="section-subtitle">Forecast storage needs and plan capacity expansion</p>
        </div>
        <div class="capacity-planning-grid">
          <div class="capacity-chart-card">
            <p-card header="Storage Utilization Trend" styleClass="chart-card">
              <p-chart type="line" [data]="utilizationChartData" [options]="chartOptions" style="height: 300px;"></p-chart>
            </p-card>
          </div>
          <div class="capacity-forecast-card">
            <p-card header="Capacity Forecast" styleClass="chart-card">
              <div class="forecast-content">
                <div class="forecast-item">
                  <span class="forecast-label">Next 30 Days</span>
                  <span class="forecast-value">{{ capacityForecast.next30Days }}m³ needed</span>
                </div>
                <div class="forecast-item">
                  <span class="forecast-label">Next 90 Days</span>
                  <span class="forecast-value">{{ capacityForecast.next90Days }}m³ needed</span>
                </div>
                <div class="forecast-item">
                  <span class="forecast-label">Next 6 Months</span>
                  <span class="forecast-value">{{ capacityForecast.next6Months }}m³ needed</span>
                </div>
                <div class="forecast-recommendation">
                  <h5>Recommendation</h5>
                  <p>{{ capacityForecast.recommendation }}</p>
                </div>
              </div>
            </p-card>
          </div>
        </div>
      </div>

      <!-- Storage Optimization Section -->
      <div class="storage-section">
        <div class="section-header">
          <h2 class="section-title">Storage Optimization</h2>
          <p class="section-subtitle">AI-powered recommendations for optimal storage utilization</p>
        </div>
        <div class="optimization-grid">
          <div *ngFor="let recommendation of optimizationRecommendations" class="optimization-card">
            <p-card styleClass="optimization-card">
              <div class="optimization-header">
                <div class="optimization-icon" [ngClass]="'icon-' + recommendation.type">
                  <i class="pi" [ngClass]="recommendation.icon"></i>
                </div>
                <div class="optimization-info">
                  <h4>{{ recommendation.title }}</h4>
                  <span class="optimization-priority" [ngClass]="'priority-' + recommendation.priority">{{ recommendation.priority }}</span>
                </div>
              </div>
              <div class="optimization-content">
                <p>{{ recommendation.description }}</p>
                <div class="optimization-impact">
                  <span class="impact-label">Potential Impact:</span>
                  <span class="impact-value">{{ recommendation.impact }}</span>
                </div>
                <p-button label="Apply Recommendation" 
                         icon="pi pi-check" 
                         size="small"
                         (onClick)="applyRecommendation(recommendation)"></p-button>
              </div>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .storage-container {
      width: 100vw;
      min-height: 100vh;
      background: #18181b;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Header Section */
    .storage-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      padding: 2.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .storage-header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .storage-title-section {
      flex: 1;
    }

    .storage-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .storage-subtitle {
      color: #cbd5e1;
      font-size: 1.1rem;
      margin: 0;
      line-height: 1.5;
    }

    .storage-header-actions {
      display: flex;
      gap: 1rem;
    }

    /* Actions Bar Section */
    .storage-actions-bar {
      background: #1e293b;
      padding: 1.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .storage-actions-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .storage-quick-stats {
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
    .storage-section {
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

    /* KPI Grid */
    .storage-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 0 2rem;
    }

    .storage-kpi-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #475569;
      transition: all 0.3s ease;
    }

    .storage-kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-color: #6366f1;
    }

    .kpi-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
    }

    .total-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .occupied-icon { background: linear-gradient(135deg, #10b981, #059669); }
    .efficiency-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .turnover-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

    .kpi-content {
      flex: 1;
    }

    .storage-kpi-label {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .storage-kpi-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }

    .storage-kpi-trend {
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .storage-kpi-trend.up { color: #10b981; }
    .storage-kpi-trend.down { color: #ef4444; }

    /* Storage Locations Grid */
    .storage-locations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
      padding: 0 2rem;
    }

    .location-card {
      background: transparent;
    }

    .location-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .location-card-info h4 {
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .location-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-pallet { background: #1e40af; color: #dbeafe; }
    .badge-shelf { background: #065f46; color: #d1fae5; }
    .badge-bin { background: #92400e; color: #fef3c7; }
    .badge-floor { background: #5b21b6; color: #e9d5ff; }
    .badge-rack { background: #991b1b; color: #fee2e2; }

    .location-card-actions {
      display: flex;
      gap: 0.25rem;
    }

    .location-card-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .location-stats {
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

    .location-progress {
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

    .location-details {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .detail-value {
      color: #f8fafc;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .status-active { color: #10b981; }
    .status-inactive { color: #ef4444; }
    .status-maintenance { color: #f59e0b; }

    /* Capacity Planning */
    .capacity-planning-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      padding: 0 2rem;
    }

    .capacity-chart-card,
    .capacity-forecast-card {
      background: transparent;
    }

    .forecast-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .forecast-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #1e293b;
      border-radius: 0.5rem;
    }

    .forecast-label {
      color: #cbd5e1;
      font-weight: 500;
    }

    .forecast-value {
      color: #f8fafc;
      font-weight: 600;
    }

    .forecast-recommendation {
      padding: 1rem;
      background: #1e293b;
      border-radius: 0.5rem;
      border-left: 4px solid #3b82f6;
    }

    .forecast-recommendation h5 {
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }

    .forecast-recommendation p {
      color: #cbd5e1;
      margin: 0;
      font-size: 0.9rem;
    }

    /* Optimization Grid */
    .optimization-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      padding: 0 2rem;
    }

    .optimization-card {
      background: transparent;
    }

    .optimization-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .optimization-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: white;
    }

    .icon-reorganize { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .icon-expand { background: linear-gradient(135deg, #10b981, #059669); }
    .icon-optimize { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .icon-maintain { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

    .optimization-info h4 {
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }

    .optimization-priority {
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .priority-high { background: #991b1b; color: #fee2e2; }
    .priority-medium { background: #92400e; color: #fef3c7; }
    .priority-low { background: #065f46; color: #d1fae5; }

    .optimization-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .optimization-content p {
      color: #cbd5e1;
      margin: 0;
      line-height: 1.5;
    }

    .optimization-impact {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #1e293b;
      border-radius: 0.5rem;
    }

    .impact-label {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .impact-value {
      color: #10b981;
      font-weight: 600;
    }

    /* Card Styling */
    ::ng-deep .location-management-card,
    ::ng-deep .chart-card,
    ::ng-deep .optimization-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
      border-radius: 1rem !important;
      color: #f8fafc !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid #475569 !important;
    }

    ::ng-deep .location-management-card .p-card-header,
    ::ng-deep .chart-card .p-card-header,
    ::ng-deep .optimization-card .p-card-header {
      background: transparent !important;
      border-bottom: 1px solid #475569 !important;
      color: #f8fafc !important;
      font-weight: 600;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
    }

    ::ng-deep .location-management-card .p-card-body,
    ::ng-deep .chart-card .p-card-body,
    ::ng-deep .optimization-card .p-card-body {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .capacity-planning-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .storage-header-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .storage-actions-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }

      .storage-quick-stats {
        justify-content: space-around;
      }

      .storage-kpi-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .storage-locations-grid {
        grid-template-columns: 1fr;
      }

      .optimization-grid {
        grid-template-columns: 1fr;
      }

      .storage-title {
        font-size: 2rem;
      }

      .section-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class StorageComponent implements OnInit, OnDestroy {
  loading = false;
  private subscriptions = new Subscription();

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Storage', routerLink: '/storage' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  // Storage Statistics
  storageStats = {
    totalLocations: 156,
    utilization: 78,
    availableSpace: 1250,
    totalSpace: 8500,
    spaceChange: 5,
    occupiedSpace: 7250,
    occupiedChange: 12,
    efficiency: 85,
    efficiencyChange: 3,
    turnoverRate: 4.2,
    turnoverChange: -2
  };

  // Storage Locations
  storageLocations = [
    {
      id: '1',
      name: 'Pallet Location A1',
      type: 'pallet',
      zone: 'Storage Zone A',
      capacity: 100,
      used: 85,
      status: 'active'
    },
    {
      id: '2',
      name: 'Shelf Location B2',
      type: 'shelf',
      zone: 'Storage Zone B',
      capacity: 50,
      used: 30,
      status: 'active'
    },
    {
      id: '3',
      name: 'Bin Location C3',
      type: 'bin',
      zone: 'Storage Zone C',
      capacity: 25,
      used: 25,
      status: 'active'
    },
    {
      id: '4',
      name: 'Floor Location D4',
      type: 'floor',
      zone: 'Storage Zone D',
      capacity: 200,
      used: 150,
      status: 'maintenance'
    },
    {
      id: '5',
      name: 'Rack Location E5',
      type: 'rack',
      zone: 'Storage Zone E',
      capacity: 75,
      used: 60,
      status: 'active'
    }
  ];

  // Capacity Forecast
  capacityForecast = {
    next30Days: 250,
    next90Days: 750,
    next6Months: 1800,
    recommendation: 'Consider expanding Storage Zone A by 200m³ to accommodate projected growth. Current utilization is approaching 90% capacity.'
  };

  // Optimization Recommendations
  optimizationRecommendations = [
    {
      id: '1',
      type: 'reorganize',
      icon: 'pi pi-arrows-alt',
      title: 'Reorganize Storage Zone A',
      priority: 'high',
      description: 'Move frequently accessed items to more accessible locations to reduce picking time by 25%.',
      impact: '25% faster picking'
    },
    {
      id: '2',
      type: 'expand',
      icon: 'pi pi-plus',
      title: 'Expand Storage Capacity',
      priority: 'medium',
      description: 'Add 200m³ of storage space to Storage Zone A to accommodate projected growth.',
      impact: '200m³ additional space'
    },
    {
      id: '3',
      type: 'optimize',
      icon: 'pi pi-chart-line',
      title: 'Optimize Space Utilization',
      priority: 'low',
      description: 'Implement vertical storage solutions to increase capacity by 15% without expanding footprint.',
      impact: '15% capacity increase'
    },
    {
      id: '4',
      type: 'maintain',
      icon: 'pi pi-tools',
      title: 'Schedule Maintenance',
      priority: 'medium',
      description: 'Schedule preventive maintenance for Storage Zone D equipment to prevent downtime.',
      impact: 'Prevent downtime'
    }
  ];

  // Chart Data
  utilizationChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Storage Utilization',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        data: [65, 68, 72, 75, 78, 80, 82, 85, 83, 81, 79, 78],
        fill: true,
        tension: 0.4
      }
    ]
  };

  chartOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#a1a1aa' }, grid: { color: '#23232a' } },
      y: { ticks: { color: '#a1a1aa' }, grid: { color: '#23232a' } }
    }
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStorageData();
    this.subscribeToApiStates();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToApiStates(): void {
    this.subscriptions.add(
      this.apiService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    this.subscriptions.add(
      this.apiService.error$.subscribe(error => {
        if (error) {
          console.error('API Error:', error);
        }
      })
    );
  }

  private loadStorageData(): void {
    // TODO: Load storage data from API
    console.log('Loading storage data...');
  }

  getLocationUtilization(location: any): number {
    return location.capacity > 0 ? Math.round((location.used / location.capacity) * 100) : 0;
  }

  addStorageLocation(): void {
    // TODO: Implement add storage location functionality
    console.log('Add storage location clicked');
  }

  editLocation(location: any): void {
    // TODO: Implement edit location functionality
    console.log('Edit location:', location);
  }

  deleteLocation(location: any): void {
    // TODO: Implement delete location functionality
    console.log('Delete location:', location);
  }

  exportStorageReport(): void {
    // TODO: Implement export functionality
    console.log('Export storage report clicked');
  }

  applyRecommendation(recommendation: any): void {
    // TODO: Implement apply recommendation functionality
    console.log('Apply recommendation:', recommendation);
  }
} 