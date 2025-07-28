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
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, CardModule, ButtonModule, InputTextModule, 
    InputNumberModule, DropdownModule, BreadcrumbModule, ProgressSpinnerModule, 
    ToastModule, ConfirmDialogModule, TableModule, ChartModule, DialogModule, TagModule
  ],
  template: `
    <div class="routes-container">
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
      <div class="routes-header">
        <div class="routes-header-content">
          <div class="routes-title-section">
            <h1 class="routes-title">Route Management</h1>
            <p class="routes-subtitle">Monitor and optimize delivery routes for maximum efficiency and customer satisfaction</p>
          </div>
          <div class="routes-header-actions">
            <p-button label="Create Route" 
                     icon="pi pi-plus" 
                     severity="primary"
                     [disabled]="loading"
                     (onClick)="createRoute()"></p-button>
            <p-button label="Optimize All" 
                     icon="pi pi-refresh" 
                     severity="secondary"
                     [disabled]="loading"
                     (onClick)="optimizeAllRoutes()"></p-button>
          </div>
        </div>
      </div>

      <!-- Actions Bar Section -->
      <div class="routes-actions-bar">
        <div class="routes-actions-content">
          <div class="routes-breadcrumb">
            <p-breadcrumb [model]="breadcrumbItems" [home]="home" />
          </div>
          <div class="routes-quick-stats">
            <div class="stat-item">
              <span class="stat-label">Active Routes</span>
              <span class="stat-value">{{ routesStats.activeRoutes }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">On Time</span>
              <span class="stat-value">{{ routesStats.onTimePercentage }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Distance</span>
              <span class="stat-value">{{ routesStats.totalDistance }}km</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Routes Overview Section -->
      <div class="routes-section">
        <div class="section-header">
          <h2 class="section-title">Routes Overview</h2>
          <p class="section-subtitle">Key performance indicators and route efficiency metrics</p>
        </div>
        <div class="routes-kpi-grid">
          <div class="routes-kpi-card">
            <div class="kpi-icon total-icon">
              <i class="pi pi-directions"></i>
            </div>
            <div class="kpi-content">
              <div class="routes-kpi-label">Total Routes</div>
              <div class="routes-kpi-value">{{ routesStats.totalRoutes }}</div>
              <div class="routes-kpi-trend" [ngClass]="{'up': routesStats.routesChange > 0, 'down': routesStats.routesChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': routesStats.routesChange > 0, 'pi-arrow-down': routesStats.routesChange < 0}"></i>
                {{ routesStats.routesChange > 0 ? '+' : '' }}{{ routesStats.routesChange }}% vs last week
              </div>
            </div>
          </div>
          <div class="routes-kpi-card">
            <div class="kpi-icon active-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <div class="kpi-content">
              <div class="routes-kpi-label">Active Routes</div>
              <div class="routes-kpi-value">{{ routesStats.activeRoutes }}</div>
              <div class="routes-kpi-trend" [ngClass]="{'up': routesStats.activeChange > 0, 'down': routesStats.activeChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': routesStats.activeChange > 0, 'pi-arrow-down': routesStats.activeChange < 0}"></i>
                {{ routesStats.activeChange > 0 ? '+' : '' }}{{ routesStats.activeChange }}% vs last week
              </div>
            </div>
          </div>
          <div class="routes-kpi-card">
            <div class="kpi-icon efficiency-icon">
              <i class="pi pi-chart-line"></i>
            </div>
            <div class="kpi-content">
              <div class="routes-kpi-label">On-Time Delivery</div>
              <div class="routes-kpi-value">{{ routesStats.onTimePercentage }}%</div>
              <div class="routes-kpi-trend" [ngClass]="{'up': routesStats.onTimeChange > 0, 'down': routesStats.onTimeChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': routesStats.onTimeChange > 0, 'pi-arrow-down': routesStats.onTimeChange < 0}"></i>
                {{ routesStats.onTimeChange > 0 ? '+' : '' }}{{ routesStats.onTimeChange }}% vs last week
              </div>
            </div>
          </div>
          <div class="routes-kpi-card">
            <div class="kpi-icon distance-icon">
              <i class="pi pi-map-marker"></i>
            </div>
            <div class="kpi-content">
              <div class="routes-kpi-label">Avg Distance</div>
              <div class="routes-kpi-value">{{ routesStats.avgDistance }}km</div>
              <div class="routes-kpi-trend" [ngClass]="{'up': routesStats.distanceChange > 0, 'down': routesStats.distanceChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': routesStats.distanceChange > 0, 'pi-arrow-down': routesStats.distanceChange < 0}"></i>
                {{ routesStats.distanceChange > 0 ? '+' : '' }}{{ routesStats.distanceChange }}% vs last week
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Routes Section -->
      <div class="routes-section">
        <div class="section-header">
          <h2 class="section-title">Active Routes</h2>
          <p class="section-subtitle">Monitor and manage currently active delivery routes</p>
        </div>
        <div class="routes-table-card">
          <p-table [value]="activeRoutes" 
                   [paginator]="true" 
                   [rows]="10" 
                   [showCurrentPageReport]="true" 
                   responsiveLayout="scroll"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                   [rowsPerPageOptions]="[10,25,50]"
                   [globalFilterFields]="['routeId','driverName','vehicleNumber','status']"
                   styleClass="p-datatable-sm routes-table">
            <ng-template pTemplate="header">
              <tr>
                <th class="routes-th routes-th-left">Route ID</th>
                <th class="routes-th routes-th-left">Driver</th>
                <th class="routes-th routes-th-left">Vehicle</th>
                <th class="routes-th routes-th-center">Status</th>
                <th class="routes-th routes-th-center">Stops</th>
                <th class="routes-th routes-th-left">Current Location</th>
                <th class="routes-th routes-th-center">Progress</th>
                <th class="routes-th routes-th-center">ETA</th>
                <th class="routes-th routes-th-center">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-route>
              <tr class="routes-row">
                <td class="routes-td routes-td-left">
                  <span class="routes-route-id">{{ route.routeId }}</span>
                </td>
                <td class="routes-td routes-td-left">
                  <div>
                    <div class="routes-driver-name">{{ route.driverName }}</div>
                    <div class="routes-driver-phone">{{ route.driverPhone }}</div>
                  </div>
                </td>
                <td class="routes-td routes-td-left">
                  <div class="routes-vehicle-flex">
                    <i class="pi pi-truck routes-vehicle-icon"></i>
                    <span class="routes-vehicle-number">{{ route.vehicleNumber }}</span>
                  </div>
                </td>
                <td class="routes-td routes-td-center">
                  <p-tag [value]="route.status" 
                        [severity]="getStatusSeverity(route.status)"
                        styleClass="routes-status-tag">
                  </p-tag>
                </td>
                <td class="routes-td routes-td-center">
                  <span class="routes-stops">{{ route.completedStops }}/{{ route.totalStops }}</span>
                </td>
                <td class="routes-td routes-td-left">
                  <div class="routes-location-flex">
                    <i class="pi pi-map-marker routes-location-icon"></i>
                    <span class="routes-location">{{ route.currentLocation }}</span>
                  </div>
                </td>
                <td class="routes-td routes-td-center">
                  <div class="routes-progress-bar">
                    <div class="routes-progress-fill" [style.width]="getRouteProgress(route) + '%'"></div>
                  </div>
                  <span class="routes-progress-text">{{ getRouteProgress(route) }}%</span>
                </td>
                <td class="routes-td routes-td-center">
                  <span class="routes-eta">{{ route.eta | date:'shortTime' }}</span>
                </td>
                <td class="routes-td routes-td-center">
                  <div class="routes-actions-flex">
                    <p-button icon="pi pi-eye" 
                             styleClass="p-button-sm p-button-text p-button-primary"
                             (onClick)="viewRoute(route)"
                             pTooltip="View Details"></p-button>
                    <p-button icon="pi pi-pencil" 
                             styleClass="p-button-sm p-button-text p-button-warning"
                             (onClick)="editRoute(route)"
                             pTooltip="Edit Route"></p-button>
                    <p-button icon="pi pi-map" 
                             styleClass="p-button-sm p-button-text p-button-info"
                             (onClick)="trackRoute(route)"
                             pTooltip="Track Route"></p-button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="9" class="routes-empty-message">
                  <div class="routes-empty-flex">
                    <i class="pi pi-directions routes-empty-icon"></i>
                    <div>
                      <h3 class="routes-empty-title">No Active Routes</h3>
                      <p class="routes-empty-desc">Start by creating your first delivery route</p>
                    </div>
                    <p-button label="Create First Route" 
                             icon="pi pi-plus" 
                             severity="primary"
                             (onClick)="createRoute()"></p-button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>

      <!-- Route Performance Section -->
      <div class="routes-section">
        <div class="section-header">
          <h2 class="section-title">Route Performance</h2>
          <p class="section-subtitle">Analytics and insights into route efficiency and delivery performance</p>
        </div>
        <div class="performance-grid">
          <div class="performance-chart-card">
            <p-card header="Delivery Performance Trend" styleClass="chart-card">
              <p-chart type="line" [data]="performanceChartData" [options]="chartOptions" style="height: 300px;"></p-chart>
            </p-card>
          </div>
          <div class="performance-metrics-card">
            <p-card header="Key Metrics" styleClass="chart-card">
              <div class="metrics-content">
                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Average Delivery Time</span>
                    <span class="metric-value">{{ performanceMetrics.avgDeliveryTime }}min</span>
                  </div>
                  <div class="metric-trend" [ngClass]="{'up': performanceMetrics.deliveryTimeChange > 0, 'down': performanceMetrics.deliveryTimeChange < 0}">
                    <i class="pi" [ngClass]="{'pi-arrow-up': performanceMetrics.deliveryTimeChange > 0, 'pi-arrow-down': performanceMetrics.deliveryTimeChange < 0}"></i>
                    {{ performanceMetrics.deliveryTimeChange > 0 ? '+' : '' }}{{ performanceMetrics.deliveryTimeChange }}% vs last week
                  </div>
                </div>
                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Fuel Efficiency</span>
                    <span class="metric-value">{{ performanceMetrics.fuelEfficiency }}km/L</span>
                  </div>
                  <div class="metric-trend" [ngClass]="{'up': performanceMetrics.fuelChange > 0, 'down': performanceMetrics.fuelChange < 0}">
                    <i class="pi" [ngClass]="{'pi-arrow-up': performanceMetrics.fuelChange > 0, 'pi-arrow-down': performanceMetrics.fuelChange < 0}"></i>
                    {{ performanceMetrics.fuelChange > 0 ? '+' : '' }}{{ performanceMetrics.fuelChange }}% vs last week
                  </div>
                </div>
                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Customer Satisfaction</span>
                    <span class="metric-value">{{ performanceMetrics.customerSatisfaction }}/5</span>
                  </div>
                  <div class="metric-trend" [ngClass]="{'up': performanceMetrics.satisfactionChange > 0, 'down': performanceMetrics.satisfactionChange < 0}">
                    <i class="pi" [ngClass]="{'pi-arrow-up': performanceMetrics.satisfactionChange > 0, 'pi-arrow-down': performanceMetrics.satisfactionChange < 0}"></i>
                    {{ performanceMetrics.satisfactionChange > 0 ? '+' : '' }}{{ performanceMetrics.satisfactionChange }}% vs last week
                  </div>
                </div>
              </div>
            </p-card>
          </div>
        </div>
      </div>

      <!-- Route Optimization Section -->
      <div class="routes-section">
        <div class="section-header">
          <h2 class="section-title">Route Optimization</h2>
          <p class="section-subtitle">AI-powered recommendations for route optimization and efficiency improvements</p>
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
                  <span class="impact-label">Potential Savings:</span>
                  <span class="impact-value">{{ recommendation.savings }}</span>
                </div>
                <p-button label="Apply Optimization" 
                         icon="pi pi-check" 
                         size="small"
                         (onClick)="applyOptimization(recommendation)"></p-button>
              </div>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .routes-container {
      width: 100vw;
      min-height: 100vh;
      background: #18181b;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Header Section */
    .routes-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      padding: 2.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .routes-header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .routes-title-section {
      flex: 1;
    }

    .routes-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .routes-subtitle {
      color: #cbd5e1;
      font-size: 1.1rem;
      margin: 0;
      line-height: 1.5;
    }

    .routes-header-actions {
      display: flex;
      gap: 1rem;
    }

    /* Actions Bar Section */
    .routes-actions-bar {
      background: #1e293b;
      padding: 1.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .routes-actions-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .routes-quick-stats {
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
    .routes-section {
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
    .routes-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 0 2rem;
    }

    .routes-kpi-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #475569;
      transition: all 0.3s ease;
    }

    .routes-kpi-card:hover {
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
    .active-icon { background: linear-gradient(135deg, #10b981, #059669); }
    .efficiency-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .distance-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

    .kpi-content {
      flex: 1;
    }

    .routes-kpi-label {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .routes-kpi-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }

    .routes-kpi-trend {
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .routes-kpi-trend.up { color: #10b981; }
    .routes-kpi-trend.down { color: #ef4444; }

    /* Routes Table */
    .routes-table-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-radius: 1.25rem;
      box-shadow: 0 2px 12px 0 rgba(30,41,59,0.10);
      overflow: hidden;
      padding-bottom: 1rem;
      margin: 0 2rem;
    }

    .routes-table {
      width: 100%;
      background: transparent;
      border-radius: 0 0 1.25rem 1.25rem;
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
    }

    .routes-th, .routes-td {
      padding: 1rem 1.25rem;
      font-size: 1.05rem;
      color: #e4e4e7 !important;
      background: transparent !important;
    }

    .routes-th {
      background: #1e293b !important;
      font-weight: 700;
      color: #fff !important;
      border-bottom: 1px solid #475569;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .routes-th-left { text-align: left; }
    .routes-th-center { text-align: center; }
    .routes-th-right { text-align: right; }
    .routes-td-left { text-align: left; }
    .routes-td-center { text-align: center; }
    .routes-td-right { text-align: right; }

    .routes-row:hover {
      background: #1e293b !important;
    }

    .routes-route-id {
      font-weight: 600;
      color: #60a5fa !important;
    }

    .routes-driver-name {
      font-weight: 500;
      color: #fff;
    }

    .routes-driver-phone {
      color: #a1a1aa;
      font-size: 0.95rem;
    }

    .routes-vehicle-flex {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .routes-vehicle-icon {
      font-size: 1.1rem;
      color: #60a5fa;
    }

    .routes-vehicle-number {
      color: #a1a1aa;
      font-weight: 500;
    }

    .routes-status-tag {
      font-size: 0.95rem;
      border-radius: 0.5rem;
      padding: 0.25rem 0.75rem;
    }

    .routes-stops {
      color: #fbbf24;
      font-weight: 600;
    }

    .routes-location-flex {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .routes-location-icon {
      font-size: 1.1rem;
      color: #60a5fa;
    }

    .routes-location {
      color: #a1a1aa;
    }

    .routes-progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #475569;
      border-radius: 0.25rem;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .routes-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      transition: width 0.3s ease;
    }

    .routes-progress-text {
      color: #a1a1aa;
      font-size: 0.85rem;
    }

    .routes-eta {
      color: #fbbf24;
      font-weight: 600;
    }

    .routes-actions-flex {
      display: flex;
      gap: 0.25rem;
      justify-content: center;
    }

    .routes-empty-message {
      padding: 3rem 0;
      text-align: center;
      background: #1e293b !important;
    }

    .routes-empty-flex {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .routes-empty-icon {
      font-size: 3rem;
      color: #a1a1aa;
    }

    .routes-empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #fff !important;
    }

    .routes-empty-desc {
      color: #a1a1aa !important;
      font-size: 1rem;
    }

    /* Performance Grid */
    .performance-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      padding: 0 2rem;
    }

    .performance-chart-card,
    .performance-metrics-card {
      background: transparent;
    }

    .metrics-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .metric-item {
      padding: 1rem;
      background: #1e293b;
      border-radius: 0.5rem;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .metric-label {
      color: #cbd5e1;
      font-weight: 500;
    }

    .metric-value {
      color: #f8fafc;
      font-weight: 600;
    }

    .metric-trend {
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .metric-trend.up { color: #10b981; }
    .metric-trend.down { color: #ef4444; }

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
    .icon-optimize { background: linear-gradient(135deg, #10b981, #059669); }
    .icon-schedule { background: linear-gradient(135deg, #f59e0b, #d97706); }
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
    ::ng-deep .chart-card,
    ::ng-deep .optimization-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
      border-radius: 1rem !important;
      color: #f8fafc !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid #475569 !important;
    }

    ::ng-deep .chart-card .p-card-header,
    ::ng-deep .optimization-card .p-card-header {
      background: transparent !important;
      border-bottom: 1px solid #475569 !important;
      color: #f8fafc !important;
      font-weight: 600;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
    }

    ::ng-deep .chart-card .p-card-body,
    ::ng-deep .optimization-card .p-card-body {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .performance-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .routes-header-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .routes-actions-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }

      .routes-quick-stats {
        justify-content: space-around;
      }

      .routes-kpi-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .optimization-grid {
        grid-template-columns: 1fr;
      }

      .routes-title {
        font-size: 2rem;
      }

      .section-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class RoutesComponent implements OnInit, OnDestroy {
  loading = false;
  private subscriptions = new Subscription();

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Routes', routerLink: '/routes' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  // Routes Statistics
  routesStats = {
    totalRoutes: 24,
    routesChange: 8,
    activeRoutes: 12,
    activeChange: 15,
    onTimePercentage: 94,
    onTimeChange: 3,
    avgDistance: 45,
    distanceChange: -5,
    totalDistance: 540
  };

  // Active Routes
  activeRoutes = [
    {
      routeId: 'RT-001',
      driverName: 'John Smith',
      driverPhone: '+1 (555) 123-4567',
      vehicleNumber: 'TRK-001',
      status: 'In Progress',
      completedStops: 3,
      totalStops: 8,
      currentLocation: 'Downtown District',
      eta: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    },
    {
      routeId: 'RT-002',
      driverName: 'Sarah Johnson',
      driverPhone: '+1 (555) 234-5678',
      vehicleNumber: 'VAN-001',
      status: 'Starting',
      completedStops: 0,
      totalStops: 6,
      currentLocation: 'Warehouse',
      eta: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
    },
    {
      routeId: 'RT-003',
      driverName: 'Mike Wilson',
      driverPhone: '+1 (555) 345-6789',
      vehicleNumber: 'TRK-002',
      status: 'Completed',
      completedStops: 5,
      totalStops: 5,
      currentLocation: 'Warehouse',
      eta: new Date(Date.now())
    },
    {
      routeId: 'RT-004',
      driverName: 'Lisa Brown',
      driverPhone: '+1 (555) 456-7890',
      vehicleNumber: 'VAN-002',
      status: 'In Progress',
      completedStops: 2,
      totalStops: 7,
      currentLocation: 'Suburban Area',
      eta: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
    }
  ];

  // Performance Metrics
  performanceMetrics = {
    avgDeliveryTime: 28,
    deliveryTimeChange: -12,
    fuelEfficiency: 8.5,
    fuelChange: 5,
    customerSatisfaction: 4.7,
    satisfactionChange: 8
  };

  // Optimization Recommendations
  optimizationRecommendations = [
    {
      id: '1',
      type: 'reorganize',
      icon: 'pi pi-arrows-alt',
      title: 'Reorganize Route RT-001',
      priority: 'high',
      description: 'Optimize stop sequence to reduce travel time by 15% and improve delivery efficiency.',
      savings: '15% time reduction'
    },
    {
      id: '2',
      type: 'optimize',
      icon: 'pi pi-chart-line',
      title: 'Optimize Vehicle Assignment',
      priority: 'medium',
      description: 'Reassign vehicles based on capacity and route requirements to improve fuel efficiency.',
      savings: '12% fuel savings'
    },
    {
      id: '3',
      type: 'schedule',
      icon: 'pi pi-calendar',
      title: 'Adjust Delivery Windows',
      priority: 'low',
      description: 'Modify delivery time windows to reduce traffic delays and improve on-time delivery.',
      savings: '8% delay reduction'
    },
    {
      id: '4',
      type: 'maintain',
      icon: 'pi pi-tools',
      title: 'Schedule Vehicle Maintenance',
      priority: 'medium',
      description: 'Schedule preventive maintenance to avoid breakdowns and ensure reliable delivery.',
      savings: 'Prevent downtime'
    }
  ];

  // Chart Data
  performanceChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'On-Time Delivery Rate',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        data: [92, 94, 96, 93, 95, 97, 94],
        fill: true,
        tension: 0.4
      },
      {
        label: 'Average Delivery Time (min)',
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.2)',
        data: [32, 30, 28, 31, 29, 27, 28],
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
    this.loadRoutesData();
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

  private loadRoutesData(): void {
    // TODO: Load routes data from API
    console.log('Loading routes data...');
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'In Progress': return 'info';
      case 'Starting': return 'warn';
      case 'Completed': return 'success';
      case 'Delayed': return 'danger';
      default: return 'info';
    }
  }

  getRouteProgress(route: any): number {
    return route.totalStops > 0 ? Math.round((route.completedStops / route.totalStops) * 100) : 0;
  }

  createRoute(): void {
    // TODO: Implement create route functionality
    console.log('Create route clicked');
  }

  optimizeAllRoutes(): void {
    // TODO: Implement optimize all routes functionality
    console.log('Optimize all routes clicked');
  }

  viewRoute(route: any): void {
    // TODO: Implement view route functionality
    console.log('View route:', route);
  }

  editRoute(route: any): void {
    // TODO: Implement edit route functionality
    console.log('Edit route:', route);
  }

  trackRoute(route: any): void {
    // TODO: Implement track route functionality
    console.log('Track route:', route);
  }

  applyOptimization(recommendation: any): void {
    // TODO: Implement apply optimization functionality
    console.log('Apply optimization:', recommendation);
  }
} 