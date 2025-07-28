import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiService } from './api.service';

@Component({
  selector: 'app-services-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ProgressSpinnerModule],
  template: `
    <div class="services-dashboard-container">
      <h1 class="services-dashboard-title">Services Status</h1>
      <p class="services-dashboard-desc">Monitor the health and status of all backend services.</p>
      <p-progressSpinner *ngIf="loading" styleClass="p-d-block p-mx-auto p-my-8" strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s"></p-progressSpinner>
      <p-card *ngIf="!loading">
        <ng-template pTemplate="header">
          <div class="p-d-flex p-ai-center p-jc-between">
            <span class="p-text-xl p-font-bold">Service Health</span>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <p-table [value]="services" [responsiveLayout]="'scroll'">
            <ng-template pTemplate="header">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Version</th>
                <th>Last Heartbeat</th>
                <th>Endpoint</th>
                <th>Errors</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-service>
              <tr>
                <td>{{ service.name }}</td>
                <td>
                  <span [ngClass]="getStatusClass(service.status)">{{ service.status }}</span>
                </td>
                <td>{{ service.version }}</td>
                <td>{{ service.lastHeartbeat | date:'short' }}</td>
                <td>{{ service.endpoint }}</td>
                <td>
                  <span *ngIf="service.errors.length === 0">-</span>
                  <ul *ngIf="service.errors.length > 0">
                    <li *ngFor="let err of service.errors">{{ err }}</li>
                  </ul>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </ng-template>
      </p-card>
      <div *ngIf="error" class="p-error p-mt-4">{{ error }}</div>
    </div>
  `,
  styles: [`
    .services-dashboard-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    .services-dashboard-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    .services-dashboard-desc {
      color: #64748b;
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 2rem;
    }
    .p-error {
      color: #ef4444;
      font-weight: 600;
    }
    .p-table th, .p-table td {
      text-align: left;
      padding: 0.75rem 1rem;
    }
    .p-table th {
      background: #f1f5f9;
      font-weight: 700;
    }
    .p-table td {
      background: #fff;
    }
    .status-Healthy {
      color: #22c55e;
      font-weight: 600;
    }
    .status-Degraded {
      color: #f59e42;
      font-weight: 600;
    }
    .status-Down {
      color: #ef4444;
      font-weight: 600;
    }
  `]
})
export class ServicesDashboardComponent implements OnInit {
  services: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchServices();
  }

  fetchServices() {
    this.loading = true;
    this.error = null;
    this.apiService.getServiceStatuses().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load service status';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'Healthy') return 'status-Healthy';
    if (status === 'Degraded') return 'status-Degraded';
    if (status === 'Down') return 'status-Down';
    return '';
  }
}
export default ServicesDashboardComponent; 