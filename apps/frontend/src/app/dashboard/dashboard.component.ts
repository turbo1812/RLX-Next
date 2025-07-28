import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    RouterModule, 
    DialogModule, 
    InputTextModule, 
    InputNumberModule, 
    DropdownModule, 
    FormsModule, 
    DatePickerModule,
    TooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Time and refresh
  currentTime = new Date();
  isRefreshing = false;

  // Metrics data
  metrics = [
    { 
      icon: 'pi pi-box', 
      value: '1,247', 
      label: 'Total Inventory Items', 
      type: 'inventory',
      link: '/inventory',
      trend: 'up',
      change: '+12%'
    },
    { 
      icon: 'pi pi-shopping-cart', 
      value: '89', 
      label: 'Active Orders', 
      type: 'orders',
      link: '/orders',
      trend: 'up',
      change: '+8%'
    },
    { 
      icon: 'pi pi-truck', 
      value: '12', 
      label: 'Fleet Vehicles', 
      type: 'fleet',
      link: '/fleet',
      trend: 'down',
      change: '-2%'
    },
    { 
      icon: 'pi pi-building', 
      value: '85%', 
      label: 'Warehouse Utilization', 
      type: 'warehouse',
      link: '/warehouse',
      trend: 'up',
      change: '+5%'
    }
  ];

  // Activities data
  activities = [
    { 
      icon: 'pi pi-plus', 
      title: 'New inventory item added', 
      description: 'Laptop Computer (SKU: LAP-001)', 
      time: '2 minutes ago', 
      type: 'success' 
    },
    { 
      icon: 'pi pi-check', 
      title: 'Order shipped successfully', 
      description: 'Order #ORD-001 delivered to John Doe', 
      time: '15 minutes ago', 
      type: 'success' 
    },
    { 
      icon: 'pi pi-exclamation-triangle', 
      title: 'Low stock alert', 
      description: 'Office Chair (SKU: CHAIR-001) - 5 items remaining', 
      time: '1 hour ago', 
      type: 'warning',
      priority: 'high'
    },
    { 
      icon: 'pi pi-wrench', 
      title: 'Vehicle maintenance scheduled', 
      description: 'Truck TRK-001 maintenance due in 3 days', 
      time: '2 hours ago', 
      type: 'info' 
    }
  ];

  // Quick actions
  quickActions: Array<{
    label: string;
    icon: string;
    severity: 'primary' | 'success' | 'warn' | 'info' | 'danger' | 'secondary';
    loading?: boolean;
  }> = [
    { label: 'Add Inventory Item', icon: 'pi pi-plus', severity: 'primary' },
    { label: 'Create New Order', icon: 'pi pi-shopping-cart', severity: 'success' },
    { label: 'Schedule Maintenance', icon: 'pi pi-wrench', severity: 'warn' },
    { label: 'Generate Report', icon: 'pi pi-file-pdf', severity: 'info' }
  ];

  // Alerts data
  alerts = [
    {
      id: '1',
      icon: 'pi pi-exclamation-triangle',
      title: 'Low Stock Alert',
      message: 'Office Chair (SKU: CHAIR-001) has only 5 items remaining',
      time: '1 hour ago',
      severity: 'warning'
    },
    {
      id: '2',
      icon: 'pi pi-info-circle',
      title: 'System Update',
      message: 'Scheduled maintenance will occur tonight at 2:00 AM',
      time: '3 hours ago',
      severity: 'info'
    }
  ];

  // Time ranges for charts
  timeRanges = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Last Year', value: '1y' }
  ];
  selectedTimeRange = this.timeRanges[0];

  // Priority options
  priorityOptions = [
    { label: 'Normal', value: 'Normal' },
    { label: 'High', value: 'High' },
    { label: 'Urgent', value: 'Urgent' }
  ];

  // Dialog states
  showAddInventoryDialog = false;
  showAddOrderDialog = false;
  showScheduleMaintenanceDialog = false;
  showGenerateReportDialog = false;

  // Loading states
  addInventoryLoading = false;
  createOrderLoading = false;
  scheduleMaintenanceLoading = false;
  generateReportLoading = false;

  // Error and success states
  addInventoryError: string | null = null;
  addInventorySuccess = false;
  createOrderError: string | null = null;
  createOrderSuccess = false;
  scheduleMaintenanceError: string | null = null;
  scheduleMaintenanceSuccess = false;
  generateReportError: string | null = null;
  generateReportSuccess = false;

  // Form data
  newInventoryItem = {
    name: '',
    SKU: '',
    quantity: 0,
    location: '',
    category: '',
    minStockLevel: 0,
    maxStockLevel: 0,
    supplier: '',
    cost: 0
  };

  newOrder = {
    customerName: '',
    shippingAddress: '',
    priority: 'Normal',
    items: [{ SKU: '', quantity: 1, unitPrice: 0 }]
  };

  fleetVehicles: any[] = [];
  selectedVehicle: any = null;
  maintenanceDate: Date | null = null;

  reportTypes = [
    { label: 'Inventory Report', value: 'inventory' },
    { label: 'Orders Report', value: 'orders' },
    { label: 'Fleet Report', value: 'fleet' },
    { label: 'Warehouse Report', value: 'warehouse' }
  ];
  selectedReportType: string | null = null;
  reportDateRange: Date[] | null = null;

  constructor(private apiService: ApiService) {
    // Update time every minute
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngOnInit() {
    this.loadFleetVehicles();
  }

  // Dashboard refresh
  refreshDashboard() {
    this.isRefreshing = true;
    // Simulate refresh
    setTimeout(() => {
      this.isRefreshing = false;
      // Here you would typically reload data from the API
    }, 1000);
  }

  // Load fleet vehicles
  loadFleetVehicles() {
    this.apiService.getFleetVehicles().subscribe({
      next: (vehicles) => { 
        this.fleetVehicles = vehicles; 
      },
      error: () => { 
        this.fleetVehicles = []; 
      }
    });
  }

  // Quick action click handler
  onQuickActionClick(index: number) {
    const action = this.quickActions[index];
    action.loading = true;

    switch (action.label) {
      case 'Add Inventory Item':
        this.openAddInventoryDialog();
        break;
      case 'Create New Order':
        this.openAddOrderDialog();
        break;
      case 'Schedule Maintenance':
        this.openScheduleMaintenanceDialog();
        break;
      case 'Generate Report':
        this.openGenerateReportDialog();
        break;
    }

    // Reset loading state after a short delay
    setTimeout(() => {
      action.loading = false;
    }, 500);
  }

  // Time range change handler
  onTimeRangeChange() {
    // Here you would typically reload chart data based on the selected time range
    console.log('Time range changed to:', this.selectedTimeRange);
  }

  // Alert management
  dismissAlert(alertId: string) {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }

  markAllAlertsRead() {
    this.alerts = [];
  }

  // Dialog management methods
  openAddInventoryDialog() {
    this.showAddInventoryDialog = true;
    this.addInventoryError = null;
    this.addInventorySuccess = false;
    this.newInventoryItem = {
      name: '',
      SKU: '',
      quantity: 0,
      location: '',
      category: '',
      minStockLevel: 0,
      maxStockLevel: 0,
      supplier: '',
      cost: 0
    };
  }

  closeAddInventoryDialog() {
    this.showAddInventoryDialog = false;
    this.addInventoryError = null;
    this.addInventorySuccess = false;
  }

  submitAddInventoryItem() {
    this.addInventoryLoading = true;
    this.addInventoryError = null;
    this.addInventorySuccess = false;
    
    this.apiService.createInventoryItem(this.newInventoryItem).subscribe({
      next: () => {
        this.addInventoryLoading = false;
        this.addInventorySuccess = true;
        setTimeout(() => this.closeAddInventoryDialog(), 1200);
      },
      error: (err) => {
        this.addInventoryLoading = false;
        this.addInventoryError = err.message || 'Failed to add item';
      }
    });
  }

  openAddOrderDialog() {
    this.showAddOrderDialog = true;
    this.createOrderError = null;
    this.createOrderSuccess = false;
    this.newOrder = {
      customerName: '',
      shippingAddress: '',
      priority: 'Normal',
      items: [{ SKU: '', quantity: 1, unitPrice: 0 }]
    };
  }

  closeAddOrderDialog() {
    this.showAddOrderDialog = false;
    this.createOrderError = null;
    this.createOrderSuccess = false;
  }

  addOrderItem() {
    this.newOrder.items.push({ SKU: '', quantity: 1, unitPrice: 0 });
  }

  removeOrderItem(index: number) {
    if (this.newOrder.items.length > 1) {
      this.newOrder.items.splice(index, 1);
    }
  }

  submitCreateOrder() {
    this.createOrderLoading = true;
    this.createOrderError = null;
    this.createOrderSuccess = false;
    
    const totalAmount = this.newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const orderPayload = {
      customerName: this.newOrder.customerName,
      shippingAddress: this.newOrder.shippingAddress,
      priority: this.newOrder.priority,
      items: this.newOrder.items.map(item => ({ 
        SKU: item.SKU, 
        quantity: item.quantity, 
        unitPrice: item.unitPrice 
      })),
      totalAmount
    };
    
    this.apiService.createOrder(orderPayload).subscribe({
      next: () => {
        this.createOrderLoading = false;
        this.createOrderSuccess = true;
        setTimeout(() => this.closeAddOrderDialog(), 1200);
      },
      error: (err) => {
        this.createOrderLoading = false;
        this.createOrderError = err.message || 'Failed to create order';
      }
    });
  }

  openScheduleMaintenanceDialog() {
    this.showScheduleMaintenanceDialog = true;
    this.scheduleMaintenanceError = null;
    this.scheduleMaintenanceSuccess = false;
    this.selectedVehicle = null;
    this.maintenanceDate = null;
  }

  closeScheduleMaintenanceDialog() {
    this.showScheduleMaintenanceDialog = false;
    this.scheduleMaintenanceError = null;
    this.scheduleMaintenanceSuccess = false;
  }

  submitScheduleMaintenance() {
    if (!this.selectedVehicle || !this.maintenanceDate) return;
    
    this.scheduleMaintenanceLoading = true;
    this.scheduleMaintenanceError = null;
    this.scheduleMaintenanceSuccess = false;
    
    this.apiService.updateFleetVehicle(this.selectedVehicle.vehicleNumber, { 
      nextMaintenance: this.maintenanceDate 
    }).subscribe({
      next: () => {
        this.scheduleMaintenanceLoading = false;
        this.scheduleMaintenanceSuccess = true;
        setTimeout(() => this.closeScheduleMaintenanceDialog(), 1200);
      },
      error: (err) => {
        this.scheduleMaintenanceLoading = false;
        this.scheduleMaintenanceError = err.message || 'Failed to schedule maintenance';
      }
    });
  }

  openGenerateReportDialog() {
    this.showGenerateReportDialog = true;
    this.generateReportError = null;
    this.generateReportSuccess = false;
    this.selectedReportType = null;
    this.reportDateRange = null;
  }

  closeGenerateReportDialog() {
    this.showGenerateReportDialog = false;
    this.generateReportError = null;
    this.generateReportSuccess = false;
  }

  submitGenerateReport() {
    if (!this.selectedReportType || !this.reportDateRange || this.reportDateRange.length !== 2) return;
    
    this.generateReportLoading = true;
    this.generateReportError = null;
    this.generateReportSuccess = false;
    
    // Mock PDF generation (replace with real API call if available)
    setTimeout(() => {
      const [start, end] = this.reportDateRange ?? [null, null];
      const blob = new Blob([
        `Report Type: ${this.selectedReportType}\nDate Range: ${start ? start.toLocaleDateString() : ''} - ${end ? end.toLocaleDateString() : ''}\nGenerated: ${new Date().toLocaleString()}`
      ], { type: 'application/pdf' });
      saveAs(blob, `report-${this.selectedReportType}-${Date.now()}.pdf`);
      this.generateReportLoading = false;
      this.generateReportSuccess = true;
      setTimeout(() => this.closeGenerateReportDialog(), 1200);
    }, 1200);
  }
} 