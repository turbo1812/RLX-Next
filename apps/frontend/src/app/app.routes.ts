import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - WMS'
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent),
    title: 'Inventory Management - WMS'
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent),
    title: 'Order Management - WMS'
  },
  {
    path: 'fleet',
    loadComponent: () => import('./fleet/fleet.component').then(m => m.FleetComponent),
    title: 'Fleet Management - WMS'
  },
  {
    path: 'warehouse',
    loadComponent: () => import('./warehouse-setup/warehouse-setup.component').then(m => m.WarehouseSetupComponent),
    title: 'Warehouse Setup - WMS'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
