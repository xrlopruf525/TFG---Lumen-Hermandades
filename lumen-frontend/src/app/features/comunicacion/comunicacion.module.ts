import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ComunicacionRoutingModule } from './comunicacion-routing.module';
import { ComunicacionComponent } from './comunicacion.component';
import { GestionGruposComponent } from './gestion-grupos/gestion-grupos.component';
import { EnvioAvisosComponent } from './envio-avisos/envio-avisos.component';

@NgModule({
  declarations: [
    ComunicacionComponent,
    GestionGruposComponent,
    EnvioAvisosComponent
  ],
  imports: [
    CommonModule,
    ComunicacionRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ComunicacionModule { }
