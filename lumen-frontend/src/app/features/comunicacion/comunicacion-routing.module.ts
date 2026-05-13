import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComunicacionComponent } from './comunicacion.component';

const routes: Routes = [
  {
    path: '',
    component: ComunicacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComunicacionRoutingModule { }
