import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';

import { Cuota } from '../../core/models/cuota.model';
import { Gasto } from '../../core/models/gasto.model';
import { CuotaService } from '../../core/services/cuota.service';
import { GastoService } from '../../core/services/gasto.service';
import { HermanoService } from '../../services/hermano.service';

interface Notice {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  date: Date;
}

interface ExpenseItem {
  id: number;
  title: string;
  date: Date;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Metrics
  totalHermanos = 0;
  cuotasPendientes = 0;
  gastosRecientes = 0;
  alertasPendientes = 0;
  upcomingEvents = 0;

  // Notices & Events
  notices: Notice[] = [];
  expenses: ExpenseItem[] = [];
  loading = false;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly hermanoService: HermanoService,
    private readonly cuotaService: CuotaService,
    private readonly gastoService: GastoService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load dashboard data from existing services only.
   */
  private loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';

    const hermanos$ = this.hermanoService
      .getHermanos({ page: 1, pageSize: 1 })
      .pipe(catchError(() => of(null)));

    const cuotas$ = this.cuotaService
      .obtenerTodasLasCuotas()
      .pipe(catchError(() => of([] as Cuota[])));

    const gastos$ = this.gastoService
      .obtenerTodosLosGastos()
      .pipe(catchError(() => of([] as Gasto[])));

    forkJoin({ hermanos: hermanos$, cuotas: cuotas$, gastos: gastos$ })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ hermanos, cuotas, gastos }) => {
          const cuotasNormalizadas = cuotas ?? [];
          const gastosNormalizados = gastos ?? [];

          this.totalHermanos = hermanos?.pagination?.total ?? 0;
          this.cuotasPendientes = cuotasNormalizadas.filter((cuota) => this.isCuotaPendiente(cuota)).length;
          this.alertasPendientes = this.buildAlertasPendientes(cuotasNormalizadas).length;
          this.notices = this.buildAlertasPendientes(cuotasNormalizadas);
          this.gastosRecientes = this.getGastosMensuales(gastosNormalizados);
          this.expenses = this.buildRecentExpenses(gastosNormalizados);
          this.upcomingEvents = this.buildUpcomingEvents(cuotasNormalizadas);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'No se pudieron cargar todos los datos del dashboard.';
        }
      });
  }

  /**
   * Quick action: Add new hermano - navigates to census form
   */
  onAddHermano(): void {
    this.router.navigate(['/hermanos/nuevo']);
  }

  /**
   * Quick action: Send notice - will open notice creation modal/page
   */
  onSendNotice(): void {
    this.router.navigate(['/censo']);
  }

  /**
   * Quick action: Open the existing calendar view.
   */
  onNuevoEvento(): void {
    this.router.navigate(['/eventos']);
  }

  private isCuotaPendiente(cuota: Cuota): boolean {
    return String(cuota.estado).toUpperCase() === 'PENDIENTE';
  }

  private buildAlertasPendientes(cuotas: Cuota[]): Notice[] {
    const now = new Date();

    return cuotas
      .filter((cuota) => this.isCuotaPendiente(cuota))
      .map((cuota) => {
        const fechaVencimiento = this.toDate(cuota.fecha_vencimiento ?? cuota.fechaPago ?? cuota.fecha_pago ?? cuota.fecha_emision);
        const diffDays = fechaVencimiento ? Math.ceil((fechaVencimiento.getTime() - now.getTime()) / 86400000) : Number.POSITIVE_INFINITY;

        return {
          cuota,
          fechaVencimiento,
          diffDays
        };
      })
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 4)
      .map((item, index) => ({
        id: item.cuota.idCuota ?? index + 1,
        title: item.diffDays <= 0
          ? `Cuota vencida: ${item.cuota.concepto || 'Pendiente'}`
          : `Cuota próxima: ${item.cuota.concepto || 'Pendiente'}`,
        priority: item.diffDays <= 0 ? 'high' : item.diffDays <= 7 ? 'medium' : 'low',
        date: item.fechaVencimiento ?? now
      }));
  }

  private buildRecentExpenses(gastos: Gasto[]): ExpenseItem[] {
    return gastos
      .slice()
      .sort((left, right) => this.toDate(right.fecha).getTime() - this.toDate(left.fecha).getTime())
      .slice(0, 4)
      .map((gasto) => ({
        id: gasto.idGasto,
        title: gasto.concepto,
        date: this.toDate(gasto.fecha),
        amount: Number(gasto.importe) || 0
      }));
  }

  private buildUpcomingEvents(cuotas: Cuota[]): number {
    return cuotas.filter((cuota) => {
      const fechaVencimiento = this.toDate(cuota.fecha_vencimiento ?? cuota.fechaPago ?? cuota.fecha_pago ?? cuota.fecha_emision);

      if (!fechaVencimiento) {
        return false;
      }

      const now = new Date();
      const diffDays = Math.ceil((fechaVencimiento.getTime() - now.getTime()) / 86400000);
      return diffDays >= 0 && diffDays <= 30;
    }).length;
  }

  private getGastosMensuales(gastos: Gasto[]): number {
    const now = new Date();

    return gastos
      .filter((gasto) => {
        const date = this.toDate(gasto.fecha);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      })
      .reduce((sum, gasto) => sum + Math.max(Number(gasto.importe) || 0, 0), 0);
  }

  private toDate(value: string | Date | undefined | null): Date {
    if (!value) {
      return new Date(0);
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? new Date(0) : date;
  }
}
