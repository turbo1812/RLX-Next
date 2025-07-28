import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    ProgressBarModule,
    TagModule,
    TabViewModule,
    ChartModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="services-container">
      <!-- Header Section -->
      <div class="services-header">
        <div class="header-content">
          <div class="header-left">
            <h1>3PL Last-Mile Delivery Services</h1>
            <p>Specialized big & bulky delivery for major retail providers - Furniture, Appliances, Electronics</p>
          </div>
          <div class="header-actions">
            <p-button label="New Service Contract" 
                     icon="pi pi-plus" 
                     severity="primary"
                     (onClick)="createNewService()">
            </p-button>
            <p-button label="Service Analytics" 
                     icon="pi pi-chart-bar" 
                     severity="secondary"
                     (onClick)="viewServiceAnalytics()">
            </p-button>
          </div>
        </div>
      </div>

      <!-- Service Overview Stats -->
      <div class="service-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-truck"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ serviceStats.activeDeliveries }}</div>
            <div class="stat-label">Active Deliveries</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-building"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ serviceStats.retailPartners }}</div>
            <div class="stat-label">Retail Partners</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-box"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ serviceStats.bulkyItems }}</div>
            <div class="stat-label">Bulky Items Today</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ serviceStats.avgDeliveryTime }}h</div>
            <div class="stat-label">Avg Delivery Time</div>
          </div>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <p-tabView>
        <!-- Service Contracts Tab -->
        <p-tabPanel header="Service Contracts">
          <div class="contracts-section">
            <div class="section-controls">
              <div class="controls-left">
                <p-dropdown [options]="retailPartners" 
                           [(ngModel)]="selectedRetailPartner"
                           placeholder="Filter by Retail Partner"
                           styleClass="filter-dropdown">
                </p-dropdown>
                <p-dropdown [options]="serviceTypes" 
                           [(ngModel)]="selectedServiceType"
                           placeholder="Filter by Service Type"
                           styleClass="filter-dropdown">
                </p-dropdown>
              </div>
              <div class="controls-right">
                <p-button label="Export Contracts" 
                         icon="pi pi-download" 
                         severity="secondary"
                         (onClick)="exportContracts()">
                </p-button>
              </div>
            </div>

            <p-table [value]="serviceContracts" 
                    [paginator]="true" 
                    [rows]="10"
                    [globalFilterFields]="['retailPartner', 'serviceType', 'contractNumber']"
                    styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th>Contract #</th>
                  <th>Retail Partner</th>
                  <th>Service Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Volume</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-contract>
                <tr>
                  <td>{{ contract.contractNumber }}</td>
                  <td>
                    <div class="partner-info">
                      <span class="partner-name">{{ contract.retailPartner }}</span>
                      <span class="partner-category">{{ contract.partnerCategory }}</span>
                    </div>
                  </td>
                  <td>
                    <p-tag [value]="contract.serviceType" 
                          [severity]="getServiceTypeSeverity(contract.serviceType)">
                    </p-tag>
                  </td>
                  <td>{{ contract.startDate | date:'shortDate' }}</td>
                  <td>{{ contract.endDate | date:'shortDate' }}</td>
                  <td>
                    <div class="volume-info">
                      <span>{{ contract.monthlyVolume }} items/month</span>
                      <p-progressBar [value]="contract.volumeUtilization" 
                                    [showValue]="false"
                                    styleClass="volume-progress">
                      </p-progressBar>
                    </div>
                  </td>
                  <td>
                    <p-tag [value]="contract.status" 
                          [severity]="getStatusSeverity(contract.status)">
                    </p-tag>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <p-button icon="pi pi-eye" 
                               severity="secondary" 
                               size="small"
                               (onClick)="viewContract(contract)">
                      </p-button>
                      <p-button icon="pi pi-pencil" 
                               severity="secondary" 
                               size="small"
                               (onClick)="editContract(contract)">
                      </p-button>
                      <p-button icon="pi pi-trash" 
                               severity="danger" 
                               size="small"
                               (onClick)="deleteContract(contract)">
                      </p-button>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </p-tabPanel>

        <!-- Delivery Services Tab -->
        <p-tabPanel header="Delivery Services">
          <div class="delivery-services">
            <div class="service-categories">
              <div class="category-card" *ngFor="let category of deliveryCategories">
                <div class="category-header">
                  <div class="category-icon">
                    <i [class]="category.icon"></i>
                  </div>
                  <div class="category-info">
                    <h3>{{ category.name }}</h3>
                    <p>{{ category.description }}</p>
                  </div>
                  <div class="category-stats">
                    <span class="stat">{{ category.activeDeliveries }} active</span>
                    <span class="stat">{{ category.completedToday }} today</span>
                  </div>
                </div>
                <div class="category-details">
                  <div class="detail-item">
                    <span class="label">Special Requirements:</span>
                    <span class="value">{{ category.specialRequirements.join(', ') }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Delivery Window:</span>
                    <span class="value">{{ category.deliveryWindow }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Service Level:</span>
                    <span class="value">{{ category.serviceLevel }}</span>
                  </div>
                </div>
                <div class="category-actions">
                  <p-button label="View Details" 
                           icon="pi pi-arrow-right" 
                           severity="secondary"
                           size="small"
                           (onClick)="viewCategoryDetails(category)">
                  </p-button>
                  <p-button label="Manage Services" 
                           icon="pi pi-cog" 
                           severity="primary"
                           size="small"
                           (onClick)="manageCategoryServices(category)">
                  </p-button>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Retail Partners Tab -->
        <p-tabPanel header="Retail Partners">
          <div class="retail-partners">
            <div class="partners-grid">
              <div class="partner-card" *ngFor="let partner of retailPartnersData">
                <div class="partner-header">
                  <div class="partner-logo">
                    <i [class]="partner.logoIcon"></i>
                  </div>
                  <div class="partner-info">
                    <h3>{{ partner.name }}</h3>
                    <p class="partner-category">{{ partner.category }}</p>
                    <p class="partner-location">{{ partner.location }}</p>
                  </div>
                  <div class="partner-status">
                    <p-tag [value]="partner.status" 
                          [severity]="getPartnerStatusSeverity(partner.status)">
                    </p-tag>
                  </div>
                </div>
                <div class="partner-metrics">
                  <div class="metric">
                    <span class="metric-label">Active Contracts</span>
                    <span class="metric-value">{{ partner.activeContracts }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Monthly Volume</span>
                    <span class="metric-value">{{ partner.monthlyVolume }} items</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Service Rating</span>
                    <span class="metric-value">{{ partner.serviceRating }}/5</span>
                  </div>
                </div>
                <div class="partner-services">
                  <h4>Service Types</h4>
                  <div class="service-tags">
                    <p-tag *ngFor="let service of partner.serviceTypes" 
                          [value]="service" 
                          severity="info">
                    </p-tag>
                  </div>
                </div>
                <div class="partner-actions">
                  <p-button label="View Details" 
                           icon="pi pi-eye" 
                           severity="secondary"
                           size="small"
                           (onClick)="viewPartnerDetails(partner)">
                  </p-button>
                  <p-button label="Manage Contract" 
                           icon="pi pi-file-edit" 
                           severity="primary"
                           size="small"
                           (onClick)="managePartnerContract(partner)">
                  </p-button>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Service Analytics Tab -->
        <p-tabPanel header="Service Analytics">
          <div class="service-analytics">
            <div class="analytics-grid">
              <div class="analytics-card">
                <h3>Delivery Performance</h3>
                <div class="performance-metrics">
                  <div class="metric-item">
                    <span class="metric-label">On-Time Delivery</span>
                    <span class="metric-value">{{ analytics.onTimeDelivery }}%</span>
                    <p-progressBar [value]="analytics.onTimeDelivery" 
                                  [showValue]="false">
                    </p-progressBar>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">Customer Satisfaction</span>
                    <span class="metric-value">{{ analytics.customerSatisfaction }}/5</span>
                    <p-progressBar [value]="analytics.customerSatisfaction * 20" 
                                  [showValue]="false">
                    </p-progressBar>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">Damage Rate</span>
                    <span class="metric-value">{{ analytics.damageRate }}%</span>
                    <p-progressBar [value]="analytics.damageRate" 
                                  [showValue]="false">
                    </p-progressBar>
                  </div>
                </div>
              </div>

              <div class="analytics-card">
                <h3>Volume by Category</h3>
                <div class="volume-breakdown">
                  <div class="volume-item" *ngFor="let item of analytics.volumeByCategory">
                    <div class="volume-header">
                      <span class="category-name">{{ item.category }}</span>
                      <span class="volume-percentage">{{ item.percentage }}%</span>
                    </div>
                    <div class="volume-bar">
                      <div class="bar-fill" [style.width.%]="item.percentage"></div>
                    </div>
                    <span class="volume-count">{{ item.count }} items</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-charts">
              <div class="chart-card">
                <h3>Delivery Trends</h3>
                <div class="trend-metrics">
                  <div class="trend-item">
                    <span class="trend-label">Weekly Growth</span>
                    <span class="trend-value" [ngClass]="{'positive': analytics.weeklyGrowth > 0, 'negative': analytics.weeklyGrowth < 0}">
                      {{ analytics.weeklyGrowth > 0 ? '+' : '' }}{{ analytics.weeklyGrowth }}%
                    </span>
                  </div>
                  <div class="trend-item">
                    <span class="trend-label">Peak Hours</span>
                    <span class="trend-value">{{ analytics.peakHours }}</span>
                  </div>
                  <div class="trend-item">
                    <span class="trend-label">Avg Route Efficiency</span>
                    <span class="trend-value">{{ analytics.routeEfficiency }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>

    <!-- New Service Contract Dialog -->
    <p-dialog header="New Service Contract" 
              [(visible)]="showNewServiceDialog" 
              [modal]="true" 
              [style]="{width: '600px'}"
              [draggable]="false" 
              [resizable]="false">
      <div class="dialog-content">
        <div class="form-fields">
          <div class="field">
            <label for="retailPartner">Retail Partner</label>
            <p-dropdown id="retailPartner" 
                       [options]="retailPartners" 
                       [(ngModel)]="newService.retailPartner"
                       placeholder="Select Retail Partner"
                       optionLabel="name">
            </p-dropdown>
          </div>
          <div class="field">
            <label for="serviceType">Service Type</label>
            <p-dropdown id="serviceType" 
                       [options]="serviceTypes" 
                       [(ngModel)]="newService.serviceType"
                       placeholder="Select Service Type"
                       optionLabel="label">
            </p-dropdown>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="startDate">Start Date</label>
              <p-calendar id="startDate" 
                         [(ngModel)]="newService.startDate"
                         dateFormat="yy-mm-dd">
              </p-calendar>
            </div>
            <div class="field">
              <label for="endDate">End Date</label>
              <p-calendar id="endDate" 
                         [(ngModel)]="newService.endDate"
                         dateFormat="yy-mm-dd">
              </p-calendar>
            </div>
          </div>
          <div class="field">
            <label for="monthlyVolume">Monthly Volume</label>
            <p-inputNumber id="monthlyVolume" 
                          [(ngModel)]="newService.monthlyVolume"
                          [min]="1"
                          suffix=" items">
            </p-inputNumber>
          </div>
          <div class="field">
            <label for="specialRequirements">Special Requirements</label>
            <p-multiselect id="specialRequirements" 
                          [options]="specialRequirements" 
                          [(ngModel)]="newService.specialRequirements"
                          placeholder="Select Requirements"
                          optionLabel="label">
            </p-multiselect>
          </div>
        </div>
        <div class="form-actions">
          <p-button label="Cancel" 
                   severity="secondary" 
                   (onClick)="closeNewServiceDialog()">
          </p-button>
          <p-button label="Create Contract" 
                   severity="primary" 
                   [loading]="creatingService"
                   (onClick)="submitNewService()">
          </p-button>
        </div>
      </div>
    </p-dialog>
  `,
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  // Service Statistics
  serviceStats = {
    activeDeliveries: 156,
    retailPartners: 24,
    bulkyItems: 342,
    avgDeliveryTime: 2.8
  };

  // Service Contracts
  serviceContracts = [
    {
      contractNumber: 'CTR-2024-001',
      retailPartner: 'Home Depot',
      partnerCategory: 'Home Improvement',
      serviceType: 'Furniture Delivery',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      monthlyVolume: 500,
      volumeUtilization: 85,
      status: 'Active'
    },
    {
      contractNumber: 'CTR-2024-002',
      retailPartner: 'Best Buy',
      partnerCategory: 'Electronics',
      serviceType: 'Appliance Delivery',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-12-31'),
      monthlyVolume: 300,
      volumeUtilization: 92,
      status: 'Active'
    },
    {
      contractNumber: 'CTR-2024-003',
      retailPartner: 'Wayfair',
      partnerCategory: 'Online Retail',
      serviceType: 'Furniture Assembly',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
      monthlyVolume: 800,
      volumeUtilization: 78,
      status: 'Active'
    }
  ];

  // Delivery Categories
  deliveryCategories = [
    {
      name: 'Furniture Delivery',
      description: 'Specialized delivery and setup for furniture items',
      icon: 'pi pi-couch',
      activeDeliveries: 45,
      completedToday: 23,
      specialRequirements: ['White Glove', 'Assembly', 'Room Placement'],
      deliveryWindow: '4-hour window',
      serviceLevel: 'Premium'
    },
    {
      name: 'Appliance Delivery',
      description: 'Large appliance delivery and installation services',
      icon: 'pi pi-box',
      activeDeliveries: 32,
      completedToday: 18,
      specialRequirements: ['Installation', 'Haul Away', 'Testing'],
      deliveryWindow: '2-hour window',
      serviceLevel: 'Standard'
    },
    {
      name: 'Electronics Delivery',
      description: 'Electronics and entertainment system delivery',
      icon: 'pi pi-desktop',
      activeDeliveries: 28,
      completedToday: 15,
      specialRequirements: ['Setup', 'Testing', 'Demo'],
      deliveryWindow: '3-hour window',
      serviceLevel: 'Premium'
    },
    {
      name: 'Mattress Delivery',
      description: 'Mattress and bedding delivery services',
      icon: 'pi pi-bed',
      activeDeliveries: 19,
      completedToday: 12,
      specialRequirements: ['Room Placement', 'Old Mattress Removal'],
      deliveryWindow: '2-hour window',
      serviceLevel: 'Standard'
    }
  ];

  // Retail Partners Data
  retailPartnersData = [
    {
      name: 'Home Depot',
      category: 'Home Improvement',
      location: 'Nationwide',
      status: 'Active',
      logoIcon: 'pi pi-home',
      activeContracts: 3,
      monthlyVolume: 1500,
      serviceRating: 4.8,
      serviceTypes: ['Furniture', 'Appliances', 'Tools']
    },
    {
      name: 'Best Buy',
      category: 'Electronics',
      location: 'Nationwide',
      status: 'Active',
      logoIcon: 'pi pi-desktop',
      activeContracts: 2,
      monthlyVolume: 800,
      serviceRating: 4.6,
      serviceTypes: ['Electronics', 'Appliances']
    },
    {
      name: 'Wayfair',
      category: 'Online Retail',
      location: 'Nationwide',
      status: 'Active',
      logoIcon: 'pi pi-shopping-cart',
      activeContracts: 4,
      monthlyVolume: 2200,
      serviceRating: 4.7,
      serviceTypes: ['Furniture', 'Decor', 'Appliances']
    }
  ];

  // Analytics Data
  analytics = {
    onTimeDelivery: 94,
    customerSatisfaction: 4.7,
    damageRate: 0.8,
    volumeByCategory: [
      { category: 'Furniture', percentage: 45, count: 156 },
      { category: 'Appliances', percentage: 30, count: 104 },
      { category: 'Electronics', percentage: 20, count: 69 },
      { category: 'Mattresses', percentage: 5, count: 17 }
    ],
    weeklyGrowth: 12,
    peakHours: '10:00 AM - 2:00 PM',
    routeEfficiency: 87
  };

  // Filter Options
  retailPartners = [
    { name: 'Home Depot', value: 'home_depot' },
    { name: 'Best Buy', value: 'best_buy' },
    { name: 'Wayfair', value: 'wayfair' },
    { name: 'IKEA', value: 'ikea' },
    { name: 'Ashley Furniture', value: 'ashley' }
  ];

  serviceTypes = [
    { label: 'Furniture Delivery', value: 'furniture' },
    { label: 'Appliance Delivery', value: 'appliance' },
    { label: 'Electronics Delivery', value: 'electronics' },
    { label: 'Mattress Delivery', value: 'mattress' },
    { label: 'Assembly Service', value: 'assembly' }
  ];

  specialRequirements = [
    { label: 'White Glove Service', value: 'white_glove' },
    { label: 'Assembly Required', value: 'assembly' },
    { label: 'Installation', value: 'installation' },
    { label: 'Haul Away', value: 'haul_away' },
    { label: 'Room Placement', value: 'room_placement' },
    { label: 'Testing & Demo', value: 'testing' }
  ];

  // Form Data
  selectedRetailPartner: any;
  selectedServiceType: any;
  showNewServiceDialog = false;
  creatingService = false;

  newService = {
    retailPartner: null,
    serviceType: null,
    startDate: null,
    endDate: null,
    monthlyVolume: 0,
    specialRequirements: []
  };

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    // Initialize component
  }

  // Service Contract Methods
  createNewService(): void {
    this.showNewServiceDialog = true;
  }

  closeNewServiceDialog(): void {
    this.showNewServiceDialog = false;
    this.resetNewServiceForm();
  }

  resetNewServiceForm(): void {
    this.newService = {
      retailPartner: null,
      serviceType: null,
      startDate: null,
      endDate: null,
      monthlyVolume: 0,
      specialRequirements: []
    };
  }

  submitNewService(): void {
    this.creatingService = true;
    // Simulate API call
    setTimeout(() => {
      this.creatingService = false;
      this.showNewServiceDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Service contract created successfully!'
      });
      this.resetNewServiceForm();
    }, 2000);
  }

  viewContract(contract: any): void {
    console.log('Viewing contract:', contract);
  }

  editContract(contract: any): void {
    console.log('Editing contract:', contract);
  }

  deleteContract(contract: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete contract ${contract.contractNumber}?`,
      accept: () => {
        console.log('Deleting contract:', contract);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Contract deleted successfully!'
        });
      }
    });
  }

  exportContracts(): void {
    console.log('Exporting contracts');
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Contracts exported successfully!'
    });
  }

  // Delivery Service Methods
  viewCategoryDetails(category: any): void {
    console.log('Viewing category details:', category);
  }

  manageCategoryServices(category: any): void {
    console.log('Managing category services:', category);
  }

  // Retail Partner Methods
  viewPartnerDetails(partner: any): void {
    console.log('Viewing partner details:', partner);
  }

  managePartnerContract(partner: any): void {
    console.log('Managing partner contract:', partner);
  }

  // Analytics Methods
  viewServiceAnalytics(): void {
    console.log('Viewing service analytics');
  }

  // Utility Methods
  getServiceTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severities: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined } = {
      'Furniture Delivery': 'success',
      'Appliance Delivery': 'info',
      'Electronics Delivery': 'warn',
      'Mattress Delivery': 'secondary',
      'Furniture Assembly': 'info'
    };
    return severities[type] || 'info';
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severities: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined } = {
      'Active': 'success',
      'Pending': 'warn',
      'Expired': 'danger',
      'Suspended': 'secondary'
    };
    return severities[status] || 'info';
  }

  getPartnerStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severities: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined } = {
      'Active': 'success',
      'Inactive': 'danger',
      'Pending': 'warn'
    };
    return severities[status] || 'info';
  }
} 