import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';

// Temporary interfaces - will be replaced with proper imports
interface Client {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  warehouseId: string;
  status: 'active' | 'inactive' | 'suspended';
  serviceAgreements: ServiceAgreement[];
  billingInfo: BillingInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceAgreement {
  id: string;
  clientId?: string; // Make optional since it's not always available when creating
  type: 'storage' | 'delivery' | 'assembly' | 'packaging' | 'returns' | 'fulfillment' | 'warehousing';
  startDate: Date;
  endDate?: Date;
  terms: string;
  pricing: {
    storage: number;
    picking: number;
    packing: number;
    shipping: number;
  };
}

interface BillingInfo {
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentTerms: string;
  taxId: string;
  creditLimit: number;
  currentBalance: number;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    TagModule,
    BadgeModule
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  // Data
  clients: Client[] = [];
  filteredClients: Client[] = [];
  warehouses: any[] = [];
  
  // Stats
  activeClients = 0;
  totalOrders = 0;
  pendingDeliveries = 0;
  totalRevenue = 0;
  
  // Filters
  searchTerm = '';
  selectedStatusFilter: string | null = null;
  statusFilterOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' }
  ];
  
  // Dialog states
  showClientDialog = false;
  isEditing = false;
  submitting = false;
  
  // Form data
  newClient: Client = {
    id: '',
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    warehouseId: '',
    status: 'active',
    serviceAgreements: [],
    billingInfo: {
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      paymentTerms: 'Net 30',
      taxId: '',
      creditLimit: 0,
      currentBalance: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  loading = false;

  constructor() {}

  ngOnInit() {
    this.loadClients();
    this.loadWarehouses();
    this.loadStats();
  }

  loadClients() {
    this.loading = true;
    
    // Mock data for demonstration
    setTimeout(() => {
      this.clients = [
        {
          id: '1',
          name: 'TechCorp Solutions',
          code: 'TCS001',
          contactPerson: 'John Smith',
          email: 'john.smith@techcorp.com',
          phone: '+1 (555) 123-4567',
          address: {
            street: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
            country: 'USA'
          },
          warehouseId: 'wh1',
          status: 'active',
          serviceAgreements: [
            {
              id: 'sa1',
              type: 'fulfillment',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-12-31'),
              terms: 'Standard fulfillment services',
              pricing: {
                storage: 0.50,
                picking: 2.00,
                packing: 1.50,
                shipping: 5.00
              }
            }
          ],
          billingInfo: {
            billingAddress: {
              street: '123 Tech Street',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94105',
              country: 'USA'
            },
            paymentTerms: 'Net 30',
            taxId: '12-3456789',
            creditLimit: 50000,
            currentBalance: 12500
          },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-03-20')
        },
        {
          id: '2',
          name: 'Global Retail Inc',
          code: 'GRI002',
          contactPerson: 'Sarah Johnson',
          email: 'sarah.johnson@globalretail.com',
          phone: '+1 (555) 987-6543',
          address: {
            street: '456 Commerce Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          warehouseId: 'wh2',
          status: 'active',
          serviceAgreements: [
            {
              id: 'sa2',
              type: 'warehousing',
              startDate: new Date('2024-02-01'),
              endDate: new Date('2024-12-31'),
              terms: 'Warehouse storage and management',
              pricing: {
                storage: 0.75,
                picking: 1.75,
                packing: 1.25,
                shipping: 4.50
              }
            }
          ],
          billingInfo: {
            billingAddress: {
              street: '456 Commerce Ave',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA'
            },
            paymentTerms: 'Net 45',
            taxId: '98-7654321',
            creditLimit: 75000,
            currentBalance: 32000
          },
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-03-18')
        },
        {
          id: '3',
          name: 'EcoProducts LLC',
          code: 'EPL003',
          contactPerson: 'Michael Chen',
          email: 'michael.chen@ecoproducts.com',
          phone: '+1 (555) 456-7890',
          address: {
            street: '789 Green Way',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'USA'
          },
          warehouseId: 'wh1',
          status: 'suspended',
          serviceAgreements: [
            {
              id: 'sa3',
              type: 'fulfillment',
              startDate: new Date('2024-01-15'),
              endDate: new Date('2024-12-31'),
              terms: 'Eco-friendly fulfillment services',
              pricing: {
                storage: 0.60,
                picking: 2.25,
                packing: 1.75,
                shipping: 5.50
              }
            }
          ],
          billingInfo: {
            billingAddress: {
              street: '789 Green Way',
              city: 'Portland',
              state: 'OR',
              zipCode: '97201',
              country: 'USA'
            },
            paymentTerms: 'Net 30',
            taxId: '45-6789012',
            creditLimit: 30000,
            currentBalance: 28000
          },
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-03-15')
        }
      ];
      
      this.filteredClients = [...this.clients];
      this.loading = false;
    }, 1000);
  }

  loadWarehouses() {
    // Mock warehouse data
    this.warehouses = [
      { id: 'wh1', name: 'West Coast Hub' },
      { id: 'wh2', name: 'East Coast Hub' },
      { id: 'wh3', name: 'Central Distribution' }
    ];
  }

  loadStats() {
    this.activeClients = this.clients.filter(c => c.status === 'active').length;
    this.totalOrders = 156; // Mock data
    this.pendingDeliveries = 23; // Mock data
    this.totalRevenue = 125000; // Mock data
  }

  filterClients() {
    let filtered = [...this.clients];
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(search) ||
        client.code.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.contactPerson.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (this.selectedStatusFilter) {
      filtered = filtered.filter(client => client.status === this.selectedStatusFilter);
    }
    
    this.filteredClients = filtered;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'danger';
      default: return 'info';
    }
  }

  getWarehouseName(warehouseId: string): string {
    const warehouse = this.warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown';
  }

  getClientOrderCount(clientId: string): number {
    // Mock data - in real app, this would come from orders service
    return Math.floor(Math.random() * 50) + 5;
  }

  getClientOrderStatus(clientId: string): string {
    // Mock data
    const statuses = ['Processing', 'Shipped', 'Delivered'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  getClientRevenue(clientId: string): number {
    // Mock data - in real app, this would come from orders service
    return Math.floor(Math.random() * 50000) + 5000;
  }

  openAddClientDialog() {
    this.isEditing = false;
    this.resetForm();
    this.showClientDialog = true;
  }

  editClient(client: Client) {
    this.isEditing = true;
    this.newClient = { ...client };
    this.showClientDialog = true;
  }

  closeClientDialog() {
    this.showClientDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.newClient = {
      id: '',
      name: '',
      code: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      warehouseId: '',
      status: 'active',
      serviceAgreements: [],
      billingInfo: {
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        paymentTerms: 'Net 30',
        taxId: '',
        creditLimit: 0,
        currentBalance: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  submitClient() {
    if (!this.newClient.name || !this.newClient.code || !this.newClient.contactPerson || 
        !this.newClient.email || !this.newClient.phone || !this.newClient.warehouseId) {
      return;
    }

    this.submitting = true;

    setTimeout(() => {
      if (this.isEditing) {
        // Update existing client
        const index = this.clients.findIndex(c => c.id === this.newClient.id);
        if (index !== -1) {
          this.clients[index] = { ...this.clients[index], ...this.newClient };
        }
      } else {
        // Add new client
        const newClient: Client = {
          ...this.newClient as Client,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.clients.push(newClient);
      }

      this.filterClients();
      this.loadStats();
      this.closeClientDialog();
      this.submitting = false;
    }, 1000);
  }

  viewClient(client: Client) {
    // Navigate to client details page
    console.log('View client:', client);
  }

  viewInventory(client: Client) {
    // Navigate to client inventory page
    console.log('View inventory for client:', client);
  }

  viewOrders(client: Client) {
    // Navigate to client orders page
    console.log('View orders for client:', client);
  }
}