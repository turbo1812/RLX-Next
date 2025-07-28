import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, ButtonModule, CalendarModule, DialogModule, TableModule, FormsModule],
  template: `
    <div class="analytics-container">
      <!-- Header Section -->
      <div class="analytics-header">
        <div class="analytics-header-content">
          <div class="analytics-title-section">
            <h1 class="analytics-title">Analytics Dashboard</h1>
            <p class="analytics-subtitle">Comprehensive insights into your warehouse operations and performance metrics</p>
          </div>
          <div class="analytics-header-actions">
            <p-button label="Share Dashboard" icon="pi pi-share-alt" class="p-button-outlined" (onClick)="shareDashboard()"></p-button>
          </div>
        </div>
      </div>

      <!-- Filter Bar Section -->
      <div class="analytics-filter-bar">
        <div class="analytics-filter-content">
          <div class="analytics-date-filter">
            <label class="filter-label">Date Range</label>
            <p-calendar [(ngModel)]="dateRange" selectionMode="range" dateFormat="mm/dd/yy" placeholder="Select Date Range" (onSelect)="onDateRangeChange()" showIcon appendTo="body"></p-calendar>
          </div>
          <div class="analytics-widget-toggles">
            <label class="filter-label">Widgets</label>
            <div class="toggle-buttons">
              <p-button label="Orders" [outlined]="!showOrdersChart" size="small" (onClick)="showOrdersChart = !showOrdersChart"></p-button>
              <p-button label="Inventory" [outlined]="!showInventoryChart" size="small" (onClick)="showInventoryChart = !showInventoryChart"></p-button>
              <p-button label="Fleet" [outlined]="!showFleetChart" size="small" (onClick)="showFleetChart = !showFleetChart"></p-button>
              <p-button label="Top Products" [outlined]="!showTopProducts" size="small" (onClick)="showTopProducts = !showTopProducts"></p-button>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Summary Section -->
      <div class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">Key Performance Indicators</h2>
          <p class="section-subtitle">Real-time metrics and period-over-period comparisons</p>
        </div>
        <div class="analytics-kpi-grid">
          <div class="analytics-kpi-card">
            <div class="kpi-icon orders-icon">
              <i class="pi pi-shopping-cart"></i>
            </div>
            <div class="kpi-content">
              <div class="analytics-kpi-label">Total Orders</div>
              <div class="analytics-kpi-value">{{ kpi.totalOrders.toLocaleString() }}</div>
              <div class="analytics-kpi-trend" [ngClass]="{'up': kpi.ordersChange > 0, 'down': kpi.ordersChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': kpi.ordersChange > 0, 'pi-arrow-down': kpi.ordersChange < 0}"></i>
                {{ kpi.ordersChange > 0 ? '+' : '' }}{{ kpi.ordersChange }}% vs last period
              </div>
            </div>
          </div>
          <div class="analytics-kpi-card">
            <div class="kpi-icon inventory-icon">
              <i class="pi pi-box"></i>
            </div>
            <div class="kpi-content">
              <div class="analytics-kpi-label">Inventory Items</div>
              <div class="analytics-kpi-value">{{ kpi.inventoryItems.toLocaleString() }}</div>
              <div class="analytics-kpi-trend" [ngClass]="{'up': kpi.inventoryChange > 0, 'down': kpi.inventoryChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': kpi.inventoryChange > 0, 'pi-arrow-down': kpi.inventoryChange < 0}"></i>
                {{ kpi.inventoryChange > 0 ? '+' : '' }}{{ kpi.inventoryChange }}% vs last period
              </div>
            </div>
          </div>
          <div class="analytics-kpi-card">
            <div class="kpi-icon fleet-icon">
              <i class="pi pi-truck"></i>
            </div>
            <div class="kpi-content">
              <div class="analytics-kpi-label">Active Fleet</div>
              <div class="analytics-kpi-value">{{ kpi.activeFleet }}</div>
              <div class="analytics-kpi-trend" [ngClass]="{'up': kpi.fleetChange > 0, 'down': kpi.fleetChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': kpi.fleetChange > 0, 'pi-arrow-down': kpi.fleetChange < 0}"></i>
                {{ kpi.fleetChange > 0 ? '+' : '' }}{{ kpi.fleetChange }}% vs last period
              </div>
            </div>
          </div>
          <div class="analytics-kpi-card">
            <div class="kpi-icon zones-icon">
              <i class="pi pi-map-marker"></i>
            </div>
            <div class="kpi-content">
              <div class="analytics-kpi-label">Warehouse Zones</div>
              <div class="analytics-kpi-value">{{ kpi.zones }}</div>
              <div class="analytics-kpi-trend" [ngClass]="{'up': kpi.zonesChange > 0, 'down': kpi.zonesChange < 0}">
                <i class="pi" [ngClass]="{'pi-arrow-up': kpi.zonesChange > 0, 'pi-arrow-down': kpi.zonesChange < 0}"></i>
                {{ kpi.zonesChange > 0 ? '+' : '' }}{{ kpi.zonesChange }}% vs last period
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">Performance Analytics</h2>
          <p class="section-subtitle">Visual insights and trend analysis</p>
        </div>
        <div class="analytics-charts-grid">
          <div class="analytics-chart-card" *ngIf="showOrdersChart">
            <p-card header="Orders by Month" styleClass="chart-card">
              <div class="chart-header">
                <div class="chart-title">Monthly Order Volume</div>
                <div class="chart-actions">
                  <p-button icon="pi pi-download" class="p-button-text p-button-sm" (onClick)="exportChart('orders')" pTooltip="Export Chart"></p-button>
                </div>
              </div>
              <p-chart type="bar" [data]="ordersBarData" [options]="barOptions" style="height: 300px;" (onDataSelect)="onChartDrill('orders', $event)"></p-chart>
            </p-card>
          </div>
          <div class="analytics-chart-card" *ngIf="showInventoryChart">
            <p-card header="Inventory Trends" styleClass="chart-card">
              <div class="chart-header">
                <div class="chart-title">Inventory Level Trends</div>
                <div class="chart-actions">
                  <p-button icon="pi pi-download" class="p-button-text p-button-sm" (onClick)="exportChart('inventory')" pTooltip="Export Chart"></p-button>
                </div>
              </div>
              <p-chart type="line" [data]="inventoryLineData" [options]="lineOptions" style="height: 300px;" (onDataSelect)="onChartDrill('inventory', $event)"></p-chart>
            </p-card>
          </div>
          <div class="analytics-chart-card" *ngIf="showFleetChart">
            <p-card header="Fleet Usage" styleClass="chart-card">
              <div class="chart-header">
                <div class="chart-title">Fleet Status Distribution</div>
                <div class="chart-actions">
                  <p-button icon="pi pi-download" class="p-button-text p-button-sm" (onClick)="exportChart('fleet')" pTooltip="Export Chart"></p-button>
                </div>
              </div>
              <p-chart type="pie" [data]="fleetPieData" [options]="pieOptions" style="height: 300px;" (onDataSelect)="onChartDrill('fleet', $event)"></p-chart>
            </p-card>
          </div>
          <div class="analytics-chart-card" *ngIf="showTopProducts">
            <p-card header="Top Products" styleClass="chart-card">
              <div class="chart-header">
                <div class="chart-title">Best Performing Products</div>
                <div class="chart-actions">
                  <p-button icon="pi pi-download" class="p-button-text p-button-sm" (onClick)="exportTopProducts()" pTooltip="Export Table"></p-button>
                </div>
              </div>
              <p-table [value]="topProducts" [paginator]="false" styleClass="analytics-top-table">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-prod>
                  <tr>
                    <td>{{ prod.name }}</td>
                    <td>{{ prod.sku }}</td>
                    <td>{{ prod.orders }}</td>
                    <td>{{ prod.revenue | currency }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </p-card>
          </div>
        </div>
      </div>

      <!-- Share Message -->
      <div class="analytics-share-message" *ngIf="shareMessage">
        <span>{{ shareMessage }}</span>
      </div>

      <!-- Drilldown Modal -->
      <p-dialog header="Detailed Breakdown" [(visible)]="showDrilldown" [modal]="true" [closable]="true" [dismissableMask]="true" [style]="{width: '450px'}">
        <div *ngIf="drilldownData" class="drilldown-content">
          <h3>{{ drilldownData.title }}</h3>
          <div class="drilldown-items">
            <div class="drilldown-item" *ngFor="let item of drilldownData.items">
              <span class="drilldown-label">{{ item.label }}</span>
              <span class="drilldown-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .analytics-container {
      width: 100vw;
      min-height: 100vh;
      background: #18181b;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Header Section */
    .analytics-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      padding: 2.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .analytics-header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .analytics-title-section {
      flex: 1;
    }

    .analytics-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .analytics-subtitle {
      color: #cbd5e1;
      font-size: 1.1rem;
      margin: 0;
      line-height: 1.5;
    }

    .analytics-header-actions {
      display: flex;
      align-items: center;
    }

    /* Filter Bar Section */
    .analytics-filter-bar {
      background: #1e293b;
      padding: 1.5rem 0;
      border-bottom: 1px solid #334155;
    }

    .analytics-filter-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .analytics-date-filter {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .analytics-widget-toggles {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label {
      color: #cbd5e1;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toggle-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Section Styling */
    .analytics-section {
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
    .analytics-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 0 2rem;
    }

    .analytics-kpi-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #475569;
      transition: all 0.3s ease;
    }

    .analytics-kpi-card:hover {
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

    .orders-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .inventory-icon { background: linear-gradient(135deg, #10b981, #059669); }
    .fleet-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .zones-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

    .kpi-content {
      flex: 1;
    }

    .analytics-kpi-label {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .analytics-kpi-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }

    .analytics-kpi-trend {
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .analytics-kpi-trend.up { color: #10b981; }
    .analytics-kpi-trend.down { color: #ef4444; }

    /* Charts Grid */
    .analytics-charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      padding: 0 2rem;
    }

    .analytics-chart-card {
      background: transparent;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .chart-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .chart-actions {
      display: flex;
      gap: 0.5rem;
    }

    /* Table Styling */
    .analytics-top-table {
      background: transparent !important;
      color: #f8fafc !important;
    }

    ::ng-deep .analytics-top-table .p-datatable-wrapper {
      background: transparent !important;
    }

    ::ng-deep .analytics-top-table .p-datatable-thead > tr > th {
      background: #334155 !important;
      color: #f8fafc !important;
      border-color: #475569 !important;
      font-weight: 600;
    }

    ::ng-deep .analytics-top-table .p-datatable-tbody > tr > td {
      background: transparent !important;
      color: #e2e8f0 !important;
      border-color: #475569 !important;
    }

    ::ng-deep .analytics-top-table .p-datatable-tbody > tr:hover > td {
      background: #334155 !important;
    }

    /* Card Styling */
    ::ng-deep .chart-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
      border-radius: 1rem !important;
      color: #f8fafc !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid #475569 !important;
    }

    ::ng-deep .chart-card .p-card-header {
      background: transparent !important;
      border-bottom: 1px solid #475569 !important;
      color: #f8fafc !important;
      font-weight: 600;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
    }

    ::ng-deep .chart-card .p-card-body {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }

    /* Share Message */
    .analytics-share-message {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: #10b981;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* Drilldown Modal */
    .drilldown-content h3 {
      color: #f8fafc;
      margin-bottom: 1rem;
    }

    .drilldown-items {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .drilldown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #334155;
      border-radius: 0.5rem;
    }

    .drilldown-label {
      color: #cbd5e1;
      font-weight: 500;
    }

    .drilldown-value {
      color: #f8fafc;
      font-weight: 600;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .analytics-charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .analytics-header-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .analytics-filter-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }

      .analytics-kpi-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .analytics-kpi-card {
        padding: 1rem;
      }

      .analytics-title {
        font-size: 2rem;
      }

      .section-title {
        font-size: 1.5rem;
      }
    }
  `],
})
export class AnalyticsComponent {
  // Date range filter
  dateRange: Date[] | null = null;

  // Widget toggles
  showOrdersChart = true;
  showInventoryChart = true;
  showFleetChart = true;
  showTopProducts = true;

  // KPI and comparison data (mock)
  kpi = {
    totalOrders: 1245,
    ordersChange: 12,
    inventoryItems: 3210,
    inventoryChange: -3,
    activeFleet: 18,
    fleetChange: 5,
    zones: 12,
    zonesChange: 0
  };

  // Chart data (mock)
  ordersBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Orders',
        backgroundColor: '#6366f1',
        data: [120, 150, 180, 200, 170, 210, 250, 230, 220, 190, 160, 140]
      }
    ]
  };
  barOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#a1a1aa' }, grid: { color: '#23232a' } },
      y: { ticks: { color: '#a1a1aa' }, grid: { color: '#23232a' } }
    }
  };
  inventoryLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Inventory',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        data: [3200, 3100, 3050, 3000, 2950, 2900, 2850, 2800, 2750, 2700, 2650, 2600],
        fill: true,
        tension: 0.4
      }
    ]
  };
  lineOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#a1a1aa' }, grid: { color: '#23232a' } },
      y: { ticks: { color: '#a1a1aa' }, grid: { color: '#23232a' } }
    }
  };
  fleetPieData = {
    labels: ['Active', 'Maintenance', 'Out of Service'],
    datasets: [
      {
        data: [18, 3, 2],
        backgroundColor: ['#22c55e', '#fbbf24', '#ef4444'],
        borderColor: '#23232a'
      }
    ]
  };
  pieOptions = {
    plugins: { legend: { labels: { color: '#fff' } } }
  };

  // Top 5 products (mock)
  topProducts = [
    { name: 'Laptop', sku: 'LAP-001', orders: 320, revenue: 28799 },
    { name: 'Office Chair', sku: 'CHA-003', orders: 210, revenue: 41997 },
    { name: 'Wireless Mouse', sku: 'MOU-002', orders: 180, revenue: 5398 },
    { name: 'Standing Desk', sku: 'DSK-004', orders: 120, revenue: 23999 },
    { name: 'Monitor', sku: 'MON-005', orders: 95, revenue: 18999 }
  ];

  // Drilldown modal
  showDrilldown = false;
  drilldownData: any = null;

  // Share message
  shareMessage: string | null = null;

  onDateRangeChange() {
    // In real app, filter data by dateRange
    // For demo, just update KPIs and charts randomly
    this.kpi.totalOrders = 1200 + Math.floor(Math.random() * 100);
    this.kpi.ordersChange = Math.floor(Math.random() * 20 - 10);
    this.kpi.inventoryItems = 3200 + Math.floor(Math.random() * 100);
    this.kpi.inventoryChange = Math.floor(Math.random() * 10 - 5);
    this.kpi.activeFleet = 15 + Math.floor(Math.random() * 5);
    this.kpi.fleetChange = Math.floor(Math.random() * 10 - 5);
    this.kpi.zones = 10 + Math.floor(Math.random() * 3);
    this.kpi.zonesChange = Math.floor(Math.random() * 5 - 2);
    // Also update chart data if needed
  }

  onChartDrill(type: string, event: any) {
    // Show mock drilldown data
    this.showDrilldown = true;
    if (type === 'orders') {
      this.drilldownData = {
        title: 'Orders Breakdown',
        items: [
          { label: 'Online', value: 800 },
          { label: 'In-Store', value: 400 },
          { label: 'Phone', value: 45 }
        ]
      };
    } else if (type === 'inventory') {
      this.drilldownData = {
        title: 'Inventory Breakdown',
        items: [
          { label: 'Electronics', value: 1200 },
          { label: 'Furniture', value: 900 },
          { label: 'Supplies', value: 1110 }
        ]
      };
    } else if (type === 'fleet') {
      this.drilldownData = {
        title: 'Fleet Breakdown',
        items: [
          { label: 'Trucks', value: 10 },
          { label: 'Vans', value: 8 },
          { label: 'Out of Service', value: 2 }
        ]
      };
    }
  }

  exportChart(type: string) {
    // In real app, export chart as image or CSV
    alert('Exported ' + type + ' chart!');
  }

  exportTopProducts() {
    // In real app, export table as CSV
    alert('Exported Top Products table!');
  }

  shareDashboard() {
    // In real app, copy dashboard snapshot or link
    this.shareMessage = 'Dashboard link copied to clipboard!';
    setTimeout(() => this.shareMessage = null, 3000);
  }
} 