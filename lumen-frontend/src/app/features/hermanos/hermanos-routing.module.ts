import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HermanosComponent } from './hermanos.component';

const routes: Routes = [
  {
    path: '',
    component: HermanosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HermanosRoutingModule {}
