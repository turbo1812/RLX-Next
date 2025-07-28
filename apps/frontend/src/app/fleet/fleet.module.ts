import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FleetComponent } from './fleet.component';

@NgModule({
  declarations: [FleetComponent],
  imports: [CommonModule, RouterModule],
  exports: [FleetComponent]
})
export class FleetModule {} 