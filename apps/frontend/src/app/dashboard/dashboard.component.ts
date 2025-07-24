import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  template: `
    <div class="p-4">
      <div class="grid">
        <!-- Header -->
        <div class="col-12">
          <h1 class="text-3xl font-bold mb-4">Warehouse Management System</h1>
          <p class="text-gray-600 mb-6">Welcome to your warehouse operations dashboard</p>
        </div>

        <!-- Quick Stats -->
        <div class="col-12 md:col-3">
          <p-card styleClass="h-full">
            <ng-template pTemplate="header">
              <div class="bg-blue-100 p-3">
                <i class="pi pi-box text-blue-600 text-2xl"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-blue-600">1,247</h3>
                <p class="text-gray-600">Total Inventory Items</p>
              </div>
            </ng-template>
            <ng-template pTemplate="footer">
              <p-button label="View Inventory" 
                       icon="pi pi-arrow-right" 
                       routerLink="/inventory"
                       styleClass="w-full"></p-button>
            </ng-template>
          </p-card>
        </div>

        <div class="col-12 md:col-3">
          <p-card styleClass="h-full">
            <ng-template pTemplate="header">
              <div class="bg-green-100 p-3">
                <i class="pi pi-shopping-cart text-green-600 text-2xl"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-green-600">89</h3>
                <p class="text-gray-600">Active Orders</p>
              </div>
            </ng-template>
            <ng-template pTemplate="footer">
              <p-button label="View Orders" 
                       icon="pi pi-arrow-right" 
                       routerLink="/orders"
                       styleClass="w-full"></p-button>
            </ng-template>
          </p-card>
        </div>

        <div class="col-12 md:col-3">
          <p-card styleClass="h-full">
            <ng-template pTemplate="header">
              <div class="bg-orange-100 p-3">
                <i class="pi pi-truck text-orange-600 text-2xl"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-orange-600">12</h3>
                <p class="text-gray-600">Fleet Vehicles</p>
              </div>
            </ng-template>
            <ng-template pTemplate="footer">
              <p-button label="View Fleet" 
                       icon="pi pi-arrow-right" 
                       routerLink="/fleet"
                       styleClass="w-full"></p-button>
            </ng-template>
          </p-card>
        </div>

        <div class="col-12 md:col-3">
          <p-card styleClass="h-full">
            <ng-template pTemplate="header">
              <div class="bg-purple-100 p-3">
                <i class="pi pi-building text-purple-600 text-2xl"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-purple-600">85%</h3>
                <p class="text-gray-600">Warehouse Utilization</p>
              </div>
            </ng-template>
            <ng-template pTemplate="footer">
              <p-button label="Warehouse Setup" 
                       icon="pi pi-arrow-right" 
                       routerLink="/warehouse"
                       styleClass="w-full"></p-button>
            </ng-template>
          </p-card>
        </div>

        <!-- Recent Activity -->
        <div class="col-12 md:col-8">
          <p-card header="Recent Activity" styleClass="h-full">
            <div class="space-y-4">
              <div class="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50">
                <i class="pi pi-plus-circle text-blue-600 mr-3"></i>
                <div>
                  <p class="font-semibold">New inventory item added</p>
                  <p class="text-sm text-gray-600">Laptop Computer (SKU: LAP-001) - 2 minutes ago</p>
                </div>
              </div>
              
              <div class="flex items-center p-3 border-l-4 border-green-500 bg-green-50">
                <i class="pi pi-check-circle text-green-600 mr-3"></i>
                <div>
                  <p class="font-semibold">Order shipped</p>
                  <p class="text-sm text-gray-600">Order #ORD-001 delivered to John Doe - 15 minutes ago</p>
                </div>
              </div>
              
              <div class="flex items-center p-3 border-l-4 border-orange-500 bg-orange-50">
                <i class="pi pi-exclamation-triangle text-orange-600 mr-3"></i>
                <div>
                  <p class="font-semibold">Low stock alert</p>
                  <p class="text-sm text-gray-600">Office Chair (SKU: CHAIR-001) - 5 items remaining - 1 hour ago</p>
                </div>
              </div>
              
              <div class="flex items-center p-3 border-l-4 border-purple-500 bg-purple-50">
                <i class="pi pi-truck text-purple-600 mr-3"></i>
                <div>
                  <p class="font-semibold">Vehicle maintenance scheduled</p>
                  <p class="text-sm text-gray-600">Truck TRK-001 maintenance due in 3 days - 2 hours ago</p>
                </div>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 md:col-4">
          <p-card header="Quick Actions" styleClass="h-full">
            <div class="space-y-3">
              <p-button label="Add Inventory Item" 
                       icon="pi pi-plus" 
                       severity="primary"
                       styleClass="w-full"></p-button>
              
              <p-button label="Create New Order" 
                       icon="pi pi-shopping-cart" 
                       severity="success"
                       styleClass="w-full"></p-button>
              
              <p-button label="Schedule Maintenance" 
                       icon="pi pi-wrench" 
                       severity="warn"
                       styleClass="w-full"></p-button>
              
              <p-button label="Generate Report" 
                       icon="pi pi-file-pdf" 
                       severity="info"
                       styleClass="w-full"></p-button>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
  `]
})
export class DashboardComponent {
  constructor() {}
} 