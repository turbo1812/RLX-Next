import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

// Services
import { ApiService } from '../services/api.service';

// Interfaces
interface OrderItem {
  SKU: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderNumber: string;
  customerName: string;
  orderDate: Date;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  priority: string;
}

interface NewOrder {
  orderNumber: string;
  customerName: string;
  orderDate: Date;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  priority: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class OrdersComponent implements OnInit, OnDestroy {
  // Data Properties
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  
  // Loading States
  loading = false;
  editOrderLoading = false;
  createOrderLoading = false;
  
  // Dialog States
  showViewDialog = false;
  showEditDialog = false;
  showCreateDialog = false;
  
  // Form Data
  selectedOrder: Order | null = null;
  editOrderData: Order | null = null;
  createOrderData: NewOrder | null = null;
  
  // Search and Filter
  searchTerm = '';
  selectedStatusFilter: string | null = null;
  selectedPriorityFilter: string | null = null;
  
  // Error Messages
  editOrderError: string | undefined = undefined;
  createOrderError: string | undefined = undefined;
  
  // Dropdown Options
  statusOptions: DropdownOption[] = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  
  priorityOptions: DropdownOption[] = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Urgent', value: 'Urgent' }
  ];
  
  statusFilterOptions = [
    { label: 'All Statuses', value: null },
    ...this.statusOptions
  ];
  
  priorityFilterOptions = [
    { label: 'All Priorities', value: null },
    ...this.priorityOptions
  ];
  
  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.subscribeToApiStates();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while loading data'
          });
        }
      })
    );
  }

  private loadOrders(): void {
    this.subscriptions.add(
      this.apiService.getOrders().subscribe({
        next: (orders) => {
          this.orders = orders;
          this.filteredOrders = [...orders];
        },
        error: (error) => {
          console.error('Failed to load orders:', error);
          this.loadMockData();
        }
      })
    );
  }

  private loadMockData(): void {
    this.orders = [
      {
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        orderDate: new Date('2024-01-15'),
        status: 'Pending',
        items: [
          { SKU: 'LAP-001', quantity: 1, unitPrice: 899.99 },
          { SKU: 'MOU-002', quantity: 2, unitPrice: 29.99 }
        ],
        totalAmount: 959.97,
        shippingAddress: '123 Main St, City, State 12345',
        priority: 'High'
      },
      {
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        orderDate: new Date('2024-01-14'),
        status: 'Processing',
        items: [
          { SKU: 'CHA-003', quantity: 1, unitPrice: 199.99 }
        ],
        totalAmount: 199.99,
        shippingAddress: '456 Oak Ave, City, State 12345',
        priority: 'Medium'
      },
      {
        orderNumber: 'ORD-003',
        customerName: 'Bob Johnson',
        orderDate: new Date('2024-01-13'),
        status: 'Shipped',
        items: [
          { SKU: 'MOU-002', quantity: 5, unitPrice: 29.99 }
        ],
        totalAmount: 149.95,
        shippingAddress: '789 Pine Rd, City, State 12345',
        priority: 'Low'
      },
      {
        orderNumber: 'ORD-004',
        customerName: 'Alice Brown',
        orderDate: new Date('2024-01-12'),
        status: 'Delivered',
        items: [
          { SKU: 'LAP-001', quantity: 1, unitPrice: 899.99 },
          { SKU: 'CHA-003', quantity: 1, unitPrice: 199.99 }
        ],
        totalAmount: 1099.98,
        shippingAddress: '321 Elm St, City, State 12345',
        priority: 'High'
      }
    ];
    this.filteredOrders = [...this.orders];
  }

  private getEmptyNewOrder(): NewOrder {
    return {
      orderNumber: 'ORD-' + Math.floor(Math.random() * 1000000),
      customerName: '',
      orderDate: new Date(),
      status: 'Pending',
      items: [],
      totalAmount: 0,
      shippingAddress: '',
      priority: 'Medium'
    };
  }

  private resetForm(): void {
    this.editOrderError = undefined;
    this.createOrderError = undefined;
  }

  // ============================================================================
  // PUBLIC METHODS - STATS AND UTILITIES
  // ============================================================================

  getPendingCount(): number {
    return this.orders.filter(order => order.status === 'Pending').length;
  }

  getProcessingCount(): number {
    return this.orders.filter(order => order.status === 'Processing').length;
  }

  getTotalRevenue(): number {
    return this.orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status.toLowerCase()) {
      case 'pending': return 'warn';
      case 'processing': return 'info';
      case 'shipped': return 'success';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'danger';
      case 'high': return 'danger';
      case 'medium': return 'warn';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  // ============================================================================
  // PUBLIC METHODS - SEARCH AND FILTER
  // ============================================================================

  filterOrders(): void {
    let filtered = [...this.orders];
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.shippingAddress.toLowerCase().includes(search) ||
        order.status.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (this.selectedStatusFilter) {
      filtered = filtered.filter(order => order.status === this.selectedStatusFilter);
    }
    
    // Apply priority filter
    if (this.selectedPriorityFilter) {
      filtered = filtered.filter(order => order.priority === this.selectedPriorityFilter);
    }
    
    this.filteredOrders = filtered;
  }

  // ============================================================================
  // PUBLIC METHODS - DIALOG ACTIONS
  // ============================================================================

  createOrder(): void {
    this.createOrderData = this.getEmptyNewOrder();
    this.showCreateDialog = true;
    this.resetForm();
  }

  closeCreateDialog(): void {
    this.showCreateDialog = false;
    this.createOrderData = null;
    this.resetForm();
  }

  addOrderItem(): void {
    if (!this.createOrderData?.items) return;
    this.createOrderData.items.push({ SKU: '', quantity: 1, unitPrice: 0 });
    this.updateCreateOrderTotal();
  }

  removeOrderItem(index: number): void {
    if (!this.createOrderData?.items) return;
    this.createOrderData.items.splice(index, 1);
    this.updateCreateOrderTotal();
  }

  updateCreateOrderTotal(): void {
    if (!this.createOrderData?.items) return;
    this.createOrderData.totalAmount = this.createOrderData.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice), 0
    );
  }

  submitCreateOrder(): void {
    if (!this.createOrderData || !this.isValidNewOrder()) return;

    this.createOrderLoading = true;
    this.createOrderError = undefined;

    const payload = {
      customerName: this.createOrderData.customerName,
      items: this.createOrderData.items,
      shippingAddress: this.createOrderData.shippingAddress,
      priority: this.createOrderData.priority,
      status: this.createOrderData.status,
      orderDate: this.createOrderData.orderDate,
      totalAmount: this.createOrderData.totalAmount
    };

    this.subscriptions.add(
      this.apiService.createOrder(payload).subscribe({
        next: (order) => {
          this.orders = [...this.orders, order];
          this.filterOrders();
          this.createOrderLoading = false;
          this.closeCreateDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order created successfully'
          });
        },
        error: (error) => {
          this.createOrderLoading = false;
          this.createOrderError = error.message || 'Failed to create order';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.createOrderError
          });
        }
      })
    );
  }

  viewOrder(order: Order): void {
    this.selectedOrder = order;
    this.showViewDialog = true;
  }

  editOrder(order: Order): void {
    this.editOrderData = { ...order };
    this.showEditDialog = true;
    this.resetForm();
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.editOrderData = null;
    this.resetForm();
  }

  submitEditOrder(): void {
    if (!this.editOrderData || !this.isValidEditOrder()) return;

    this.editOrderLoading = true;
    this.editOrderError = undefined;

    this.subscriptions.add(
      this.apiService.updateOrder(this.editOrderData.orderNumber, this.editOrderData).subscribe({
        next: (updatedOrder) => {
          this.orders = this.orders.map(order => 
            order.orderNumber === updatedOrder.orderNumber ? updatedOrder : order
          );
          this.filterOrders();
          this.editOrderLoading = false;
          this.closeEditDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order updated successfully'
          });
        },
        error: (error) => {
          this.editOrderLoading = false;
          this.editOrderError = error.message || 'Failed to update order';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.editOrderError
          });
        }
      })
    );
  }

  processOrder(order: Order): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to process order ${order.orderNumber}?`,
      header: 'Confirm Processing',
      icon: 'pi pi-check',
      accept: () => {
        const updated = { ...order, status: 'Processing' };
        this.subscriptions.add(
          this.apiService.updateOrder(order.orderNumber, updated).subscribe({
            next: (result) => {
              this.orders = this.orders.map(o => 
                o.orderNumber === order.orderNumber ? result : o
              );
              this.filterOrders();
              this.messageService.add({
                severity: 'success',
                summary: 'Processed',
                detail: 'Order processed successfully'
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to process order'
              });
            }
          })
        );
      }
    });
  }

  // ============================================================================
  // PUBLIC METHODS - EXPORT
  // ============================================================================

  exportOrders(): void {
    // TODO: Implement export functionality
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export functionality will be implemented soon'
    });
  }

  // ============================================================================
  // PRIVATE VALIDATION METHODS
  // ============================================================================

  private isValidNewOrder(): boolean {
    return !!(this.createOrderData?.customerName && 
              this.createOrderData?.shippingAddress && 
              this.createOrderData?.status && 
              this.createOrderData?.priority &&
              this.createOrderData?.items?.length > 0);
  }

  private isValidEditOrder(): boolean {
    return !!(this.editOrderData?.customerName && 
              this.editOrderData?.shippingAddress && 
              this.editOrderData?.status && 
              this.editOrderData?.priority);
  }
}