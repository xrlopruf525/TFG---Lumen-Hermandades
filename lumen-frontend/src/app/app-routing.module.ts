import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HermanoFormComponent } from './components/hermano-form/hermano-form.component';
import { CalendarioComponent } from './features/calendario/calendario.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HermanosComponent } from './features/hermanos/hermanos.component';
import { LoginComponent } from './features/login/login.component';
import { PortalHermanoComponent } from './features/portal-hermano/portal-hermano.component';
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
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        data: { role: 'ADMIN' },
        component: DashboardComponent
      },
      {
        path: 'censo',
        data: { role: 'ADMIN' },
        component: HermanosComponent
      },
      {
        path: 'hermandades',
        data: { role: 'ADMIN' },
        component: HermanosComponent
      },
      {
        path: 'hermanos',
        data: { role: 'ADMIN' },
        component: HermanosComponent
      },
      {
        path: 'hermanos/nuevo',
        data: { role: 'ADMIN' },
        component: HermanoFormComponent
      },
      {
        path: 'hermanos/editar/:id',
        data: { role: 'ADMIN' },
        component: HermanoFormComponent
      },
      {
        path: 'eventos',
        data: { role: 'ADMIN' },
        component: CalendarioComponent
      },
      {
        path: 'portal-hermano',
        data: { role: 'HERMANO' },
        component: PortalHermanoComponent
      },
      {
        path: 'mi-perfil',
        redirectTo: 'portal-hermano',
        pathMatch: 'full'
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
