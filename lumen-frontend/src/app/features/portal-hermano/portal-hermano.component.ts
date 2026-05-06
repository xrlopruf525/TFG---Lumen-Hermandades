import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { PortalHermanoProfile, HermanoService } from '../../services/hermano.service';

interface PortalNotice {
  title: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

interface PortalDocument {
  name: string;
  description: string;
  status: 'Disponible' | 'Pendiente' | 'Nuevo';
}

@Component({
  selector: 'app-portal-hermano',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-hermano.component.html',
  styleUrls: ['./portal-hermano.component.scss']
})
export class PortalHermanoComponent implements OnInit {
  profile: PortalHermanoProfile | null = null;
  loading = false;
  errorMessage = '';

  readonly notices: PortalNotice[] = [
    { title: 'Recordatorio de cuota trimestral', date: '15 mayo 2026', type: 'warning' },
    { title: 'Aviso de reunión informativa', date: '21 mayo 2026', type: 'info' },
    { title: 'Inscripción a salida extraordinaria', date: '28 mayo 2026', type: 'success' }
  ];

  readonly documents: PortalDocument[] = [
    { name: 'Recibo de cuotas', description: 'Últimos pagos y estado contable', status: 'Disponible' },
    { name: 'Certificado de pertenencia', description: 'Documento oficial para trámites', status: 'Nuevo' },
    { name: 'Normativa interna', description: 'Reglamento y normas de la hermandad', status: 'Disponible' }
  ];

  constructor(
    private readonly hermanoService: HermanoService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get cuotaStatus(): string {
    return 'Al corriente';
  }

  get proximaCuota(): string {
    return '15/05/2026';
  }

  get grupo(): string {
    return 'Pendiente de asignación';
  }

  retry(): void {
    this.loadProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.hermanoService.getPortalHermano().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: () => {
        this.profile = null;
        this.loading = false;
        this.errorMessage = 'No se pudo cargar tu portal. Revisa la conexion con la API.';
      }
    });
  }
}
