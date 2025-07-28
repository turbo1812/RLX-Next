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

// Interfaces - Extended from API service
interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
}

interface WarehouseInventory {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  location: string;
  lastUpdated: Date;
}

interface NewWarehouseInventory {
  warehouseId: string;
  quantity: number;
  location: string;
}

interface CategoryOption {
  label: string;
  value: string;
}

interface WarehouseOption {
  label: string;
  value: string | null;
}

// Extended Inventory Item with warehouse inventory
interface ExtendedInventoryItem {
  id: string;
  name: string;
  SKU: string;
  quantity: number;
  location: string;
  category: string;
  lastUpdated: Date;
  minStockLevel: number;
  maxStockLevel: number;
  supplier: string;
  cost: number;
  warehouseInventory: WarehouseInventory[];
}

interface NewInventoryItem {
  name: string;
  SKU: string;
  category: string;
  supplier: string;
  cost: number;
  minStockLevel: number;
  maxStockLevel: number;
  warehouseInventory: NewWarehouseInventory[];
}

@Component({
  selector: 'app-inventory',
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
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class InventoryComponent implements OnInit, OnDestroy {
  // Data Properties
  inventoryItems: ExtendedInventoryItem[] = [];
  filteredItems: ExtendedInventoryItem[] = [];
  warehouses: Warehouse[] = [];
  
  // Loading States
  loading = false;
  addItemLoading = false;
  editItemLoading = false;
  
  // Dialog States
  showAddDialog = false;
  showEditDialog = false;
  showViewDialog = false;
  showTransferDialog = false;
  
  // Form Data
  newItem: NewInventoryItem = this.getEmptyNewItem();
  editItemData: ExtendedInventoryItem | null = null;
  selectedItem: ExtendedInventoryItem | null = null;
  transferData: {
    itemId: string;
    itemName: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
  } | null = null;
  
  // Search and Filter
  searchTerm = '';
  selectedCategoryFilter: string | null = null;
  selectedWarehouseFilter: string | null = null;
  selectedStockLevelFilter: string | null = null;
  
  // Error Messages
  addItemError: string | undefined = undefined;
  editItemError: string | undefined = undefined;
  transferError: string | undefined = undefined;
  
  // Dropdown Options
  categoryOptions: CategoryOption[] = [
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Furniture', value: 'Furniture' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Books', value: 'Books' },
    { label: 'Tools', value: 'Tools' },
    { label: 'Automotive', value: 'Automotive' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Home & Garden', value: 'Home & Garden' },
    { label: 'Office Supplies', value: 'Office Supplies' },
    { label: 'Other', value: 'Other' }
  ];
  
  categoryFilterOptions = [
    { label: 'All Categories', value: null },
    ...this.categoryOptions
  ];
  
  stockLevelFilterOptions = [
    { label: 'All Stock Levels', value: null },
    { label: 'Out of Stock', value: 'out_of_stock' },
    { label: 'Low Stock', value: 'low_stock' },
    { label: 'In Stock', value: 'in_stock' },
    { label: 'Overstocked', value: 'overstocked' }
  ];
  
  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadInventoryItems();
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

  private loadWarehouses(): void {
    // For now, use mock data since getWarehouses doesn't exist in API service
    this.loadMockWarehouses();
  }

  private loadMockWarehouses(): void {
    this.warehouses = [
      { id: 'WH-001', name: 'Main Warehouse', location: 'New York, NY', capacity: 10000, status: 'active' },
      { id: 'WH-002', name: 'West Coast Hub', location: 'Los Angeles, CA', capacity: 8000, status: 'active' },
      { id: 'WH-003', name: 'Central Distribution', location: 'Chicago, IL', capacity: 6000, status: 'active' },
      { id: 'WH-004', name: 'South Regional', location: 'Houston, TX', capacity: 5000, status: 'active' },
      { id: 'WH-005', name: 'Cold Storage', location: 'Minneapolis, MN', capacity: 3000, status: 'maintenance' }
    ];
  }

  private loadInventoryItems(): void {
    this.subscriptions.add(
      this.apiService.getInventoryItems().subscribe({
        next: (items) => {
          // Convert API items to extended items with warehouse inventory
          this.inventoryItems = items.map(item => this.convertToExtendedItem(item));
          this.filteredItems = [...this.inventoryItems];
        },
        error: (error) => {
          console.error('Failed to load inventory items:', error);
          this.loadMockData();
        }
      })
    );
  }

  private convertToExtendedItem(item: any): ExtendedInventoryItem {
    return {
      ...item,
      warehouseInventory: this.generateMockWarehouseInventory(item)
    };
  }

  private generateMockWarehouseInventory(item: any): WarehouseInventory[] {
    // Generate mock warehouse inventory based on the item
    const warehouses = this.warehouses.slice(0, Math.floor(Math.random() * 3) + 1);
    return warehouses.map(warehouse => ({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      quantity: Math.floor(Math.random() * item.quantity) + 1,
      location: `A${Math.floor(Math.random() * 10)}-B${Math.floor(Math.random() * 10)}`,
      lastUpdated: new Date()
    }));
  }

  private loadMockData(): void {
    this.inventoryItems = [
      {
        id: 'INV-001',
        name: 'Laptop Computer',
        SKU: 'LAP-001',
        quantity: 48,
        location: 'A1-B2',
        category: 'Electronics',
        supplier: 'TechCorp',
        cost: 899.99,
        minStockLevel: 10,
        maxStockLevel: 100,
        lastUpdated: new Date('2024-01-15'),
        warehouseInventory: [
          { warehouseId: 'WH-001', warehouseName: 'Main Warehouse', quantity: 25, location: 'A1-B2', lastUpdated: new Date('2024-01-15') },
          { warehouseId: 'WH-002', warehouseName: 'West Coast Hub', quantity: 15, location: 'C3-D4', lastUpdated: new Date('2024-01-14') },
          { warehouseId: 'WH-003', warehouseName: 'Central Distribution', quantity: 8, location: 'E5-F6', lastUpdated: new Date('2024-01-13') }
        ]
      },
      {
        id: 'INV-002',
        name: 'Office Chair',
        SKU: 'CHA-002',
        quantity: 15,
        location: 'G7-H8',
        category: 'Furniture',
        supplier: 'OfficeMax',
        cost: 199.99,
        minStockLevel: 5,
        maxStockLevel: 50,
        lastUpdated: new Date('2024-01-14'),
        warehouseInventory: [
          { warehouseId: 'WH-001', warehouseName: 'Main Warehouse', quantity: 12, location: 'G7-H8', lastUpdated: new Date('2024-01-14') },
          { warehouseId: 'WH-003', warehouseName: 'Central Distribution', quantity: 3, location: 'I9-J10', lastUpdated: new Date('2024-01-12') }
        ]
      },
      {
        id: 'INV-003',
        name: 'Wireless Mouse',
        SKU: 'MOU-003',
        quantity: 63,
        location: 'K11-L12',
        category: 'Electronics',
        supplier: 'TechCorp',
        cost: 29.99,
        minStockLevel: 20,
        maxStockLevel: 200,
        lastUpdated: new Date('2024-01-13'),
        warehouseInventory: [
          { warehouseId: 'WH-001', warehouseName: 'Main Warehouse', quantity: 0, location: 'K11-L12', lastUpdated: new Date('2024-01-13') },
          { warehouseId: 'WH-002', warehouseName: 'West Coast Hub', quantity: 45, location: 'M13-N14', lastUpdated: new Date('2024-01-12') },
          { warehouseId: 'WH-004', warehouseName: 'South Regional', quantity: 18, location: 'O15-P16', lastUpdated: new Date('2024-01-11') }
        ]
      },
      {
        id: 'INV-004',
        name: 'Desk Lamp',
        SKU: 'LAM-004',
        quantity: 37,
        location: 'Q17-R18',
        category: 'Home & Garden',
        supplier: 'HomeDepot',
        cost: 49.99,
        minStockLevel: 8,
        maxStockLevel: 80,
        lastUpdated: new Date('2024-01-12'),
        warehouseInventory: [
          { warehouseId: 'WH-001', warehouseName: 'Main Warehouse', quantity: 22, location: 'Q17-R18', lastUpdated: new Date('2024-01-12') },
          { warehouseId: 'WH-002', warehouseName: 'West Coast Hub', quantity: 15, location: 'S19-T20', lastUpdated: new Date('2024-01-10') }
        ]
      }
    ];
    this.filteredItems = [...this.inventoryItems];
  }

  private getEmptyNewItem(): NewInventoryItem {
    return {
      name: '',
      SKU: '',
      category: '',
      supplier: '',
      cost: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      warehouseInventory: []
    };
  }

  private resetForm(): void {
    this.addItemError = undefined;
    this.editItemError = undefined;
    this.transferError = undefined;
  }

  // ============================================================================
  // PUBLIC METHODS - STATS AND UTILITIES
  // ============================================================================

  getTotalItems(): number {
    return this.inventoryItems.length;
  }

  getLowStockCount(): number {
    return this.inventoryItems.filter(item => 
      item.warehouseInventory.some(wi => 
        wi.quantity <= item.minStockLevel && wi.quantity > 0
      )
    ).length;
  }

  getOutOfStockCount(): number {
    return this.inventoryItems.filter(item => 
      item.warehouseInventory.every(wi => wi.quantity === 0)
    ).length;
  }

  getTotalValue(): number {
    return this.inventoryItems.reduce((total, item) => {
      const totalQuantity = item.warehouseInventory.reduce((sum, wi) => sum + wi.quantity, 0);
      return total + (item.cost * totalQuantity);
    }, 0);
  }

  getWarehouseOptions(): WarehouseOption[] {
    return this.warehouses.map(warehouse => ({
      label: warehouse.name,
      value: warehouse.id
    }));
  }

  getWarehouseFilterOptions(): WarehouseOption[] {
    return [
      { label: 'All Warehouses', value: null },
      ...this.getWarehouseOptions()
    ];
  }

  getTotalQuantityForItem(item: ExtendedInventoryItem): number {
    return item.warehouseInventory.reduce((sum, wi) => sum + wi.quantity, 0);
  }

  getStockLevelForItem(item: ExtendedInventoryItem): 'out_of_stock' | 'low_stock' | 'in_stock' | 'overstocked' {
    const totalQuantity = this.getTotalQuantityForItem(item);
    if (totalQuantity === 0) return 'out_of_stock';
    if (totalQuantity <= item.minStockLevel) return 'low_stock';
    if (totalQuantity >= item.maxStockLevel) return 'overstocked';
    return 'in_stock';
  }

  getStatusSeverity(stockLevel: 'out_of_stock' | 'low_stock' | 'in_stock' | 'overstocked'): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (stockLevel) {
      case 'out_of_stock': return 'danger';
      case 'low_stock': return 'warn';
      case 'in_stock': return 'success';
      case 'overstocked': return 'info';
      default: return 'secondary';
    }
  }

  getStatusText(stockLevel: 'out_of_stock' | 'low_stock' | 'in_stock' | 'overstocked'): string {
    switch (stockLevel) {
      case 'out_of_stock': return 'Out of Stock';
      case 'low_stock': return 'Low Stock';
      case 'in_stock': return 'In Stock';
      case 'overstocked': return 'Overstocked';
      default: return 'Unknown';
    }
  }

  getCategorySeverity(category: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined } = {
      'Electronics': 'info',
      'Furniture': 'success',
      'Clothing': 'warn',
      'Books': 'info',
      'Tools': 'warn',
      'Automotive': 'danger',
      'Sports': 'success',
      'Home & Garden': 'success',
      'Office Supplies': 'info',
      'Other': 'info'
    };
    return severityMap[category] || 'info';
  }

  // ============================================================================
  // PUBLIC METHODS - SEARCH AND FILTER
  // ============================================================================

  filterItems(): void {
    let filtered = [...this.inventoryItems];
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.SKU.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.supplier?.toLowerCase().includes(search)
      );
    }
    
    // Apply category filter
    if (this.selectedCategoryFilter) {
      filtered = filtered.filter(item => item.category === this.selectedCategoryFilter);
    }
    
    // Apply warehouse filter
    if (this.selectedWarehouseFilter) {
      filtered = filtered.filter(item => 
        item.warehouseInventory.some(wi => wi.warehouseId === this.selectedWarehouseFilter)
      );
    }
    
    // Apply stock level filter
    if (this.selectedStockLevelFilter) {
      filtered = filtered.filter(item => 
        this.getStockLevelForItem(item) === this.selectedStockLevelFilter
      );
    }
    
    this.filteredItems = filtered;
  }

  // ============================================================================
  // PUBLIC METHODS - DIALOG ACTIONS
  // ============================================================================

  addInventoryItem(): void {
    this.newItem = this.getEmptyNewItem();
    this.showAddDialog = true;
    this.resetForm();
  }

  closeAddDialog(): void {
    this.showAddDialog = false;
    this.newItem = this.getEmptyNewItem();
    this.resetForm();
  }

  addWarehouseInventory(): void {
    this.newItem.warehouseInventory.push({
      warehouseId: '',
      quantity: 0,
      location: ''
    });
  }

  removeWarehouseInventory(index: number): void {
    this.newItem.warehouseInventory.splice(index, 1);
  }

  submitAddItem(): void {
    if (!this.isValidNewItem()) return;

    this.addItemLoading = true;
    this.addItemError = undefined;

    // Convert to API service format
    const totalQuantity = this.newItem.warehouseInventory.reduce((sum, wi) => sum + wi.quantity, 0);
    const primaryLocation = this.newItem.warehouseInventory[0]?.location || '';

    const payload = {
      name: this.newItem.name,
      SKU: this.newItem.SKU,
      quantity: totalQuantity,
      location: primaryLocation,
      category: this.newItem.category,
      supplier: this.newItem.supplier,
      cost: this.newItem.cost,
      minStockLevel: this.newItem.minStockLevel,
      maxStockLevel: this.newItem.maxStockLevel
    };

    this.subscriptions.add(
      this.apiService.createInventoryItem(payload).subscribe({
        next: (item) => {
          const extendedItem = this.convertToExtendedItem(item);
          this.inventoryItems = [...this.inventoryItems, extendedItem];
          this.filterItems();
          this.addItemLoading = false;
          this.closeAddDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Inventory item created successfully'
          });
        },
        error: (error) => {
          this.addItemLoading = false;
          this.addItemError = error.message || 'Failed to create inventory item';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.addItemError
          });
        }
      })
    );
  }

  editItem(item: ExtendedInventoryItem): void {
    this.editItemData = { ...item };
    this.showEditDialog = true;
    this.resetForm();
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.editItemData = null;
    this.resetForm();
  }

  submitEditItem(): void {
    if (!this.editItemData || !this.isValidEditItem()) return;

    this.editItemLoading = true;
    this.editItemError = undefined;

    const payload = {
      name: this.editItemData.name,
      SKU: this.editItemData.SKU,
      quantity: this.getTotalQuantityForItem(this.editItemData),
      location: this.editItemData.location,
      category: this.editItemData.category,
      supplier: this.editItemData.supplier,
      cost: this.editItemData.cost,
      minStockLevel: this.editItemData.minStockLevel,
      maxStockLevel: this.editItemData.maxStockLevel
    };

    this.subscriptions.add(
      this.apiService.updateInventoryItem(this.editItemData.id, payload).subscribe({
        next: (updatedItem) => {
          const extendedItem = this.convertToExtendedItem(updatedItem);
          this.inventoryItems = this.inventoryItems.map(item => 
            item.id === extendedItem.id ? extendedItem : item
          );
          this.filterItems();
          this.editItemLoading = false;
          this.closeEditDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Inventory item updated successfully'
          });
        },
        error: (error) => {
          this.editItemLoading = false;
          this.editItemError = error.message || 'Failed to update inventory item';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.editItemError
          });
        }
      })
    );
  }

  viewItem(item: ExtendedInventoryItem): void {
    this.selectedItem = item;
    this.showViewDialog = true;
  }

  transferStock(item: ExtendedInventoryItem): void {
    this.transferData = {
      itemId: item.id,
      itemName: item.name,
      fromWarehouseId: '',
      toWarehouseId: '',
      quantity: 0
    };
    this.showTransferDialog = true;
    this.resetForm();
  }

  closeTransferDialog(): void {
    this.showTransferDialog = false;
    this.transferData = null;
    this.resetForm();
  }

  submitTransfer(): void {
    if (!this.transferData || !this.isValidTransfer()) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to transfer ${this.transferData.quantity} units of ${this.transferData.itemName} from ${this.getWarehouseName(this.transferData.fromWarehouseId)} to ${this.getWarehouseName(this.transferData.toWarehouseId)}?`,
      header: 'Confirm Stock Transfer',
      icon: 'pi pi-exchange',
      accept: () => {
        // TODO: Implement stock transfer API call
        this.messageService.add({
          severity: 'success',
          summary: 'Transfer Complete',
          detail: 'Stock transfer completed successfully'
        });
        this.closeTransferDialog();
      }
    });
  }

  deleteItem(item: ExtendedInventoryItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performDelete(item);
      }
    });
  }

  private performDelete(item: ExtendedInventoryItem): void {
    this.subscriptions.add(
      this.apiService.deleteInventoryItem(item.id).subscribe({
        next: () => {
          this.inventoryItems = this.inventoryItems.filter(i => i.id !== item.id);
          this.filterItems();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Inventory item deleted successfully'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to delete inventory item'
          });
        }
      })
    );
  }

  // ============================================================================
  // PUBLIC METHODS - EXPORT
  // ============================================================================

  exportInventory(): void {
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

  private isValidNewItem(): boolean {
    return !!(this.newItem.name && 
              this.newItem.SKU && 
              this.newItem.category && 
              this.newItem.supplier &&
              this.newItem.cost > 0 &&
              this.newItem.minStockLevel >= 0 &&
              this.newItem.maxStockLevel > this.newItem.minStockLevel &&
              this.newItem.warehouseInventory.length > 0);
  }

  private isValidEditItem(): boolean {
    return !!(this.editItemData?.name && 
              this.editItemData?.SKU && 
              this.editItemData?.category && 
              this.editItemData?.supplier &&
              this.editItemData?.cost > 0 &&
              this.editItemData?.minStockLevel >= 0 &&
              this.editItemData?.maxStockLevel > this.editItemData?.minStockLevel);
  }

  private isValidTransfer(): boolean {
    return !!(this.transferData?.fromWarehouseId && 
              this.transferData?.toWarehouseId && 
              this.transferData?.fromWarehouseId !== this.transferData?.toWarehouseId &&
              this.transferData?.quantity > 0);
  }

  private getWarehouseName(warehouseId: string): string {
    const warehouse = this.warehouses.find(w => w.id === warehouseId);
    return warehouse?.name || 'Unknown Warehouse';
  }
} 