import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { FleetVehicle } from '../../models/fleet-vehicle.model';

@Component({
  selector: 'app-fleet-header',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="fleet-header-card">
      <div class="fleet-header-flex">
        <div class="fleet-header-content">
          <h1 class="fleet-title">
            Fleet Management
          </h1>
          <p class="fleet-subtitle">Manage delivery vehicles and maintenance schedules</p>
        </div>
        <div class="fleet-summary-flex">
          <div class="fleet-summary-card">
            <p class="fleet-summary-label">Total Vehicles</p>
            <p class="fleet-summary-value">{{ vehicles.length }}</p>
          </div>
          <div class="fleet-summary-divider"></div>
          <div class="fleet-summary-card">
            <p class="fleet-summary-label">Active</p>
            <p class="fleet-summary-value fleet-summary-active">{{ getActiveCount() }}</p>
          </div>
          <div class="fleet-summary-divider"></div>
          <div class="fleet-summary-card">
            <p class="fleet-summary-label">Maintenance</p>
            <p class="fleet-summary-value fleet-summary-maintenance">{{ getMaintenanceCount() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fleet-header-card {
      width: 100%;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
      background: #23232a !important;
      border-radius: 1.25rem;
      box-shadow: 0 2px 12px 0 rgba(30,41,59,0.10);
      margin-bottom: 1.5rem;
      padding: 2rem 2.5rem;
      color: #fff !important;
    }

    .fleet-header-flex {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .fleet-header-content {
      flex: 1;
    }

    .fleet-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .fleet-subtitle {
      color: #a1a1aa;
      font-size: 1.15rem;
      margin: 0;
    }

    .fleet-summary-flex {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
      justify-content: flex-end;
    }

    .fleet-summary-card {
      flex: 1 1 180px;
      background: #1c1c22;
      border-radius: 1rem;
      box-shadow: 0 2px 8px 0 rgba(30,41,59,0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem 1rem;
      min-width: 120px;
      text-align: center;
    }

    .fleet-summary-label {
      color: #a1a1aa;
      font-size: 0.9rem;
      font-weight: 500;
      margin: 0;
    }

    .fleet-summary-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }

    .fleet-summary-active {
      color: #22c55e;
    }

    .fleet-summary-maintenance {
      color: #f59e0b;
    }

    .fleet-summary-divider {
      width: 2px;
      height: 3rem;
      background: #374151;
      border-radius: 1rem;
    }

    @media (max-width: 1024px) {
      .fleet-header-flex {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
      }

      .fleet-summary-flex {
        width: 100%;
        justify-content: space-between;
      }
    }

    @media (max-width: 768px) {
      .fleet-header-card {
        padding: 1.5rem;
      }

      .fleet-title {
        font-size: 2rem;
      }

      .fleet-summary-flex {
        flex-direction: column;
        gap: 1rem;
      }

      .fleet-summary-divider {
        display: none;
      }

      .fleet-summary-card {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        min-width: 0;
      }
    }

    @media (max-width: 480px) {
      .fleet-header-card {
        padding: 1rem;
      }

      .fleet-title {
        font-size: 1.75rem;
      }

      .fleet-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class FleetHeaderComponent {
  @Input() vehicles: FleetVehicle[] = [];

  getActiveCount(): number {
    return this.vehicles.filter(vehicle => vehicle.status === 'Active').length;
  }

  getMaintenanceCount(): number {
    return this.vehicles.filter(vehicle => vehicle.status === 'Maintenance').length;
  }
}