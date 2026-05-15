import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { PortalHermanoProfile, HermanoService } from '../../services/hermano.service';
import { CuotaService } from '../../core/services/cuota.service';
import { Cuota } from '../../core/models/cuota.model';

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
    const pendientes = this.pendingCuotas;
    return pendientes.length > 0 ? 'Pendiente' : 'Al corriente';
  }

  get proximaCuota(): string {
    const pendientes = this.pendingCuotas;
    if (!pendientes || pendientes.length === 0) {
      return '-';
    }

    const fechas = pendientes
      .map((c) => c.fecha_vencimiento ?? null)
      .filter(Boolean)
      .map((d) => (d instanceof Date ? d : new Date(String(d))))
      .filter((d) => !Number.isNaN(d.getTime()));

    if (fechas.length === 0) {
      return '-';
    }

    const min = fechas.reduce((a, b) => (a.getTime() < b.getTime() ? a : b));
    return min.toLocaleDateString('es-ES');
  }

  get pendingCuotas(): Cuota[] {
    if (!this.profile?.cuotas) {
      return [];
    }

    return (this.profile.cuotas ?? []).filter((c) => String(c.estado ?? '').toLowerCase().includes('pendiente'));
  }

  get gruposAsignados(): string {
    if (!this.profile?.grupos || this.profile.grupos.length === 0) {
      return 'Pendiente de asignación';
    }
    return this.profile.grupos.map(g => g.nombre).join(', ');
  }

  retry(): void {
    this.loadProfile();
  }

  paySimulado(cuota: Cuota): void {
    if (!cuota || !cuota.idCuota) {
      return;
    }
    const hoy = new Date().toISOString().split('T')[0];

    // Intentar pagar en backend para persistir en la DB
    this.cuotaService.pagarCuotaBackend(cuota.idCuota).subscribe({
      next: (resp) => {
        const fechaPago = (resp && (resp.fechaPago ?? resp.fecha_pago)) ? (resp.fechaPago ?? resp.fecha_pago) : hoy;
        if (this.profile?.cuotas) {
          this.profile.cuotas = this.profile.cuotas.map((c) => {
            if (c.idCuota === cuota.idCuota) {
              return { ...c, estado: 'PAGADA', fechaPago, fecha_pago: fechaPago } as Cuota;
            }
            return c;
          });
        }
      },
      error: (err) => {
        // Si falla el backend, registrar pago simulado local y actualizar vista
        console.error('Pago backend fallido, usando simulación local:', err);
        this.cuotaService.registrarPagoSimulado(cuota.idCuota, hoy);

        if (this.profile?.cuotas) {
          this.profile.cuotas = this.profile.cuotas.map((c) => {
            if (c.idCuota === cuota.idCuota) {
              return { ...c, estado: 'PAGADA', fechaPago: hoy, fecha_pago: hoy, pagoSimulado: true } as Cuota;
            }
            return c;
          });
        }
      }
    });
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
