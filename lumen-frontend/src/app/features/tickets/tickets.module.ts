import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketsComponent } from './tickets.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TicketsRoutingModule, TicketsComponent]
})
export class TicketsModule {}
