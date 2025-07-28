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
    path: 'clients',
    loadComponent: () => import('./clients/clients.component').then(m => m.ClientsComponent),
    title: 'Client Management - WMS'
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent),
    title: 'Inventory Management - WMS'
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent),
    title: 'Order Management - WMS',
    children: [
      {
        path: 'processing',
        loadComponent: () => import('./orders/order-processing.component').then(m => m.OrderProcessingComponent),
        title: 'Order Processing - WMS'
      }
    ]
  },
  {
    path: 'fleet',
    loadComponent: () => import('./fleet/fleet.component').then(m => m.FleetComponent),
    title: 'Fleet Management - WMS',
    children: [
      {
        path: 'driver-assignment',
        loadComponent: () => import('./fleet/driver-assignment.component').then(m => m.DriverAssignmentComponent),
        title: 'Driver Assignment - WMS'
      },
      {
        path: 'tracking',
        loadComponent: () => import('./fleet/tracking.component').then(m => m.TrackingComponent),
        title: 'Tracking - WMS'
      }
    ]
  },
  {
    path: 'warehouse',
    loadComponent: () => import('./warehouse-setup/warehouse-setup.component').then(m => m.WarehouseSetupComponent),
    title: 'Warehouse Setup - WMS',
    children: [
      {
        path: 'cad-import',
        loadComponent: () => import('./warehouse-setup/cad-import.component').then(m => m.CadImportComponent),
        title: 'CAD Import - WMS'
      }
    ]
  },
  {
    path: 'routes',
    loadComponent: () => import('./routes/routes.component').then(m => m.RoutesComponent),
    title: 'Routes - WMS'
  },
  {
    path: 'route-planning',
    loadComponent: () => import('./route-planning/route-planning.component').then(m => m.RoutePlanningComponent),
    title: 'Route Planning - WMS'
  },
  {
    path: 'scheduling',
    loadComponent: () => import('./scheduling/scheduling.component').then(m => m.SchedulingComponent),
    title: 'Scheduling - WMS'
  },
  {
    path: 'services',
    loadComponent: () => import('./services/services.component').then(m => m.ServicesComponent),
    title: 'Services - WMS'
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent),
    title: 'Analytics - WMS',
    children: [
      {
        path: 'reports',
        loadComponent: () => import('./analytics/reports.component').then(m => m.ReportsComponent),
        title: 'Reports - WMS'
      }
    ]
  },
  {
    path: 'storage',
    loadComponent: () => import('./storage/storage.component').then(m => m.StorageComponent),
    title: 'Storage - WMS'
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent),
    title: 'Notifications - WMS'
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    title: 'Admin - WMS'
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    title: 'Users - WMS'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
