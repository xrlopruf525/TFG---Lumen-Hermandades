import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Hermano,
  HermanosQueryParams,
  PaginatedResponse,
  UpsertHermanoPayload
} from '../models/hermano.model';

@Injectable({
  providedIn: 'root'
})
export class HermanoService {
  private readonly baseUrl = `${environment.apiUrl}/hermanos`;

  constructor(private readonly http: HttpClient) {}

  getHermanos(params: HermanosQueryParams): Observable<PaginatedResponse<Hermano>> {
    return this.http.get<unknown[]>(`${this.baseUrl}/buscar`).pipe(
      map((response) => {
        const normalized = (response ?? []).map((item) => this.normalizeHermano(item as Partial<Hermano>));
        const filtered = this.filterByQuery(normalized, params);
        const sorted = this.sortRows(filtered, params);

        const page = Math.max(1, params.page || 1);
        const pageSize = Math.max(1, params.pageSize || 10);
        const total = sorted.length;
        const totalPages = Math.max(Math.ceil(total / pageSize), 1);
        const start = (page - 1) * pageSize;
        const data = sorted.slice(start, start + pageSize);

        return {
          data,
          pagination: {
            page,
            pageSize,
            total,
            totalPages
          }
        };
      })
    );
  }

  getHermanoById(id: number): Observable<Hermano> {
    return this.http.get<unknown[]>(`${this.baseUrl}/buscar`).pipe(
      map((response) => {
        const found = (response ?? []).find((item) => Number((item as { id?: number }).id) === id);
        return this.normalizeHermano((found as Partial<Hermano>) ?? { id });
      })
    );
  }

  createHermano(payload: UpsertHermanoPayload): Observable<Hermano> {
    const body = {
      nombre: payload.nombre,
      apellidos: this.toApellidos(payload),
      email: payload.email ?? '',
      numeroHermano: payload.numeroHermano ? String(payload.numeroHermano) : ''
    };

    return this.http.post<unknown>(`${this.baseUrl}/guardar`, body).pipe(
      map((response) => this.normalizeHermano(response as Partial<Hermano>))
    );
  }

  updateHermano(id: number, payload: UpsertHermanoPayload): Observable<Hermano> {
    const body = {
      id,
      nombre: payload.nombre,
      apellidos: this.toApellidos(payload),
      email: payload.email ?? '',
      numeroHermano: payload.numeroHermano ? String(payload.numeroHermano) : ''
    };

    return this.http.post<unknown>(`${this.baseUrl}/guardar`, body).pipe(
      map((response) => this.normalizeHermano(response as Partial<Hermano>))
    );
  }

  deleteHermano(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private normalizeHermano(row: Partial<Hermano>): Hermano {
    const apellidosRaw = String(row.apellidos ?? '').trim();
    const [primerApellido = '', ...resto] = apellidosRaw.split(/\s+/).filter(Boolean);
    const segundoApellido = resto.join(' ');

    return {
      id: Number(row.id ?? 0),
      nombre: String(row.nombre ?? ''),
      apellidos: apellidosRaw,
      primer_apellido: String(row.primer_apellido ?? primerApellido),
      segundo_apellido: String(row.segundo_apellido ?? segundoApellido),
      dni: row.dni,
      telefono: row.telefono,
      telefono_movil: row.telefono_movil,
      email: row.email,
      estado: row.estado,
      numeroHermano: this.normalizeNumeroHermano(row.numeroHermano),
      fechaAlta: row.fechaAlta,
      fecha_nacimiento: row.fecha_nacimiento,
      direccion: row.direccion,
      piso_puerta: row.piso_puerta,
      codigo_postal: row.codigo_postal,
      localidad: row.localidad,
      provincia: row.provincia,
      pais: row.pais,
      telefono_fijo: row.telefono_fijo,
      forma_pago: row.forma_pago,
      iban: row.iban,
      titular_cuenta: row.titular_cuenta,
      en_cuotas: row.en_cuotas,
      observaciones: row.observaciones,
      tutor_legal: row.tutor_legal
    };
  }

  private normalizeNumeroHermano(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private toApellidos(payload: UpsertHermanoPayload): string {
    if (payload.apellidos) {
      return payload.apellidos;
    }
    return `${payload.primer_apellido ?? ''} ${payload.segundo_apellido ?? ''}`.trim();
  }

  private filterByQuery(rows: Hermano[], params: HermanosQueryParams): Hermano[] {
    const search = String(params.search ?? '').trim().toLowerCase();
    const estado = String(params.estado ?? '').trim().toLowerCase();

    return rows.filter((row) => {
      if (estado && String(row.estado ?? '').toLowerCase() !== estado) {
        return false;
      }

      if (!search) {
        return true;
      }

      const searchable = [
        row.nombre,
        row.apellidos,
        row.primer_apellido,
        row.segundo_apellido,
        row.dni,
        row.email,
        String(row.numeroHermano ?? '')
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(search);
    });
  }

  private sortRows(rows: Hermano[], params: HermanosQueryParams): Hermano[] {
    const sortDirection = params.sortDirection === 'desc' ? -1 : 1;
    const sortBy = params.sortBy ?? 'primer_apellido';

    const getValue = (row: Hermano): string => {
      if (sortBy === 'primer_apellido' || sortBy === 'apellidos') {
        return `${row.primer_apellido ?? ''} ${row.segundo_apellido ?? ''}`.trim().toLowerCase();
      }

      if (sortBy === 'numeroHermano') {
        return String(row.numeroHermano ?? 0);
      }

      return String(row[sortBy as keyof Hermano] ?? '').toLowerCase();
    };

    return [...rows].sort((a, b) => {
      const left = getValue(a);
      const right = getValue(b);
      if (left < right) {
        return -1 * sortDirection;
      }
      if (left > right) {
        return 1 * sortDirection;
      }
      return 0;
    });
  }
}
