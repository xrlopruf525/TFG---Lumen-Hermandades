import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { PortalHermanoProfile, HermanoService } from '../../services/hermano.service';
import { Cuota } from '../../core/models/cuota.model';
import { CuotaService } from '../../core/services/cuota.service';

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
  cuotas: Cuota[] = [];

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
    private readonly router: Router,
    private readonly cuotaService: CuotaService
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
        this.loadCuotas();
        this.loading = false;
      },
      error: () => {
        this.profile = null;
        this.loading = false;
        this.errorMessage = 'No se pudo cargar tu portal. Revisa la conexion con la API.';
      }
    });
  }

  private loadCuotas(): void {
    let id: number | null = null;

    if (this.profile) {
      // El perfil actual es la fuente más fiable: primero su id real y luego el numero de hermano.
      id = this.profile.id ?? this.profile.numeroHermano ?? null;
    }

    if (!id) {
      id = this.authService.getAuthenticatedHermanoId();
    }

    if (!id) {
      this.cuotas = [];
      return;
    }

    this.cuotaService.obtenerCuotasPorHermano(id).subscribe({
      next: (cuotas) => {
        this.cuotas = cuotas || [];
      },
      error: () => {
        this.cuotas = [];
      }
    });
  }

  pagarCuotaSimulada(cuota: Cuota): void {
    if (!cuota) return;

    const fechaPago = new Date().toISOString();
    cuota.estado = 'PAGADA';
    cuota.fechaPago = fechaPago;
    cuota.fecha_pago = fechaPago;
    cuota.pagoSimulado = true;

    this.cuotaService.registrarPagoSimulado(cuota.idCuota, fechaPago);
  }

  get cuotasPendientes(): Cuota[] {
    return this.cuotas.filter((cuota) => String(cuota.estado).toUpperCase() !== 'PAGADA');
  }

  get cuotasPagadas(): Cuota[] {
    return this.cuotas.filter((cuota) => String(cuota.estado).toUpperCase() === 'PAGADA');
  }
}
