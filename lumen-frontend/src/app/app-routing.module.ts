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
        data: { roles: ['ADMIN'] },
        component: DashboardComponent
      },
      {
        path: 'censo',
        data: { roles: ['ADMIN'] },
        component: HermanosComponent
      },
      {
        path: 'hermandades',
        data: { roles: ['ADMIN'] },
        component: HermanosComponent
      },
      {
        path: 'hermanos',
        data: { roles: ['ADMIN'] },
        component: HermanosComponent
      },
      {
        path: 'hermanos/nuevo',
        data: { roles: ['ADMIN'] },
        component: HermanoFormComponent
      },
      {
        path: 'hermanos/editar/:id',
        data: { roles: ['ADMIN'] },
        component: HermanoFormComponent
      },
      {
        path: 'patrimonio',
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/patrimonio/patrimonio.module').then(m => m.PatrimonioModule)
      },
      {
        path: 'tickets',
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/tickets/tickets.module').then(m => m.TicketsModule)
      },
      {
        path: 'comunicacion',
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/comunicacion/comunicacion.module').then(m => m.ComunicacionModule)
      },
      {
        path: 'eventos',
        data: { roles: ['ADMIN', 'HERMANO'] },
        component: CalendarioComponent
      },
      {
        path: 'portal-hermano',
        data: { roles: ['HERMANO'] },
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
