import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

// Components
import { FleetComponent } from './fleet.component';
import { FleetHeaderComponent } from './components/fleet-header/fleet-header.component';
import { FleetActionBarComponent } from './components/fleet-action-bar/fleet-action-bar.component';
import { DriverAssignmentComponent } from './driver-assignment.component';
import { TrackingComponent } from './tracking.component';

// Services
import { FleetService } from './services/fleet.service';

@NgModule({
  declarations: [
    FleetComponent,
    DriverAssignmentComponent,
    TrackingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    TooltipModule,
    DropdownModule,
    InputTextModule,
    FleetHeaderComponent,
    FleetActionBarComponent
  ],
  providers: [FleetService],
  exports: [FleetComponent]
})
export class FleetModule {} 