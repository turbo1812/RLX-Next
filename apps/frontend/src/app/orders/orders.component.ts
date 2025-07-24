import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, TagModule, BreadcrumbModule],
  template: `
    <div class="p-4">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <p-breadcrumb [model]="breadcrumbItems" [home]="home"></p-breadcrumb>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Order Management</h1>
          <p class="text-gray-600 mt-2">Process and track customer orders</p>
        </div>
        <div class="flex space-x-3">
          <p-button label="New Order" 
                   icon="pi pi-plus" 
                   severity="primary"
                   (onClick)="createOrder()"></p-button>
          <p-button label="Export Orders" 
                   icon="pi pi-download" 
                   severity="secondary"
                   (onClick)="exportOrders()"></p-button>
        </div>
      </div>

      <!-- Orders Table -->
      <p-card>
        <p-table [value]="orders" 
                 [paginator]="true" 
                 [rows]="10" 
                 [showCurrentPageReport]="true" 
                 responsiveLayout="scroll"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                 [rowsPerPageOptions]="[10,25,50]"
                 [globalFilterFields]="['orderNumber','customerName','status']">
          
          <ng-template pTemplate="header">
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-order>
            <tr>
              <td>
                <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{{order.orderNumber}}</span>
              </td>
              <td>
                <div>
                  <div class="font-semibold">{{order.customerName}}</div>
                  <div class="text-sm text-gray-500">{{order.customerEmail}}</div>
                </div>
              </td>
              <td>
                <p-tag [value]="order.status" 
                       [severity]="getStatusSeverity(order.status)">
                </p-tag>
              </td>
              <td>{{order.orderDate | date:'short'}}</td>
              <td>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {{order.itemCount}} items
                </span>
              </td>
              <td class="font-semibold">{{order.totalAmount | currency}}</td>
              <td>
                <div class="flex space-x-2">
                  <p-button icon="pi pi-eye" 
                           severity="info" 
                           size="small"
                           (onClick)="viewOrder(order)"></p-button>
                  <p-button icon="pi pi-pencil" 
                           severity="secondary" 
                           size="small"
                           (onClick)="editOrder(order)"></p-button>
                  <p-button icon="pi pi-check" 
                           severity="success" 
                           size="small"
                           (onClick)="processOrder(order)"
                           [disabled]="order.status === 'Delivered'"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    
    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }
  `]
})
export class OrdersComponent {
  orders: any[] = [
    {
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      status: 'Processing',
      orderDate: new Date('2024-01-15'),
      itemCount: 3,
      totalAmount: 1299.98
    },
    {
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      status: 'Shipped',
      orderDate: new Date('2024-01-14'),
      itemCount: 1,
      totalAmount: 299.99
    },
    {
      orderNumber: 'ORD-003',
      customerName: 'Bob Johnson',
      customerEmail: 'bob.johnson@email.com',
      status: 'Delivered',
      orderDate: new Date('2024-01-13'),
      itemCount: 2,
      totalAmount: 899.98
    },
    {
      orderNumber: 'ORD-004',
      customerName: 'Alice Brown',
      customerEmail: 'alice.brown@email.com',
      status: 'Pending',
      orderDate: new Date('2024-01-16'),
      itemCount: 4,
      totalAmount: 1599.96
    }
  ];

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Order Management' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Pending': return 'warn';
      case 'Processing': return 'info';
      case 'Shipped': return 'success';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'info';
    }
  }

  createOrder() {
    console.log('Create order clicked');
    // TODO: Implement create order functionality
  }

  exportOrders() {
    console.log('Export orders clicked');
    // TODO: Implement export functionality
  }

  viewOrder(order: any) {
    console.log('View order:', order);
    // TODO: Implement view order functionality
  }

  editOrder(order: any) {
    console.log('Edit order:', order);
    // TODO: Implement edit order functionality
  }

  processOrder(order: any) {
    console.log('Process order:', order);
    // TODO: Implement process order functionality
  }
} 