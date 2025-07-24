import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, BreadcrumbModule],
  template: `
    <div class="p-4">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <p-breadcrumb [model]="breadcrumbItems" [home]="home"></p-breadcrumb>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p class="text-gray-600 mt-2">Manage warehouse inventory and stock levels</p>
        </div>
        <div class="flex space-x-3">
          <p-button label="Add Item" 
                   icon="pi pi-plus" 
                   severity="primary"
                   (onClick)="addInventoryItem()"></p-button>
          <p-button label="Export" 
                   icon="pi pi-download" 
                   severity="secondary"
                   (onClick)="exportInventory()"></p-button>
        </div>
      </div>

      <!-- Inventory Table -->
      <p-card>
        <p-table [value]="inventoryItems" 
                 [paginator]="true" 
                 [rows]="10" 
                 [showCurrentPageReport]="true" 
                 responsiveLayout="scroll"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                 [rowsPerPageOptions]="[10,25,50]"
                 [globalFilterFields]="['name','SKU','category','location']">
          
          <ng-template pTemplate="header">
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>
                <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{{item.SKU}}</span>
              </td>
              <td>{{item.name}}</td>
              <td>
                <span [class]="getQuantityClass(item.quantity)">
                  {{item.quantity}}
                </span>
              </td>
              <td>{{item.location}}</td>
              <td>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {{item.category}}
                </span>
              </td>
              <td>{{item.unitPrice | currency}}</td>
              <td>
                <span [class]="getStatusClass(item.quantity)">
                  {{getStatusText(item.quantity)}}
                </span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <p-button icon="pi pi-eye" 
                           severity="info" 
                           size="small"
                           (onClick)="viewItem(item)"></p-button>
                  <p-button icon="pi pi-pencil" 
                           severity="secondary" 
                           size="small"
                           (onClick)="editItem(item)"></p-button>
                  <p-button icon="pi pi-trash" 
                           severity="danger" 
                           size="small"
                           (onClick)="deleteItem(item)"></p-button>
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
export class InventoryComponent {
  inventoryItems: any[] = [
    {
      SKU: 'LAP-001',
      name: 'Laptop Computer',
      quantity: 50,
      location: 'A1-B2-C3',
      category: 'Electronics',
      unitPrice: 999.99
    },
    {
      SKU: 'CHAIR-001',
      name: 'Office Chair',
      quantity: 5,
      location: 'D4-E5-F6',
      category: 'Furniture',
      unitPrice: 299.99
    },
    {
      SKU: 'DESK-001',
      name: 'Standing Desk',
      quantity: 25,
      location: 'G7-H8-I9',
      category: 'Furniture',
      unitPrice: 599.99
    },
    {
      SKU: 'MON-001',
      name: '4K Monitor',
      quantity: 15,
      location: 'J10-K11-L12',
      category: 'Electronics',
      unitPrice: 399.99
    }
  ];

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Inventory Management' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  getQuantityClass(quantity: number): string {
    if (quantity <= 10) return 'text-red-600 font-semibold';
    if (quantity <= 25) return 'text-orange-600 font-semibold';
    return 'text-green-600 font-semibold';
  }

  getStatusClass(quantity: number): string {
    if (quantity <= 10) return 'bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full';
    if (quantity <= 25) return 'bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full';
    return 'bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full';
  }

  getStatusText(quantity: number): string {
    if (quantity <= 10) return 'Low Stock';
    if (quantity <= 25) return 'Medium Stock';
    return 'In Stock';
  }

  addInventoryItem() {
    console.log('Add inventory item clicked');
    // TODO: Implement add inventory item functionality
  }

  exportInventory() {
    console.log('Export inventory clicked');
    // TODO: Implement export functionality
  }

  viewItem(item: any) {
    console.log('View item:', item);
    // TODO: Implement view item functionality
  }

  editItem(item: any) {
    console.log('Edit item:', item);
    // TODO: Implement edit item functionality
  }

  deleteItem(item: any) {
    console.log('Delete item:', item);
    // TODO: Implement delete item functionality
  }
} 