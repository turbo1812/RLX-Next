import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WarehouseSetupComponent } from './warehouse-setup.component';

@NgModule({
  declarations: [WarehouseSetupComponent],
  imports: [CommonModule, RouterModule],
  exports: [WarehouseSetupComponent]
})
export class WarehouseModule {} 