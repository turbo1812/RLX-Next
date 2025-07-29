import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, combineLatest } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Shared Types
import { InventoryItem, InventoryFilter, InventoryStatus, CreateInventoryRequest } from '../../../../../libs/shared-types/inventory';

// Services
import { InventoryService } from './services/inventory.service';
import { ErrorHandlerService } from '../core/services/error-handler.service';

// Shared Components
import { PageHeaderComponent } from '../shared/components/page-header.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    TagModule,
    TooltipModule,
    PageHeaderComponent
  ],
  providers: [MessageService],
  template: `
    <app-page-header title="Inventory Management" subtitle="Track and manage inventory across all warehouses">
      <button 
        pButton 
        label="Add Item" 
        icon="pi pi-plus" 
        [disabled]="loading$ | async"
        (click)="showDialog.set(true)">
      </button>
      <button 
        pButton 
        label="Export" 
        icon="pi pi-download" 
        [outlined]="true"
        [disabled]="loading$ | async"
        (click)="exportInventory()">
      </button>
    </app-page-header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="stats-card" *ngFor="let stat of stats$ | async">
        <div class="stat-icon" [ngClass]="stat.colorClass">
          <i [class]="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <p-card header="Filters" styleClass="mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          pInputText 
          placeholder="Search items..." 
          [(ngModel)]="searchTerm"
          (input)="updateFilters()">
        
        <p-dropdown 
          [options]="categoryOptions" 
          [(ngModel)]="selectedCategory"
          placeholder="All Categories"
          (onChange)="updateFilters()">
        </p-dropdown>
        
        <p-dropdown 
          [options]="locationOptions" 
          [(ngModel)]="selectedLocation"
          placeholder="All Locations"
          (onChange)="updateFilters()">
        </p-dropdown>
        
        <p-dropdown 
          [options]="statusOptions" 
          [(ngModel)]="selectedStatus"
          placeholder="All Statuses"
          (onChange)="updateFilters()">
        </p-dropdown>
      </div>
    </p-card>

    <!-- Inventory Table -->
    <p-table 
              [value]="(filteredItems$ | async) || []" 
              [loading]="loading$ | async"
      [paginator]="true" 
      [rows]="50"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
      responsiveLayout="scroll">
      
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
          <th pSortableColumn="sku">SKU <p-sortIcon field="sku"></p-sortIcon></th>
          <th pSortableColumn="quantity">Quantity <p-sortIcon field="quantity"></p-sortIcon></th>
          <th pSortableColumn="location">Location <p-sortIcon field="location"></p-sortIcon></th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.sku }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.location }}</td>
          <td>
            <p-tag 
              [value]="getStatusLabel(item.status)" 
              [severity]="getStatusSeverity(item.status)">
            </p-tag>
          </td>
          <td>
            <button 
              pButton 
              icon="pi pi-eye" 
              class="p-button-text p-button-sm"
              pTooltip="View Details"
              (click)="viewItem(item)">
            </button>
            <button 
              pButton 
              icon="pi pi-pencil" 
              class="p-button-text p-button-sm"
              pTooltip="Edit Item"
              (click)="editItem(item)">
            </button>
            <button 
              pButton 
              icon="pi pi-trash" 
              class="p-button-text p-button-sm p-button-danger"
              pTooltip="Delete Item"
              (click)="deleteItem(item)">
            </button>
          </td>
        </tr>
      </ng-template>
      
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="6" class="text-center py-8">
            <div class="empty-state">
              <i class="pi pi-box text-4xl text-gray-400 mb-4"></i>
              <h3>No inventory items found</h3>
              <p class="text-gray-600">Add your first inventory item to get started</p>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <!-- Add/Edit Dialog -->
    <p-dialog 
      [header]="isEditing() ? 'Edit Item' : 'Add New Item'"
      [(visible)]="showDialog"
      [modal]="true"
      [style]="{width: '600px'}"
      [draggable]="false"
      [resizable]="false">
      
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label for="itemName">Name *</label>
          <input 
            id="itemName"
            pInputText 
            [(ngModel)]="formData.name"
            placeholder="Enter item name"
            class="w-full">
        </div>
        
        <div>
          <label for="itemSku">SKU *</label>
          <input 
            id="itemSku"
            pInputText 
            [(ngModel)]="formData.SKU"
            placeholder="Enter SKU"
            class="w-full">
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="quantity">Quantity *</label>
            <input 
              id="quantity"
              pInputText 
              type="number"
              [(ngModel)]="formData.quantity"
              placeholder="0"
              class="w-full">
          </div>
          
          <div>
            <label for="cost">Cost *</label>
            <input 
              id="cost"
              pInputText 
              type="number"
              [(ngModel)]="formData.unitPrice"
              placeholder="0.00"
              class="w-full">
          </div>
        </div>
      </div>
      
      <ng-template pTemplate="footer">
        <button 
          pButton 
          label="Cancel" 
          icon="pi pi-times" 
          [outlined]="true"
          (click)="cancelDialog()">
        </button>
        <button 
          pButton 
          [label]="isEditing() ? 'Update' : 'Create'"
          icon="pi pi-check"
          [loading]="saving()"
          (click)="saveItem()">
        </button>
      </ng-template>
    </p-dialog>
  `,
  styleUrls: ['./inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryComponent implements OnInit, OnDestroy {
  private readonly inventoryService = inject(InventoryService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly messageService = inject(MessageService);

  // Reactive State
  readonly loading$ = this.inventoryService.loading$;
  readonly items$ = this.inventoryService.items$;
  readonly error$ = this.inventoryService.error$;

  // UI State Signals
  showDialog = signal(false);
  isEditing = signal(false);
  saving = signal(false);
  selectedItem = signal<InventoryItem | null>(null);

  // Filter State
  searchTerm = '';
  selectedCategory = '';
  selectedLocation = '';
  selectedStatus = '';

  // Form Data
  formData: Partial<CreateInventoryRequest> = {};

  // Computed Properties using Observables
  readonly filteredItems$ = this.items$.pipe(
    map(items => {
      if (!items) return [];

      return items.filter(item => {
        const matchesSearch = !this.searchTerm || 
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
        
        const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;
        const matchesLocation = !this.selectedLocation || item.location === this.selectedLocation;
        const matchesStatus = !this.selectedStatus || item.status === this.selectedStatus;

        return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
      });
    })
  );

  readonly stats$ = this.items$.pipe(
    map(items => {
      if (!items) return [];

      const total = items.length;
      const lowStock = items.filter(item => item.status === InventoryStatus.LOW_STOCK).length;
      const outOfStock = items.filter(item => item.status === InventoryStatus.OUT_OF_STOCK).length;
      const inStock = items.filter(item => item.status === InventoryStatus.IN_STOCK).length;

      return [
        { label: 'Total Items', value: total, icon: 'pi pi-box', colorClass: 'stat-blue' },
        { label: 'In Stock', value: inStock, icon: 'pi pi-check-circle', colorClass: 'stat-green' },
        { label: 'Low Stock', value: lowStock, icon: 'pi pi-exclamation-triangle', colorClass: 'stat-orange' },
        { label: 'Out of Stock', value: outOfStock, icon: 'pi pi-times-circle', colorClass: 'stat-red' }
      ];
    })
  );

  // Dropdown Options
  categoryOptions = [
    { label: 'All Categories', value: '' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Food', value: 'food' }
  ];

  locationOptions = [
    { label: 'All Locations', value: '' },
    { label: 'Warehouse A', value: 'warehouse-a' },
    { label: 'Warehouse B', value: 'warehouse-b' }
  ];

  statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'In Stock', value: InventoryStatus.IN_STOCK },
    { label: 'Low Stock', value: InventoryStatus.LOW_STOCK },
    { label: 'Out of Stock', value: InventoryStatus.OUT_OF_STOCK }
  ];

  ngOnInit(): void {
    this.loadInventory();
  }

  ngOnDestroy(): void {
    // Cleanup handled by service
  }

  async loadInventory(): Promise<void> {
    try {
      await this.inventoryService.loadItems();
    } catch (error) {
      this.errorHandler.handleError(error, 'InventoryComponent.loadInventory');
    }
  }

  updateFilters(): void {
    // Filters are reactive through computed properties
  }

  showAddDialog(): void {
    this.isEditing.set(false);
    this.formData = {};
    this.showDialog.set(true);
  }

  viewItem(item: InventoryItem): void {
    this.selectedItem.set(item);
    // Show view dialog or navigate to detail page
  }

  editItem(item: InventoryItem): void {
    this.isEditing.set(true);
    this.selectedItem.set(item);
    this.formData = { ...item };
    this.showDialog.set(true);
  }

  async deleteItem(item: InventoryItem): Promise<void> {
    try {
      await this.inventoryService.deleteItem(item.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item deleted successfully'
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'InventoryComponent.deleteItem');
    }
  }

  async saveItem(): Promise<void> {
    this.saving.set(true);
    try {
      const data = this.formData;
      if (this.isEditing()) {
        await this.inventoryService.updateItem(this.selectedItem()!.id, data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item updated successfully'
        });
      } else {
        await this.inventoryService.createItem(data as CreateInventoryRequest);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item created successfully'
        });
      }
      this.cancelDialog();
    } catch (error) {
      this.errorHandler.handleError(error, 'InventoryComponent.saveItem');
    } finally {
      this.saving.set(false);
    }
  }

  cancelDialog(): void {
    this.showDialog.set(false);
    this.formData = {};
    this.selectedItem.set(null);
  }

  exportInventory(): void {
    // Implement export functionality
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export functionality not yet implemented'
    });
  }

  getStatusLabel(status: InventoryStatus): string {
    const labels = {
      [InventoryStatus.IN_STOCK]: 'In Stock',
      [InventoryStatus.LOW_STOCK]: 'Low Stock',
      [InventoryStatus.OUT_OF_STOCK]: 'Out of Stock'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: InventoryStatus): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    const severities = {
      [InventoryStatus.IN_STOCK]: 'success' as const,
      [InventoryStatus.LOW_STOCK]: 'warn' as const,
      [InventoryStatus.OUT_OF_STOCK]: 'danger' as const
    };
    return severities[status] || 'info';
  }
} 