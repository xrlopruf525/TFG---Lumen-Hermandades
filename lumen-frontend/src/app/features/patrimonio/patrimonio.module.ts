import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PatrimonioRoutingModule } from './patrimonio-routing.module';
import { PatrimonioListComponent } from './patrimonio-list.component';
import { PatrimonioFormComponent } from './patrimonio-form.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PatrimonioRoutingModule,
    PatrimonioListComponent,
    PatrimonioFormComponent
  ]
})
export class PatrimonioModule { }
