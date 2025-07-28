import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// PrimeNG Components
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Services
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-scheduling',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    TagModule,
    ProgressBarModule,
    SliderModule,
    MultiSelectModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="scheduling-container">
      <!-- Header -->
      <div class="scheduling-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Delivery Scheduling</h1>
            <p>Schedule and manage order deliveries from warehouse to customers</p>
          </div>
          <div class="header-actions">
            <p-button label="Schedule Delivery" 
                     icon="pi pi-plus" 
                     severity="primary"
                     (onClick)="scheduleNewDelivery()">
            </p-button>
            <p-button label="Bulk Schedule" 
                     icon="pi pi-calendar-plus" 
                     severity="secondary"
                     (onClick)="bulkScheduleDeliveries()">
            </p-button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ deliveryStats.pendingOrders }}</div>
            <div class="stat-label">Pending Orders</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-truck"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ deliveryStats.scheduledDeliveries }}</div>
            <div class="stat-label">Scheduled Deliveries</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ deliveryStats.avgDeliveryTime }}h</div>
            <div class="stat-label">Avg. Delivery Time</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ deliveryStats.completedDeliveries }}</div>
            <div class="stat-label">Completed Today</div>
          </div>
        </div>
      </div>

      <!-- Main Scheduling Interface -->
      <p-tabView>
        <!-- Order Queue Tab -->
        <p-tabPanel header="Order Queue">
          <div class="order-queue">
            <div class="queue-controls">
              <div class="controls-left">
                <p-dropdown [options]="orderFilters" 
                           [(ngModel)]="selectedOrderFilter"
                           placeholder="Filter Orders"
                           styleClass="filter-dropdown">
                </p-dropdown>
                <p-button label="Auto-Schedule" 
                         icon="pi pi-magic" 
                         severity="secondary"
                         (onClick)="autoScheduleOrders()">
                </p-button>
              </div>
              <div class="controls-right">
                <p-button label="Export Queue" 
                         icon="pi pi-download" 
                         severity="secondary"
                         (onClick)="exportOrderQueue()">
                </p-button>
              </div>
            </div>

            <p-table [value]="pendingOrders" 
                    [paginator]="true" 
                    [rows]="10"
                    [globalFilterFields]="['orderNumber', 'customerName', 'priority']"
                    styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Priority</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-order>
                <tr>
                  <td>{{ order.orderNumber }}</td>
                  <td>
                    <div class="customer-info">
                      <div class="customer-name">{{ order.customerName }}</div>
                      <div class="customer-location">{{ order.deliveryAddress }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="items-info">
                      <span class="item-count">{{ order.itemCount }} items</span>
                      <span class="total-weight">{{ order.totalWeight }}kg</span>
                    </div>
                  </td>
                  <td>
                    <p-tag [value]="order.priority" 
                           [severity]="getPrioritySeverity(order.priority)">
                    </p-tag>
                  </td>
                  <td>{{ order.receivedDate | date:'short' }}</td>
                  <td>
                    <p-tag [value]="order.status" 
                           [severity]="getOrderStatusSeverity(order.status)">
                    </p-tag>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <p-button icon="pi pi-calendar" 
                               severity="secondary" 
                               size="small"
                               (onClick)="scheduleOrder(order)"
                               [disabled]="order.status === 'Scheduled'">
                      </p-button>
                      <p-button icon="pi pi-eye" 
                               severity="secondary" 
                               size="small"
                               (onClick)="viewOrder(order)">
                      </p-button>
                      <p-button icon="pi pi-pencil" 
                               severity="secondary" 
                               size="small"
                               (onClick)="editOrder(order)">
                      </p-button>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </p-tabPanel>

        <!-- Delivery Schedule Tab -->
        <p-tabPanel header="Delivery Schedule">
          <div class="delivery-schedule">
            <div class="schedule-controls">
              <div class="controls-left">
                <p-calendar [(ngModel)]="selectedDate" 
                           dateFormat="yy-mm-dd" 
                           showIcon="true"
                           placeholder="Select Date">
                </p-calendar>
                <p-dropdown [options]="deliveryFilters" 
                           [(ngModel)]="selectedDeliveryFilter"
                           placeholder="Filter Deliveries">
                </p-dropdown>
              </div>
              <div class="controls-right">
                <p-button label="Optimize Routes" 
                         icon="pi pi-cog" 
                         severity="primary"
                         (onClick)="optimizeDeliveryRoutes()">
                </p-button>
              </div>
            </div>

            <div class="schedule-grid">
              <div class="time-slot" *ngFor="let slot of deliveryTimeSlots">
                <div class="slot-header">
                  <h4>{{ slot.time }}</h4>
                  <span class="delivery-count">{{ slot.deliveries.length }} deliveries</span>
                </div>
                <div class="deliveries-list">
                  <div class="delivery-item" *ngFor="let delivery of slot.deliveries">
                    <div class="delivery-info">
                      <div class="delivery-order">{{ delivery.orderNumber }}</div>
                      <div class="delivery-customer">{{ delivery.customerName }}</div>
                      <div class="delivery-route">
                        <i class="pi pi-map-marker"></i>
                        Route {{ delivery.routeNumber }}
                      </div>
                    </div>
                    <div class="delivery-status">
                      <p-tag [value]="delivery.status" 
                             [severity]="getDeliveryStatusSeverity(delivery.status)">
                      </p-tag>
                      <div class="delivery-actions">
                        <p-button icon="pi pi-truck" 
                                 severity="secondary" 
                                 size="small"
                                 (onClick)="assignVehicle(delivery)">
                        </p-button>
                        <p-button icon="pi pi-user" 
                                 severity="secondary" 
                                 size="small"
                                 (onClick)="assignDriver(delivery)">
                        </p-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Route Management Tab -->
        <p-tabPanel header="Route Management">
          <div class="route-management">
            <div class="routes-grid">
              <!-- Active Routes -->
              <div class="route-section">
                <div class="section-header">
                  <h3>Active Routes</h3>
                  <p-button label="Create Route" 
                           icon="pi pi-plus" 
                           severity="primary"
                           size="small"
                           (onClick)="createNewRoute()">
                  </p-button>
                </div>
                <div class="routes-list">
                  <div class="route-item" *ngFor="let route of activeRoutes">
                    <div class="route-info">
                      <div class="route-header">
                        <h4>Route {{ route.routeNumber }}</h4>
                        <p-tag [value]="route.status" 
                               [severity]="getRouteStatusSeverity(route.status)">
                        </p-tag>
                      </div>
                      <div class="route-details">
                        <span class="detail-item">
                          <i class="pi pi-map-marker"></i>
                          {{ route.stops }} stops
                        </span>
                        <span class="detail-item">
                          <i class="pi pi-clock"></i>
                          {{ route.estimatedTime }}h
                        </span>
                        <span class="detail-item">
                          <i class="pi pi-truck"></i>
                          {{ route.assignedVehicle || 'Unassigned' }}
                        </span>
                      </div>
                      <div class="route-progress">
                        <span class="progress-label">Progress</span>
                        <p-progressBar [value]="route.progress" 
                                      [showValue]="true">
                        </p-progressBar>
                      </div>
                    </div>
                    <div class="route-actions">
                      <p-button icon="pi pi-eye" 
                               severity="secondary" 
                               size="small"
                               (onClick)="viewRoute(route)">
                      </p-button>
                      <p-button icon="pi pi-pencil" 
                               severity="secondary" 
                               size="small"
                               (onClick)="editRoute(route)">
                      </p-button>
                      <p-button icon="pi pi-cog" 
                               severity="secondary" 
                               size="small"
                               (onClick)="optimizeRoute(route)">
                      </p-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Route Optimization -->
              <div class="route-section">
                <div class="section-header">
                  <h3>Route Optimization</h3>
                </div>
                <div class="optimization-tools">
                  <div class="optimization-setting">
                    <label>Optimization Criteria</label>
                    <p-dropdown [options]="optimizationCriteria" 
                               [(ngModel)]="selectedOptimizationCriteria"
                               placeholder="Select Criteria">
                    </p-dropdown>
                  </div>
                  <div class="optimization-setting">
                    <label>Max Stops per Route</label>
                    <p-inputNumber [(ngModel)]="optimizationSettings.maxStopsPerRoute" 
                                  [min]="5" 
                                  [max]="20"
                                  [step]="1">
                    </p-inputNumber>
                  </div>
                  <div class="optimization-setting">
                    <label>Max Route Duration (hours)</label>
                    <p-inputNumber [(ngModel)]="optimizationSettings.maxRouteDuration" 
                                  [min]="4" 
                                  [max]="12"
                                  [step]="0.5">
                    </p-inputNumber>
                  </div>
                  <div class="optimization-setting">
                    <label>Vehicle Capacity (kg)</label>
                    <p-inputNumber [(ngModel)]="optimizationSettings.vehicleCapacity" 
                                  [min]="500" 
                                  [max]="5000"
                                  [step]="100">
                    </p-inputNumber>
                  </div>
                  <div class="optimization-actions">
                    <p-button label="Run Optimization" 
                             icon="pi pi-cog" 
                             severity="primary"
                             [loading]="optimizationLoading"
                             (onClick)="runRouteOptimization()">
                    </p-button>
                    <p-button label="Reset Settings" 
                             icon="pi pi-refresh" 
                             severity="secondary"
                             (onClick)="resetOptimizationSettings()">
                    </p-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Vehicle & Driver Assignment Tab -->
        <p-tabPanel header="Vehicle & Driver Assignment">
          <div class="assignment-management">
            <div class="assignment-grid">
              <!-- Available Vehicles -->
              <div class="assignment-section">
                <div class="section-header">
                  <h3>Available Vehicles</h3>
                  <p-button label="Add Vehicle" 
                           icon="pi pi-plus" 
                           severity="primary"
                           size="small"
                           (onClick)="addVehicle()">
                  </p-button>
                </div>
                <p-table [value]="availableVehicles" 
                        [paginator]="true" 
                        [rows]="5"
                        styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Type</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Current Route</th>
                      <th>Actions</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-vehicle>
                    <tr>
                      <td>{{ vehicle.id }}</td>
                      <td>{{ vehicle.type }}</td>
                      <td>{{ vehicle.capacity }}kg</td>
                      <td>
                        <p-tag [value]="vehicle.status" 
                               [severity]="getVehicleStatusSeverity(vehicle.status)">
                        </p-tag>
                      </td>
                      <td>{{ vehicle.currentRoute || 'None' }}</td>
                      <td>
                        <div class="action-buttons">
                          <p-button icon="pi pi-calendar" 
                                   severity="secondary" 
                                   size="small"
                                   (onClick)="assignVehicleToRoute(vehicle)">
                          </p-button>
                          <p-button icon="pi pi-wrench" 
                                   severity="secondary" 
                                   size="small"
                                   (onClick)="scheduleMaintenance(vehicle)">
                          </p-button>
                        </div>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>

              <!-- Available Drivers -->
              <div class="assignment-section">
                <div class="section-header">
                  <h3>Available Drivers</h3>
                  <p-button label="Add Driver" 
                           icon="pi pi-plus" 
                           severity="primary"
                           size="small"
                           (onClick)="addDriver()">
                  </p-button>
                </div>
                <p-table [value]="availableDrivers" 
                        [paginator]="true" 
                        [rows]="5"
                        styleClass="p-datatable-sm">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Driver Name</th>
                      <th>License Type</th>
                      <th>Hours This Week</th>
                      <th>Status</th>
                      <th>Current Route</th>
                      <th>Actions</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-driver>
                    <tr>
                      <td>{{ driver.name }}</td>
                      <td>{{ driver.licenseType }}</td>
                      <td>
                        <div class="hours-display">
                          <span>{{ driver.hoursThisWeek }}/{{ driver.maxHours }}</span>
                          <p-progressBar [value]="(driver.hoursThisWeek / driver.maxHours) * 100" 
                                        [showValue]="false"
                                        styleClass="hours-progress">
                          </p-progressBar>
                        </div>
                      </td>
                      <td>
                        <p-tag [value]="driver.status" 
                               [severity]="getDriverStatusSeverity(driver.status)">
                        </p-tag>
                      </td>
                      <td>{{ driver.currentRoute || 'None' }}</td>
                      <td>
                        <div class="action-buttons">
                          <p-button icon="pi pi-calendar" 
                                   severity="secondary" 
                                   size="small"
                                   (onClick)="assignDriverToRoute(driver)">
                          </p-button>
                          <p-button icon="pi pi-user" 
                                   severity="secondary" 
                                   size="small"
                                   (onClick)="viewDriverSchedule(driver)">
                          </p-button>
                        </div>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Delivery Analytics Tab -->
        <p-tabPanel header="Delivery Analytics">
          <div class="delivery-analytics">
            <div class="analytics-grid">
              <!-- Performance Metrics -->
              <div class="analytics-section">
                <h3>Performance Metrics</h3>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-header">
                      <span class="metric-label">On-Time Delivery Rate</span>
                      <span class="metric-value">{{ analytics.onTimeDeliveryRate }}%</span>
                    </div>
                    <p-progressBar [value]="analytics.onTimeDeliveryRate" 
                                  [showValue]="false">
                    </p-progressBar>
                  </div>
                  <div class="metric-card">
                    <div class="metric-header">
                      <span class="metric-label">Average Delivery Time</span>
                      <span class="metric-value">{{ analytics.avgDeliveryTime }}h</span>
                    </div>
                    <p-progressBar [value]="analytics.avgDeliveryTimePercentage" 
                                  [showValue]="false">
                    </p-progressBar>
                  </div>
                  <div class="metric-card">
                    <div class="metric-header">
                      <span class="metric-label">Route Efficiency</span>
                      <span class="metric-value">{{ analytics.routeEfficiency }}%</span>
                    </div>
                    <p-progressBar [value]="analytics.routeEfficiency" 
                                  [showValue]="false">
                    </p-progressBar>
                  </div>
                  <div class="metric-card">
                    <div class="metric-header">
                      <span class="metric-label">Customer Satisfaction</span>
                      <span class="metric-value">{{ analytics.customerSatisfaction }}%</span>
                    </div>
                    <p-progressBar [value]="analytics.customerSatisfaction" 
                                  [showValue]="false">
                    </p-progressBar>
                  </div>
                </div>
              </div>

              <!-- Delivery Trends -->
              <div class="analytics-section">
                <h3>Delivery Trends</h3>
                <div class="trends-content">
                  <div class="trend-item">
                    <div class="trend-header">
                      <span class="trend-label">Peak Delivery Hours</span>
                      <span class="trend-value">{{ trends.peakHours }}</span>
                    </div>
                    <div class="trend-description">
                      Highest volume of deliveries
                    </div>
                  </div>
                  <div class="trend-item">
                    <div class="trend-header">
                      <span class="trend-label">Most Popular Routes</span>
                      <span class="trend-value">{{ trends.popularRoutes.join(', ') }}</span>
                    </div>
                    <div class="trend-description">
                      Routes with highest order volume
                    </div>
                  </div>
                  <div class="trend-item">
                    <div class="trend-header">
                      <span class="trend-label">Average Orders per Route</span>
                      <span class="trend-value">{{ trends.avgOrdersPerRoute }}</span>
                    </div>
                    <div class="trend-description">
                      Typical route optimization
                    </div>
                  </div>
                </div>
                <div class="analytics-actions">
                  <p-button label="Generate Report" 
                           icon="pi pi-file-pdf" 
                           severity="secondary"
                           (onClick)="generateDeliveryReport()">
                  </p-button>
                  <p-button label="Export Data" 
                           icon="pi pi-download" 
                           severity="secondary"
                           (onClick)="exportAnalyticsData()">
                  </p-button>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Capacity Management Tab -->
        <p-tabPanel header="Capacity Management">
          <div class="capacity-management">
            <div class="capacity-grid">
              <!-- Vehicle Capacity Overview -->
              <div class="capacity-section">
                <div class="section-header">
                  <h3>Vehicle Capacity Overview</h3>
                  <p-button label="Update Capacity" 
                           icon="pi pi-refresh" 
                           severity="primary"
                           size="small"
                           (onClick)="updateCapacitySettings()">
                  </p-button>
                </div>
                <div class="capacity-metrics">
                  <div class="capacity-card" *ngFor="let vehicle of vehicleAllocation">
                    <div class="capacity-header">
                      <span class="capacity-label">{{ vehicle.name }}</span>
                      <span class="capacity-value">{{ vehicle.utilization.volume }}% utilized</span>
                    </div>
                    <div class="vehicle-details">
                      <div class="detail-row">
                        <span class="detail-label">Volume:</span>
                        <span class="detail-value">{{ vehicle.currentLoad.volume }}/{{ vehicle.capacity.volume }} cu ft</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Weight:</span>
                        <span class="detail-value">{{ vehicle.currentLoad.weight }}/{{ vehicle.capacity.weight }} lbs</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Pallets:</span>
                        <span class="detail-value">{{ vehicle.currentLoad.pallets }}/{{ vehicle.capacity.pallets }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Service Time:</span>
                        <span class="detail-value">{{ vehicle.estimatedServiceTime }} min</span>
                      </div>
                    </div>
                    <div class="capacity-usage">
                      <div class="usage-bar">
                        <div class="usage-fill" [style.width.%]="vehicle.utilization.volume"></div>
                      </div>
                      <span class="usage-text">Volume Utilization</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Service Time Planning -->
              <div class="capacity-section">
                <div class="section-header">
                  <h3>Service Time Planning</h3>
                  <p-button label="Optimize Times" 
                           icon="pi pi-cog" 
                           severity="secondary"
                           size="small"
                           (onClick)="optimizeCapacity()">
                  </p-button>
                </div>
                <div class="service-time-tools">
                  <div class="service-time-standards">
                    <h4>Service Time Standards (per stop)</h4>
                    <div class="standards-grid">
                      <div class="standard-item" *ngFor="let standard of capacityMetrics.serviceTimeStandards | keyvalue">
                        <div class="standard-header">
                          <span class="standard-name">{{ standard.value.name }}</span>
                          <span class="standard-time">{{ standard.value.baseTime }} min base</span>
                        </div>
                        <div class="standard-details">
                          <span>+{{ standard.value.perItem }} min/item</span>
                          <span>+{{ standard.value.perPallet }} min/pallet</span>
                          <span>Setup: {{ standard.value.setupTime }} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="product-size-categories">
                    <h4>Product Size Categories</h4>
                    <div class="size-grid">
                      <div class="size-item" *ngFor="let size of productSizeCategories">
                        <div class="size-header">
                          <span class="size-name">{{ size.name }}</span>
                          <span class="size-service-time">{{ size.serviceTime }} min</span>
                        </div>
                        <div class="size-details">
                          <span>{{ size.dimensions.length }}'×{{ size.dimensions.width }}'×{{ size.dimensions.height }}'</span>
                          <span>{{ size.volume }} cu ft</span>
                          <span>{{ size.weight }} lbs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Route Capacity Planning -->
            <div class="route-capacity-planning">
              <div class="planning-header">
                <h3>Route Capacity Planning</h3>
                <p-button label="Calculate Routes" 
                         icon="pi pi-calculator" 
                         severity="primary"
                         (onClick)="calculateRouteCapacity()">
                </p-button>
              </div>
              <div class="planning-grid">
                <div class="planning-section">
                  <h4>Route Capacity Settings</h4>
                  <div class="settings-grid">
                    <div class="setting-item">
                      <label>Max Stops per Route</label>
                      <p-inputNumber [(ngModel)]="routePlanning.planningSettings.maxStopsPerRoute" 
                                    [min]="1" 
                                    [max]="20">
                      </p-inputNumber>
                    </div>
                    <div class="setting-item">
                      <label>Max Route Duration (hours)</label>
                      <p-inputNumber [(ngModel)]="routePlanning.planningSettings.maxRouteDuration" 
                                    [min]="240" 
                                    [max]="600"
                                    [step]="30">
                      </p-inputNumber>
                    </div>
                    <div class="setting-item">
                      <label>Max Driving Time (hours)</label>
                      <p-inputNumber [(ngModel)]="routePlanning.planningSettings.maxDrivingTime" 
                                    [min]="180" 
                                    [max]="480"
                                    [step]="30">
                      </p-inputNumber>
                    </div>
                    <div class="setting-item">
                      <label>Service Time Buffer (%)</label>
                      <p-slider [(ngModel)]="routePlanning.planningSettings.serviceTimeBuffer" 
                               [min]="0.1" 
                               [max]="0.5"
                               [step]="0.05">
                      </p-slider>
                      <span class="setting-value">{{ (routePlanning.planningSettings.serviceTimeBuffer * 100) }}%</span>
                    </div>
                  </div>
                </div>

                <div class="planning-section">
                  <h4>Current Route Analysis</h4>
                  <div class="route-analysis">
                    <div class="route-item" *ngFor="let route of routePlanning.routes">
                      <div class="route-header">
                        <span class="route-id">{{ route.routeId }}</span>
                        <span class="route-vehicle">{{ route.vehicleType }}</span>
                      </div>
                      <div class="route-metrics">
                                               <div class="metric">
                         <span class="metric-label">Stops:</span>
                         <span class="metric-value">{{ route.totalStops }}</span>
                       </div>
                        <div class="metric">
                          <span class="metric-label">Distance:</span>
                          <span class="metric-value">{{ route.totalDistance }} mi</span>
                        </div>
                        <div class="metric">
                          <span class="metric-label">Driving:</span>
                          <span class="metric-value">{{ route.drivingTime }} min</span>
                        </div>
                        <div class="metric">
                          <span class="metric-label">Service:</span>
                          <span class="metric-value">{{ route.serviceTime }} min</span>
                        </div>
                        <div class="metric">
                          <span class="metric-label">Total:</span>
                          <span class="metric-value">{{ route.totalTime }} min</span>
                        </div>
                      </div>
                      <div class="route-capacity">
                        <div class="capacity-metric">
                          <span class="capacity-label">Volume:</span>
                          <span class="capacity-value">{{ route.capacity.volume }} cu ft</span>
                        </div>
                        <div class="capacity-metric">
                          <span class="capacity-label">Weight:</span>
                          <span class="capacity-value">{{ route.capacity.weight }} lbs</span>
                        </div>
                        <div class="capacity-metric">
                          <span class="capacity-label">Pallets:</span>
                          <span class="capacity-value">{{ route.capacity.pallets }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Size Distribution -->
            <div class="product-distribution">
              <div class="distribution-header">
                <h3>Product Size Distribution Planning</h3>
                <p-button label="Update Distribution" 
                         icon="pi pi-chart-pie" 
                         severity="secondary"
                         (onClick)="updateProductDistribution()">
                </p-button>
              </div>
              <div class="distribution-content">
                <div class="distribution-chart">
                  <div class="chart-item" *ngFor="let size of capacityPlanning.productSizeDistribution | keyvalue">
                    <div class="chart-bar">
                      <div class="bar-fill" [style.width.%]="size.value"></div>
                    </div>
                    <div class="chart-label">
                      <span class="size-name">{{ size.key | titlecase }}</span>
                      <span class="size-percentage">{{ size.value }}%</span>
                    </div>
                  </div>
                </div>
                <div class="distribution-stats">
                  <div class="stat-item">
                    <span class="stat-label">Average Service Time per Stop</span>
                    <span class="stat-value">{{ capacityPlanning.averageServiceTimePerStop }} min</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Max Service Time per Route</span>
                    <span class="stat-value">{{ capacityPlanning.maxServiceTimePerRoute }} min</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Service Time Efficiency Target</span>
                    <span class="stat-value">{{ (capacityPlanning.serviceTimeEfficiency * 100) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>

    <!-- Schedule Delivery Dialog -->
    <p-dialog header="Schedule Delivery" 
              [(visible)]="showScheduleDeliveryDialog" 
              [modal]="true" 
              [closable]="true" 
              [dismissableMask]="true"
              [style]="{width: '700px'}">
      <form (ngSubmit)="submitScheduleDelivery()" #scheduleDeliveryForm="ngForm">
        <div class="form-fields">
          <div class="field">
            <label for="deliveryDate">Delivery Date</label>
            <p-calendar id="deliveryDate" 
                       [(ngModel)]="newDelivery.date" 
                       name="deliveryDate" 
                       dateFormat="yy-mm-dd" 
                       showIcon="true" 
                       required>
            </p-calendar>
          </div>
          <div class="field">
            <label for="deliveryTime">Preferred Time Slot</label>
            <p-dropdown id="deliveryTime" 
                       [options]="timeSlots" 
                       [(ngModel)]="newDelivery.timeSlot" 
                       name="deliveryTime" 
                       optionLabel="label" 
                       placeholder="Select Time Slot" 
                       required>
            </p-dropdown>
          </div>
          <div class="field">
            <label for="assignedRoute">Assign to Route</label>
            <p-dropdown id="assignedRoute" 
                       [options]="availableRoutes" 
                       [(ngModel)]="newDelivery.route" 
                       name="assignedRoute" 
                       optionLabel="routeNumber" 
                       placeholder="Select Route (Optional)">
            </p-dropdown>
          </div>
          <div class="field">
            <label for="assignedVehicle">Assign Vehicle</label>
            <p-dropdown id="assignedVehicle" 
                       [options]="availableVehicles" 
                       [(ngModel)]="newDelivery.vehicle" 
                       name="assignedVehicle" 
                       optionLabel="id" 
                       placeholder="Select Vehicle (Optional)">
            </p-dropdown>
          </div>
          <div class="field">
            <label for="assignedDriver">Assign Driver</label>
            <p-dropdown id="assignedDriver" 
                       [options]="availableDrivers" 
                       [(ngModel)]="newDelivery.driver" 
                       name="assignedDriver" 
                       optionLabel="name" 
                       placeholder="Select Driver (Optional)">
            </p-dropdown>
          </div>
          <div class="field">
            <label for="deliveryNotes">Delivery Notes</label>
            <textarea id="deliveryNotes" 
                      pInputTextarea 
                      [(ngModel)]="newDelivery.notes" 
                      name="deliveryNotes" 
                      rows="3"
                      placeholder="Special instructions for delivery">
            </textarea>
          </div>
        </div>
        <div class="form-actions">
          <p-button type="button" 
                   label="Cancel" 
                   severity="secondary" 
                   (onClick)="closeScheduleDeliveryDialog()">
          </p-button>
          <p-button type="submit" 
                   label="Schedule Delivery" 
                   severity="primary" 
                   [disabled]="!scheduleDeliveryForm.form.valid || scheduleDeliveryLoading">
          </p-button>
        </div>
      </form>
    </p-dialog>
  `,
  styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit, OnDestroy {
  loading = false;
  private subscriptions = new Subscription();

  // Breadcrumb
  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Scheduling', routerLink: '/scheduling' }
  ];
  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  // Stats
  deliveryStats = {
    pendingOrders: 45,
    scheduledDeliveries: 28,
    avgDeliveryTime: 3.2,
    completedDeliveries: 12
  };

  // Pending Orders
  pendingOrders = [
    {
      orderNumber: 'ORD-2024-001',
      customerName: 'ABC Company',
      deliveryAddress: '123 Main St, City, State',
      itemCount: 15,
      totalWeight: 250,
      priority: 'High',
      receivedDate: new Date(2024, 0, 20, 9, 30),
      status: 'Pending'
    },
    {
      orderNumber: 'ORD-2024-002',
      customerName: 'XYZ Corporation',
      deliveryAddress: '456 Oak Ave, City, State',
      itemCount: 8,
      totalWeight: 120,
      priority: 'Medium',
      receivedDate: new Date(2024, 0, 20, 10, 15),
      status: 'Pending'
    },
    {
      orderNumber: 'ORD-2024-003',
      customerName: 'DEF Industries',
      deliveryAddress: '789 Pine Rd, City, State',
      itemCount: 22,
      totalWeight: 380,
      priority: 'Low',
      receivedDate: new Date(2024, 0, 20, 11, 0),
      status: 'Scheduled'
    }
  ];

  // Delivery Time Slots
  deliveryTimeSlots = [
    {
      time: '08:00 - 10:00',
      deliveries: [
        {
          orderNumber: 'ORD-2024-001',
          customerName: 'ABC Company',
          routeNumber: 'R001',
          status: 'Scheduled'
        },
        {
          orderNumber: 'ORD-2024-004',
          customerName: 'GHI Ltd',
          routeNumber: 'R002',
          status: 'In Transit'
        }
      ]
    },
    {
      time: '10:00 - 12:00',
      deliveries: [
        {
          orderNumber: 'ORD-2024-002',
          customerName: 'XYZ Corporation',
          routeNumber: 'R001',
          status: 'Scheduled'
        }
      ]
    },
    {
      time: '14:00 - 16:00',
      deliveries: [
        {
          orderNumber: 'ORD-2024-003',
          customerName: 'DEF Industries',
          routeNumber: 'R003',
          status: 'Pending'
        }
      ]
    }
  ];

  // Active Routes
  activeRoutes = [
    {
      routeNumber: 'R001',
      stops: 8,
      estimatedTime: 4.5,
      assignedVehicle: 'V001',
      status: 'Active',
      progress: 75
    },
    {
      routeNumber: 'R002',
      stops: 5,
      estimatedTime: 3.2,
      assignedVehicle: 'V002',
      status: 'Active',
      progress: 60
    },
    {
      routeNumber: 'R003',
      stops: 12,
      estimatedTime: 6.0,
      assignedVehicle: null,
      status: 'Planning',
      progress: 25
    }
  ];

  // Available Vehicles
  availableVehicles = [
    {
      id: 'V001',
      type: 'Delivery Van',
      capacity: 1000,
      status: 'Available',
      currentRoute: 'R001'
    },
    {
      id: 'V002',
      type: 'Box Truck',
      capacity: 2000,
      status: 'Available',
      currentRoute: 'R002'
    },
    {
      id: 'V003',
      type: 'Delivery Van',
      capacity: 1000,
      status: 'Maintenance',
      currentRoute: null
    }
  ];

  // Available Drivers
  availableDrivers = [
    {
      name: 'John Smith',
      licenseType: 'CDL-B',
      hoursThisWeek: 32,
      maxHours: 40,
      status: 'Available',
      currentRoute: 'R001'
    },
    {
      name: 'Sarah Johnson',
      licenseType: 'CDL-A',
      hoursThisWeek: 28,
      maxHours: 40,
      status: 'Available',
      currentRoute: 'R002'
    },
    {
      name: 'Mike Wilson',
      licenseType: 'CDL-B',
      hoursThisWeek: 40,
      maxHours: 40,
      status: 'Overtime',
      currentRoute: null
    }
  ];

  // Analytics
  analytics = {
    onTimeDeliveryRate: 94,
    avgDeliveryTime: 3.2,
    avgDeliveryTimePercentage: 80,
    routeEfficiency: 87,
    customerSatisfaction: 92
  };

  // Trends
  trends = {
    peakHours: '10:00 AM - 2:00 PM',
    popularRoutes: ['R001', 'R003', 'R005'],
    avgOrdersPerRoute: 8.5
  };

  // Capacity Management Data - Refactored for Product Size & Service Time
  capacityMetrics = {
    // Vehicle Capacity by Dimensions
    vehicleCapacity: {
      '26ft_box_truck': {
        name: '26ft Box Truck',
        dimensions: { length: 26, width: 8.5, height: 8.5 }, // feet
        volume: 1877, // cubic feet
        weightCapacity: 26000, // lbs
        palletCapacity: 12, // standard pallets
        currentUtilization: 78
      },
      '16ft_box_truck': {
        name: '16ft Box Truck',
        dimensions: { length: 16, width: 7.5, height: 7.5 },
        volume: 900,
        weightCapacity: 16000,
        palletCapacity: 6,
        currentUtilization: 85
      },
      'delivery_van': {
        name: 'Delivery Van',
        dimensions: { length: 12, width: 6, height: 6 },
        volume: 432,
        weightCapacity: 3500,
        palletCapacity: 2,
        currentUtilization: 92
      }
    },
    
    // Service Time Standards (minutes per stop)
    serviceTimeStandards: {
      'residential_delivery': {
        name: 'Residential Delivery',
        baseTime: 15, // minutes
        perItem: 2, // additional minutes per item
        perPallet: 10, // additional minutes per pallet
        setupTime: 5, // unloading setup
        signatureTime: 3 // customer signature
      },
      'commercial_delivery': {
        name: 'Commercial Delivery',
        baseTime: 20,
        perItem: 1.5,
        perPallet: 8,
        setupTime: 8,
        signatureTime: 2
      },
      'warehouse_delivery': {
        name: 'Warehouse Delivery',
        baseTime: 25,
        perItem: 1,
        perPallet: 5,
        setupTime: 10,
        signatureTime: 1
      }
    },

    // Route Capacity Planning
    routeCapacity: {
      maxStopsPerRoute: 12,
      maxRouteDuration: 480, // minutes (8 hours)
      maxDrivingTime: 360, // minutes (6 hours)
      maxServiceTime: 120, // minutes (2 hours)
      bufferTime: 30 // minutes buffer
    }
  };

  // Product Size Categories
  productSizeCategories = [
    {
      category: 'small',
      name: 'Small Items',
      dimensions: { length: 1, width: 1, height: 1 }, // feet
      volume: 1, // cubic feet
      weight: 5, // lbs
      serviceTime: 2 // minutes
    },
    {
      category: 'medium',
      name: 'Medium Items',
      dimensions: { length: 2, width: 2, height: 2 },
      volume: 8,
      weight: 25,
      serviceTime: 5
    },
    {
      category: 'large',
      name: 'Large Items',
      dimensions: { length: 4, width: 3, height: 3 },
      volume: 36,
      weight: 100,
      serviceTime: 10
    },
    {
      category: 'pallet',
      name: 'Pallet Items',
      dimensions: { length: 4, width: 4, height: 4 },
      volume: 64,
      weight: 1000,
      serviceTime: 15
    }
  ];

  // Vehicle Allocation with Product Size Focus
  vehicleAllocation = [
    {
      id: 'V001',
      type: '26ft_box_truck',
      name: '26ft Box Truck',
      currentLoad: {
        volume: 1464, // cubic feet used
        weight: 18500, // lbs used
        pallets: 8,
        items: 45
      },
      capacity: {
        volume: 1877,
        weight: 26000,
        pallets: 12
      },
      utilization: {
        volume: 78,
        weight: 71,
        pallets: 67
      },
      route: 'R001',
      estimatedServiceTime: 180 // minutes
    },
    {
      id: 'V002',
      type: '16ft_box_truck',
      name: '16ft Box Truck',
      currentLoad: {
        volume: 765,
        weight: 12000,
        pallets: 4,
        items: 32
      },
      capacity: {
        volume: 900,
        weight: 16000,
        pallets: 6
      },
      utilization: {
        volume: 85,
        weight: 75,
        pallets: 67
      },
      route: 'R002',
      estimatedServiceTime: 140
    },
    {
      id: 'V003',
      type: 'delivery_van',
      name: 'Delivery Van',
      currentLoad: {
        volume: 397,
        weight: 2800,
        pallets: 1,
        items: 18
      },
      capacity: {
        volume: 432,
        weight: 3500,
        pallets: 2
      },
      utilization: {
        volume: 92,
        weight: 80,
        pallets: 50
      },
      route: 'R003',
      estimatedServiceTime: 95
    }
  ];

  // Route Planning with Service Time Calculations
  routePlanning = {
    routes: [
      {
        routeId: 'R001',
        vehicleType: '26ft_box_truck',
        totalStops: 8,
        totalDistance: 45, // miles
        drivingTime: 72, // minutes
        serviceTime: 180, // minutes (calculated)
        totalTime: 252, // minutes
        capacity: {
          volume: 1464,
          weight: 18500,
          pallets: 8
        },
        stops: [
          {
            stopNumber: 1,
            address: '123 Main St, City A',
            serviceType: 'residential_delivery',
            items: [
              { productId: 'P001', size: 'medium', quantity: 2, serviceTime: 8 },
              { productId: 'P002', size: 'small', quantity: 1, serviceTime: 2 }
            ],
            totalServiceTime: 10,
            estimatedArrival: '09:30'
          },
          {
            stopNumber: 2,
            address: '456 Oak Ave, City B',
            serviceType: 'commercial_delivery',
            items: [
              { productId: 'P003', size: 'pallet', quantity: 1, serviceTime: 15 },
              { productId: 'P004', size: 'large', quantity: 1, serviceTime: 10 }
            ],
            totalServiceTime: 25,
            estimatedArrival: '10:15'
          }
        ]
      }
    ],
    
    // Capacity Planning Settings
    planningSettings: {
      maxStopsPerRoute: 12,
      maxRouteDuration: 480, // 8 hours
      maxDrivingTime: 360, // 6 hours
      serviceTimeBuffer: 0.2, // 20% buffer
      volumeUtilization: 0.85, // 85% max volume
      weightUtilization: 0.8 // 80% max weight
    }
  };

  // Service Time Calculator Methods
  calculateServiceTime(order: any): number {
    let totalTime = 0;
    
    // Get service type standards
    const serviceType = order.serviceType || 'residential_delivery';
    const standards = this.capacityMetrics.serviceTimeStandards[serviceType as keyof typeof this.capacityMetrics.serviceTimeStandards];
    
    // Base time
    totalTime += standards.baseTime;
    
    // Add time per item
    order.items.forEach((item: any) => {
      const productSize = this.productSizeCategories.find((p: any) => p.category === item.size);
      if (productSize) {
        totalTime += productSize.serviceTime * item.quantity;
      }
    });
    
    // Add setup and signature time
    totalTime += standards.setupTime + standards.signatureTime;
    
    return totalTime;
  }

  calculateRouteServiceTime(route: any): number {
    return route.stops.reduce((total: number, stop: any) => {
      return total + stop.totalServiceTime;
    }, 0);
  }

  calculateVehicleCapacity(vehicleType: string, items: any[]): any {
    const vehicle = this.capacityMetrics.vehicleCapacity[vehicleType as keyof typeof this.capacityMetrics.vehicleCapacity];
    let usedVolume = 0;
    let usedWeight = 0;
    let usedPallets = 0;
    
    items.forEach(item => {
      const productSize = this.productSizeCategories.find((p: any) => p.category === item.size);
      if (productSize) {
        usedVolume += productSize.volume * item.quantity;
        usedWeight += productSize.weight * item.quantity;
        if (item.size === 'pallet') {
          usedPallets += item.quantity;
        }
      }
    });
    
    return {
      volume: usedVolume,
      weight: usedWeight,
      pallets: usedPallets,
      volumeUtilization: (usedVolume / vehicle.volume) * 100,
      weightUtilization: (usedWeight / vehicle.weightCapacity) * 100,
      palletUtilization: (usedPallets / vehicle.palletCapacity) * 100
    };
  }

  // Driver Allocation (keeping for compatibility)
  driverAllocation = [
    {
      name: 'John Smith',
      licenseType: 'CDL-B',
      hoursAvailable: 40,
      hoursUsed: 32,
      utilization: 80
    },
    {
      name: 'Sarah Johnson',
      licenseType: 'CDL-A',
      hoursAvailable: 40,
      hoursUsed: 28,
      utilization: 70
    },
    {
      name: 'Mike Wilson',
      licenseType: 'CDL-B',
      hoursAvailable: 40,
      hoursUsed: 40,
      utilization: 100
    }
  ];

  // Capacity Analytics
  capacityAnalytics = {
    utilizationTrend: 85,
    trendDirection: 'up',
    trendChange: 12,
    bottleneck: 'Vehicle Capacity',
    bottleneckDescription: 'Vehicle capacity is the primary constraint limiting delivery throughput',
    efficiency: 78
  };

  capacityTimeframes = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Last Year', value: '1y' }
  ];
  selectedCapacityTimeframe = this.capacityTimeframes[0];

  // Capacity Planning
  capacityPlanning = {
    forecastPeriod: 7,
    orderGrowth: 15,
    peakMultiplier: 1.5,
    safetyBuffer: 20,
    
    // Product Size Planning
    productSizeDistribution: {
      small: 40, // percentage
      medium: 35,
      large: 20,
      pallet: 5
    },
    
    // Service Time Planning
    averageServiceTimePerStop: 12, // minutes
    maxServiceTimePerRoute: 120, // minutes
    serviceTimeEfficiency: 0.85 // 85% efficiency target
  };

  // Form Data
  orderFilters = [
    { label: 'All Orders', value: 'all' },
    { label: 'High Priority', value: 'high' },
    { label: 'Pending', value: 'pending' },
    { label: 'Scheduled', value: 'scheduled' }
  ];
  selectedOrderFilter = this.orderFilters[0];

  deliveryFilters = [
    { label: 'All Deliveries', value: 'all' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'In Transit', value: 'in-transit' },
    { label: 'Completed', value: 'completed' }
  ];
  selectedDeliveryFilter = this.deliveryFilters[0];

  optimizationCriteria = [
    { label: 'Minimize Distance', value: 'distance' },
    { label: 'Minimize Time', value: 'time' },
    { label: 'Maximize Efficiency', value: 'efficiency' },
    { label: 'Balance Workload', value: 'balance' }
  ];
  selectedOptimizationCriteria = this.optimizationCriteria[0];

  optimizationSettings = {
    maxStopsPerRoute: 10,
    maxRouteDuration: 8,
    vehicleCapacity: 1500
  };

  timeSlots = [
    { label: '08:00 - 10:00', value: '08:00-10:00' },
    { label: '10:00 - 12:00', value: '10:00-12:00' },
    { label: '12:00 - 14:00', value: '12:00-14:00' },
    { label: '14:00 - 16:00', value: '14:00-16:00' },
    { label: '16:00 - 18:00', value: '16:00-18:00' }
  ];

  availableRoutes = [
    { routeNumber: 'R001', stops: 8, estimatedTime: 4.5 },
    { routeNumber: 'R002', stops: 5, estimatedTime: 3.2 },
    { routeNumber: 'R003', stops: 12, estimatedTime: 6.0 }
  ];

  // Dialog States
  showScheduleDeliveryDialog = false;
  scheduleDeliveryLoading = false;
  optimizationLoading = false;
  forecastLoading = false;
  selectedDate = new Date();

  newDelivery = {
    date: null,
    timeSlot: null,
    route: null,
    vehicle: null,
    driver: null,
    notes: ''
  };

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadSchedulingData();
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error
          });
        }
      })
    );
  }

  private loadSchedulingData(): void {
    // Load scheduling data from API
    // this.apiService.getSchedulingData().subscribe();
  }

  // Status Severity Methods
  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warn';
      case 'Low': return 'success';
      default: return 'info';
    }
  }

  getOrderStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Scheduled': return 'success';
      case 'Pending': return 'warn';
      case 'In Transit': return 'info';
      case 'Delivered': return 'secondary';
      default: return 'info';
    }
  }

  getDeliveryStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Scheduled': return 'success';
      case 'In Transit': return 'warn';
      case 'Delivered': return 'info';
      case 'Pending': return 'secondary';
      default: return 'info';
    }
  }

  getRouteStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Active': return 'success';
      case 'Planning': return 'info';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'danger';
      default: return 'info';
    }
  }

  getVehicleStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Available': return 'success';
      case 'In Use': return 'warn';
      case 'Maintenance': return 'danger';
      case 'Out of Service': return 'secondary';
      default: return 'info';
    }
  }

  getDriverStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Available': return 'success';
      case 'Overtime': return 'warn';
      case 'Off Duty': return 'secondary';
      case 'Sick Leave': return 'danger';
      default: return 'info';
    }
  }

  // Action Methods
  scheduleNewDelivery(): void {
    this.showScheduleDeliveryDialog = true;
  }

  closeScheduleDeliveryDialog(): void {
    this.showScheduleDeliveryDialog = false;
    this.newDelivery = {
      date: null,
      timeSlot: null,
      route: null,
      vehicle: null,
      driver: null,
      notes: ''
    };
  }

  submitScheduleDelivery(): void {
    this.scheduleDeliveryLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.scheduleDeliveryLoading = false;
      this.showScheduleDeliveryDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Delivery scheduled successfully!'
      });
    }, 1000);
  }

  bulkScheduleDeliveries(): void {
    console.log('Bulk scheduling deliveries');
  }

  autoScheduleOrders(): void {
    console.log('Auto-scheduling orders');
  }

  exportOrderQueue(): void {
    console.log('Exporting order queue');
  }

  scheduleOrder(order: any): void {
    console.log('Scheduling order:', order);
    this.scheduleNewDelivery();
  }

  viewOrder(order: any): void {
    console.log('Viewing order:', order);
  }

  editOrder(order: any): void {
    console.log('Editing order:', order);
  }

  optimizeDeliveryRoutes(): void {
    this.optimizationLoading = true;
    // Simulate optimization
    setTimeout(() => {
      this.optimizationLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Optimization Complete',
        detail: 'Delivery routes have been optimized!'
      });
    }, 2000);
  }

  assignVehicle(delivery: any): void {
    console.log('Assigning vehicle to delivery:', delivery);
  }

  assignDriver(delivery: any): void {
    console.log('Assigning driver to delivery:', delivery);
  }

  createNewRoute(): void {
    console.log('Creating new route');
  }

  viewRoute(route: any): void {
    console.log('Viewing route:', route);
  }

  editRoute(route: any): void {
    console.log('Editing route:', route);
  }

  optimizeRoute(route: any): void {
    console.log('Optimizing route:', route);
  }

  runRouteOptimization(): void {
    this.optimizationLoading = true;
    // Simulate optimization
    setTimeout(() => {
      this.optimizationLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Optimization Complete',
        detail: 'Routes have been optimized successfully!'
      });
    }, 3000);
  }

  resetOptimizationSettings(): void {
    this.optimizationSettings = {
      maxStopsPerRoute: 10,
      maxRouteDuration: 8,
      vehicleCapacity: 1500
    };
    this.selectedOptimizationCriteria = this.optimizationCriteria[0];
  }

  addVehicle(): void {
    console.log('Adding vehicle');
  }

  assignVehicleToRoute(vehicle: any): void {
    console.log('Assigning vehicle to route:', vehicle);
  }

  scheduleMaintenance(vehicle: any): void {
    console.log('Scheduling maintenance for vehicle:', vehicle);
  }

  addDriver(): void {
    console.log('Adding driver');
  }

  assignDriverToRoute(driver: any): void {
    console.log('Assigning driver to route:', driver);
  }

  viewDriverSchedule(driver: any): void {
    console.log('Viewing driver schedule:', driver);
  }

  generateDeliveryReport(): void {
    console.log('Generating delivery report');
  }

  exportAnalyticsData(): void {
    console.log('Exporting analytics data');
  }

  updateCapacitySettings(): void {
    console.log('Updating capacity settings');
  }

  optimizeCapacity(): void {
    console.log('Optimizing capacity');
  }

  resetCapacityPlanning(): void {
    this.capacityPlanning = {
      forecastPeriod: 7,
      orderGrowth: 15,
      peakMultiplier: 1.5,
      safetyBuffer: 20,
      productSizeDistribution: {
        small: 40,
        medium: 35,
        large: 20,
        pallet: 5
      },
      averageServiceTimePerStop: 12,
      maxServiceTimePerRoute: 120,
      serviceTimeEfficiency: 0.85
    };
    this.selectedOptimizationCriteria = this.optimizationCriteria[0];
  }

  generateCapacityForecast(): void {
    this.forecastLoading = true;
    // Simulate forecast generation
    setTimeout(() => {
      this.forecastLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Forecast Generated',
        detail: 'Capacity forecast generated successfully!'
      });
    }, 2000);
  }

  autoAllocateResources(): void {
    console.log('Auto-allocating resources');
  }

  editVehicleAllocation(vehicle: any): void {
    console.log('Editing vehicle allocation:', vehicle);
  }

  viewVehicleUtilization(vehicle: any): void {
    console.log('Viewing vehicle utilization:', vehicle);
  }

  editDriverAllocation(driver: any): void {
    console.log('Editing driver allocation:', driver);
  }

  exportCapacityReport(): void {
    console.log('Exporting capacity report');
  }

  calculateRouteCapacity(): void {
    console.log('Calculating route capacity');
    // This method will be implemented to calculate and display route capacity based on planning settings
  }

  updateProductDistribution(): void {
    console.log('Updating product distribution');
    // This method will be implemented to allow users to adjust product size distribution
  }
} 