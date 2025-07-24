import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-warehouse-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CardModule, ButtonModule, InputTextModule, InputNumberModule, DropdownModule, BreadcrumbModule],
  template: `
    <div class="p-4">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <p-breadcrumb [model]="breadcrumbItems" [home]="home"></p-breadcrumb>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Warehouse Layout Designer</h1>
          <p class="text-gray-600 mt-2">Design and configure warehouse zones and aisles</p>
        </div>
        <div class="flex space-x-3">
          <p-button label="Save Layout" 
                   icon="pi pi-save" 
                   severity="primary"
                   (onClick)="saveLayout()"></p-button>
          <p-button label="Export Layout" 
                   icon="pi pi-download" 
                   severity="secondary"
                   (onClick)="exportLayout()"></p-button>
        </div>
      </div>

      <div class="grid">
        <!-- Warehouse Information -->
        <div class="col-12 md:col-6">
          <p-card header="Warehouse Information" styleClass="h-full">
            <div class="space-y-4">
              <div class="field">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Warehouse Name</label>
                <input id="name" type="text" pInputText [(ngModel)]="warehouse.name" class="w-full" />
              </div>
              <div class="field">
                <label for="width" class="block text-sm font-medium text-gray-700 mb-2">Width (meters)</label>
                <p-inputNumber id="width" [(ngModel)]="warehouse.width" [min]="1" [max]="1000" class="w-full"></p-inputNumber>
              </div>
              <div class="field">
                <label for="height" class="block text-sm font-medium text-gray-700 mb-2">Height (meters)</label>
                <p-inputNumber id="height" [(ngModel)]="warehouse.height" [min]="1" [max]="1000" class="w-full"></p-inputNumber>
              </div>
              <div class="field">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea id="description" [(ngModel)]="warehouse.description" rows="3" class="w-full"></textarea>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Zone Configuration -->
        <div class="col-12 md:col-6">
          <p-card header="Zone Configuration" styleClass="h-full">
            <div class="space-y-4">
              <div class="field">
                <label for="zoneType" class="block text-sm font-medium text-gray-700 mb-2">Zone Type</label>
                <p-dropdown id="zoneType" [options]="zoneTypes" [(ngModel)]="selectedZoneType" 
                           optionLabel="name" placeholder="Select Zone Type" class="w-full"></p-dropdown>
              </div>
              <div class="field">
                <label for="zoneName" class="block text-sm font-medium text-gray-700 mb-2">Zone Name</label>
                <input id="zoneName" type="text" pInputText [(ngModel)]="newZone.name" class="w-full" />
              </div>
              <div class="field">
                <label for="capacity" class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <p-inputNumber id="capacity" [(ngModel)]="newZone.capacity" [min]="1" class="w-full"></p-inputNumber>
              </div>
              <div class="field">
                <label for="zoneX" class="block text-sm font-medium text-gray-700 mb-2">X Position</label>
                <p-inputNumber id="zoneX" [(ngModel)]="newZone.x" [min]="0" class="w-full"></p-inputNumber>
              </div>
              <div class="field">
                <label for="zoneY" class="block text-sm font-medium text-gray-700 mb-2">Y Position</label>
                <p-inputNumber id="zoneY" [(ngModel)]="newZone.y" [min]="0" class="w-full"></p-inputNumber>
              </div>
              <p-button label="Add Zone" 
                       icon="pi pi-plus" 
                       (onClick)="addZone()"
                       [disabled]="!newZone.name || !selectedZoneType"></p-button>
            </div>
          </p-card>
        </div>
      </div>
      
      <!-- Current Zones -->
      <div class="mt-6">
        <p-card header="Current Zones">
          <div class="grid">
            <div class="col-12 md:col-4" *ngFor="let zone of warehouse.zones">
              <div class="border rounded-lg p-4 mb-4">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-lg font-semibold text-gray-900">{{zone.name}}</h3>
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {{zone.type}}
                  </span>
                </div>
                <div class="space-y-2 text-sm text-gray-600">
                  <p><strong>Capacity:</strong> {{zone.capacity}}</p>
                  <p><strong>Utilization:</strong> {{zone.currentUtilization}}/{{zone.capacity}}</p>
                  <p><strong>Position:</strong> ({{zone.x}}, {{zone.y}})</p>
                  <p><strong>Utilization:</strong> {{(zone.currentUtilization / zone.capacity * 100).toFixed(1)}}%</p>
                </div>
                <div class="mt-4 flex space-x-2">
                  <p-button label="Edit" 
                           icon="pi pi-pencil" 
                           size="small" 
                           severity="secondary"
                           (onClick)="editZone(zone)"></p-button>
                  <p-button label="Delete" 
                           icon="pi pi-trash" 
                           size="small" 
                           severity="danger"
                           (onClick)="deleteZone(zone)"></p-button>
                </div>
              </div>
            </div>
          </div>
        </p-card>
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
    
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    
    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }
    
    .field {
      margin-bottom: 1rem;
    }
    
    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
  `]
})
export class WarehouseSetupComponent {
  warehouse = {
    name: 'Main Warehouse',
    description: 'Primary warehouse facility for storing and processing inventory',
    width: 100,
    height: 80,
    zones: [
      {
        id: 'zone-001',
        name: 'Receiving Zone',
        type: 'Receiving',
        capacity: 1000,
        currentUtilization: 750,
        x: 0,
        y: 0
      },
      {
        id: 'zone-002',
        name: 'Storage Zone A',
        type: 'Storage',
        capacity: 2000,
        currentUtilization: 1200,
        x: 25,
        y: 0
      },
      {
        id: 'zone-003',
        name: 'Shipping Zone',
        type: 'Shipping',
        capacity: 800,
        currentUtilization: 300,
        x: 60,
        y: 0
      }
    ]
  };

  zoneTypes = [
    { name: 'Receiving', value: 'Receiving' },
    { name: 'Storage', value: 'Storage' },
    { name: 'Shipping', value: 'Shipping' },
    { name: 'Picking', value: 'Picking' },
    { name: 'Packaging', value: 'Packaging' }
  ];

  selectedZoneType = this.zoneTypes[0];
  newZone = {
    name: '',
    capacity: 100,
    x: 0,
    y: 0
  };

  breadcrumbItems = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Warehouse Setup' }
  ];

  home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  addZone() {
    if (this.newZone.name && this.selectedZoneType) {
      this.warehouse.zones.push({
        id: 'zone-' + Date.now(),
        name: this.newZone.name,
        type: this.selectedZoneType.name,
        capacity: this.newZone.capacity,
        currentUtilization: 0,
        x: this.newZone.x,
        y: this.newZone.y
      });
      this.resetNewZone();
    }
  }

  editZone(zone: any) {
    console.log('Edit zone:', zone);
    // TODO: Implement edit zone functionality
  }

  deleteZone(zone: any) {
    console.log('Delete zone:', zone);
    const index = this.warehouse.zones.findIndex(z => z.id === zone.id);
    if (index > -1) {
      this.warehouse.zones.splice(index, 1);
    }
  }

  saveLayout() {
    console.log('Save layout:', this.warehouse);
    // TODO: Implement save layout functionality
  }

  exportLayout() {
    console.log('Export layout:', this.warehouse);
    // TODO: Implement export layout functionality
  }

  private resetNewZone() {
    this.newZone = {
      name: '',
      capacity: 100,
      x: 0,
      y: 0
    };
  }
} 