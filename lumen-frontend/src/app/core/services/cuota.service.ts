import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cuota } from '../models/cuota.model';

@Injectable({
  providedIn: 'root'
})
export class CuotaService {
  private readonly baseUrl = `${environment.apiUrl}/cuotas`;

  constructor(private readonly http: HttpClient) {}

  obtenerTodasLasCuotas(): Observable<Cuota[]> {
    return this.http.get<unknown[]>(this.baseUrl).pipe(
      map((response) => (response ?? []).map((item) => this.normalizeCuota(item)))
    );
  }

  obtenerCuotasPorHermano(idHermano: number): Observable<Cuota[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/hermano/${idHermano}`).pipe(
      map((response) => (response ?? []).map((item) => this.normalizeCuota(item)))
    );
  }

  // endpoint backend si existe; en portal usaremos simulacion local
  pagarCuotaBackend(id: number): Observable<Cuota> {
    return this.http.put<Cuota>(`${this.baseUrl}/${id}/pagar`, {});
  }

  generarCuotasManualmente(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/generar-manual`, {});
  }

  private normalizeCuota(row: unknown): Cuota {
    const cuota = (row ?? {}) as Record<string, unknown>;
    const hermano = (cuota['hermano'] ?? {}) as Record<string, unknown>;

    return {
      idCuota: Number(cuota['idCuota'] ?? cuota['id_cuota'] ?? 0),
      idHermano: this.toPositiveNumber(cuota['idHermano'] ?? cuota['id_hermano'] ?? hermano['id'] ?? hermano['idHermano']),
      concepto: String(cuota['concepto'] ?? ''),
      importe: Number(cuota['importe'] ?? 0),
      fecha_emision: cuota['fecha_emision'] as string | Date | undefined,
      fecha_vencimiento: cuota['fecha_vencimiento'] as string | Date | undefined,
      fechaPago: (cuota['fechaPago'] ?? cuota['fecha_pago']) as string | Date | null | undefined,
      fecha_pago: (cuota['fecha_pago'] ?? cuota['fechaPago']) as string | Date | null | undefined,
      estado: String(cuota['estado'] ?? 'PENDIENTE'),
      nota: cuota['nota'] ? String(cuota['nota']) : undefined,
      pagoSimulado: cuota['pagoSimulado'] as boolean | undefined
    };
  }

  private toPositiveNumber(value: unknown): number | undefined {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }
}
