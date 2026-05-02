import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';

import { Cuota } from '../../core/models/cuota.model';
import { Gasto, GastoResumen, Movimiento } from '../../core/models/gasto.model';
import { CuotaService } from '../../core/services/cuota.service';
import { GastoService } from '../../core/services/gasto.service';
import { GestionEconomicaNewComponent } from '../gestion-economica-new/gestion-economica-new.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-gestion-economica',
  standalone: true,
  imports: [CommonModule, GestionEconomicaNewComponent],
  templateUrl: './gestion-economica.component.html',
  styleUrls: ['./gestion-economica.component.scss']
})
export class GestionEconomicaComponent implements OnInit {
  loading = false;
  estadisticas$: Observable<GastoResumen> | undefined;
  movimientos$: Observable<Movimiento[]> | undefined;
  showNewForm = false;

  constructor(
    private readonly cuotaService: CuotaService,
    private readonly gastoService: GastoService,
    private readonly authService: AuthService
  ) {}

  get isAdmin(): boolean {
    const user = this.authService.getUser();
    return !!user && user.role === 'ADMIN';
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    const cuotas$ = this.cuotaService.obtenerTodasLasCuotas();
    const gastos$ = this.gastoService.obtenerTodosLosGastos();

    this.movimientos$ = combineLatest([cuotas$, gastos$]).pipe(
      map(([cuotas, gastos]) => {
        const movimientos: Movimiento[] = [];

        const cuotasPagadas = (cuotas || []).filter(c => c.estado === 'PAGADA');
        cuotasPagadas.forEach(cuota => {
          movimientos.push({
            id: cuota.idCuota,
            fecha: cuota.fecha_pago || new Date(),
            concepto: cuota.concepto,
            tipo: 'ingreso',
            importe: Number(cuota.importe) || 0
          });
        });

        (gastos || []).forEach(gasto => {
          movimientos.push({
            id: gasto.idGasto,
            fecha: gasto.fecha,
            concepto: gasto.concepto,
            tipo: Number(gasto.importe) < 0 ? 'ingreso' : 'gasto',
            importe: Number(gasto.importe) || 0
          });
        });

        return movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      })
    );

    this.estadisticas$ = combineLatest([cuotas$, gastos$]).pipe(
      map(([cuotas, gastos]) => {
        const cuotasPagadas = (cuotas || []).filter(c => c.estado === 'PAGADA');
        const total_ingresos_from_cuotas = cuotasPagadas.reduce((s, c) => s + Number(c.importe || 0), 0);
        const total_ingresos_from_gastos = (gastos || []).filter(g => Number(g.importe) < 0).reduce((s, g) => s + Math.abs(Number(g.importe || 0)), 0);
        const total_gastos = (gastos || []).filter(g => Number(g.importe) >= 0).reduce((s, g) => s + Number(g.importe || 0), 0);

        const total_ingresos = total_ingresos_from_cuotas + total_ingresos_from_gastos;
        const balance = total_ingresos - total_gastos;

        return {
          total_ingresos,
          total_gastos,
          balance
        } as GastoResumen;
      })
    );

    this.loading = false;
  }

  abrirNuevoMovimiento(): void {
    this.showNewForm = !this.showNewForm;
  }

  onCreated(): void {
    this.cargarDatos();
    this.showNewForm = false;
  }

  onCancel(): void {
    this.showNewForm = false;
  }
}
