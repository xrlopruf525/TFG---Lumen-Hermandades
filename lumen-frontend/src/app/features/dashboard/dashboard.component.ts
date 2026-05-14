import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Notice {
  title: string;
  date: string | Date;
  priority: 'low' | 'medium' | 'high';
}

interface Expense {
  title: string;
  date: string | Date;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading = false;
  errorMessage = '';

  totalHermanos = 0;
  cuotasPendientes = 0;
  gastosRecientes = 0;
  alertasPendientes = 0;

  notices: Notice[] = [];
  expenses: Expense[] = [];

  // Modal enviar aviso
  mostrarModalAviso = false;
  enviandoAviso = false;

  tipoDestinatario = 'HERMANO';
  idHermanoSeleccionado: number | null = null;
  idGrupoSeleccionado: number | null = null;
  asuntoAviso = '';
  mensajeAviso = '';

  hermanos: any[] = [];
  grupos: any[] = [];

  private readonly API_BASE = 'http://localhost:8080';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.API_BASE}/hermanos`, {
      params: {
        page: 0,
        size: 10000
      }
    }).subscribe({
      next: (response) => {
        const hermanos = this.normalizarRespuesta(response);
        this.totalHermanos = hermanos.length;
      },
      error: (error) => {
        console.error('Error cargando hermanos:', error);
        this.errorMessage = 'No se pudieron cargar los hermanos.';
      }
    });

    this.http.get<any>(`${this.API_BASE}/cuotas`, {
      params: {
        page: 0,
        size: 10000
      }
    }).subscribe({
      next: (response) => {
        const cuotas = this.normalizarRespuesta(response);

        const pendientes = cuotas.filter((cuota: any) => {
          const estado = String(cuota.estado ?? '').toLowerCase();
          return estado.includes('pendiente') || estado.includes('sin pagar') || estado.includes('vencida');
        });

        this.cuotasPendientes = pendientes.length;
        this.alertasPendientes = pendientes.length;

        this.notices = pendientes.slice(0, 5).map((cuota: any) => ({
          title: cuota.concepto ?? cuota.descripcion ?? 'Cuota pendiente',
          date: cuota.fechaVencimiento ?? cuota.fecha_vencimiento ?? new Date(),
          priority: 'high'
        }));
      },
      error: (error) => {
        console.error('Error cargando cuotas:', error);
      }
    });

    this.http.get<any>(`${this.API_BASE}/gastos`, {
      params: {
        page: 0,
        size: 10000
      }
    }).subscribe({
      next: (response) => {
        const movimientos = this.normalizarRespuesta(response);

        // En este proyecto:
        // importe negativo = ingreso
        // importe positivo = gasto
        const gastos = movimientos.filter((mov: any) => this.obtenerImporte(mov) > 0);

        this.gastosRecientes = gastos.reduce((total: number, gasto: any) => {
          return total + Math.abs(this.obtenerImporte(gasto));
        }, 0);

        this.expenses = movimientos.slice(0, 5).map((mov: any) => ({
          title: mov.concepto ?? mov.descripcion ?? mov.nombre ?? 'Movimiento',
          date: mov.fecha ?? mov.fechaMovimiento ?? mov.fecha_movimiento ?? new Date(),
          amount: this.obtenerImporte(mov)
        }));

        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando gastos:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Quick action: Add hermano
   */
  onAddHermano(): void {
    this.router.navigate(['/censo']);
  }

  /**
   * Quick action: Send notice
   */
  onSendNotice(): void {
    this.router.navigate(['/avisos']);
  }

  /**
   * Quick action: New event
   */
  onNuevoEvento(): void {
    this.router.navigate(['/eventos']);
  }

  abrirModalAviso(): void {
    this.mostrarModalAviso = true;
    this.cargarHermanos();
    this.cargarGrupos();
  }

  cerrarModalAviso(): void {
    this.mostrarModalAviso = false;
  }

  cargarHermanos(): void {
    this.http.get<any>(`${this.API_BASE}/hermanos`, {
      params: {
        page: 0,
        size: 10000
      }
    }).subscribe({
      next: (response) => {
        this.hermanos = this.normalizarRespuesta(response);
      },
      error: (error) => {
        console.error('Error cargando hermanos para aviso:', error);
      }
    });
  }

  cargarGrupos(): void {
    this.http.get<any>(`${this.API_BASE}/grupos`).subscribe({
      next: (response) => {
        this.grupos = this.normalizarRespuesta(response);
      },
      error: (error) => {
        console.error('Error cargando grupos para aviso:', error);
        this.grupos = [];
      }
    });
  }

  enviarAviso(): void {
    if (!this.asuntoAviso.trim() || !this.mensajeAviso.trim()) {
      alert('Debes escribir un asunto y un mensaje.');
      return;
    }

    if (this.tipoDestinatario === 'HERMANO' && !this.idHermanoSeleccionado) {
      alert('Debes seleccionar un hermano.');
      return;
    }

    if (this.tipoDestinatario === 'GRUPO' && !this.idGrupoSeleccionado) {
      alert('Debes seleccionar un grupo.');
      return;
    }

    this.enviandoAviso = true;

    const payload = {
      tipoDestinatario: this.tipoDestinatario,
      idHermano: this.tipoDestinatario === 'HERMANO' ? this.idHermanoSeleccionado : null,
      idGrupo: this.tipoDestinatario === 'GRUPO' ? this.idGrupoSeleccionado : null,
      asunto: this.asuntoAviso,
      mensaje: this.mensajeAviso
    };

    this.http.post<any>(`${this.API_BASE}/avisos/enviar`, payload).subscribe({
      next: (response) => {
        this.enviandoAviso = false;
        alert(`Aviso enviado correctamente a ${response.totalEnviados} destinatario/s.`);
        this.limpiarFormularioAviso();
        this.cerrarModalAviso();
      },
      error: (error) => {
        console.error('Error enviando aviso:', error);
        this.enviandoAviso = false;
        alert('No se pudo enviar el aviso.');
      }
    });
  }

  limpiarFormularioAviso(): void {
    this.tipoDestinatario = 'HERMANO';
    this.idHermanoSeleccionado = null;
    this.idGrupoSeleccionado = null;
    this.asuntoAviso = '';
    this.mensajeAviso = '';
  }

  normalizarRespuesta(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  obtenerImporte(item: any): number {
    const valor =
      item.importe ??
      item.cantidad ??
      item.monto ??
      item.total ??
      0;

    if (typeof valor === 'number') {
      return valor;
    }

    return Number(
      String(valor)
        .replace('€', '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    ) || 0;
  }
}