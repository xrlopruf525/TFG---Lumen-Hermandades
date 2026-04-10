import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HermanoFormComponent } from './components/hermano-form/hermano-form.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HermanosComponent } from './features/hermanos/hermanos.component';
import { LoginComponent } from './features/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hermanos/nuevo',
    component: HermanoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hermanos/editar/:id',
    component: HermanoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hermanos',
    component: HermanosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-perfil',
    component: MiPerfilComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
