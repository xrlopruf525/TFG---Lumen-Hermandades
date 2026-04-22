import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HermanoFormComponent } from './components/hermano-form/hermano-form.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { CalendarioComponent } from './features/calendario/calendario.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HermanosComponent } from './features/hermanos/hermanos.component';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './layout/layout/layout.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'hermandades',
        component: HermanosComponent
      },
      {
        path: 'hermanos',
        component: HermanosComponent
      },
      {
        path: 'hermanos/nuevo',
        component: HermanoFormComponent
      },
      {
        path: 'hermanos/editar/:id',
        component: HermanoFormComponent
      },
      {
        path: 'eventos',
        component: CalendarioComponent
      },
      {
        path: 'mi-perfil',
        component: MiPerfilComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
