import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HermanosRoutingModule } from './hermanos-routing.module';
import { HermanosComponent } from './hermanos.component';

@NgModule({
  declarations: [HermanosComponent],
  imports: [
    CommonModule,
    FormsModule,
    HermanosRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ]
})
export class HermanosModule {}
