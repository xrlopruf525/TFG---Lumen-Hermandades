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
import { Cuota } from '../core/models/cuota.model';

export type HermanoUpsertPayload = UpsertHermanoPayload;

export interface PortalHermanoProfile {
  id: number;
  nombreCompleto: string;
  numeroHermano: number | null;
  email: string | null;
  telefonoMovil: string | null;
  direccionCompleta: string | null;
  nif: string | null;
  fechaAlta: string | Date | null;
  estado: string | null;
  grupos: Array<{ idGrupo: number; nombre: string; numeroMiembros: number }> | null;
  cuotas?: Cuota[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class HermanoService {
  private readonly baseUrl = `${environment.apiUrl}/hermanos`;
  private readonly portalUrl = `${environment.apiUrl}/hermano/me`;
  private readonly defaultHermandadId = 1;

  constructor(private readonly http: HttpClient) {}

  getHermanos(params: HermanosQueryParams): Observable<PaginatedResponse<Hermano>> {
    return this.http.get<Hermano[]>(`${this.baseUrl}`).pipe(
      map((response) => {
        const normalized = (response ?? []).map((item) => this.normalizeHermano(item));
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
    return this.http.get<Hermano>(`${this.baseUrl}/${id}`).pipe(
      map((response) => this.normalizeHermano(response))
    );
  }

  getMiPerfil(): Observable<Hermano> {
    return this.getPortalHermano().pipe(
      map((profile) => this.normalizePortalProfileAsHermano(profile))
    );
  }

  getPortalHermano(): Observable<PortalHermanoProfile> {
    return this.http.get<PortalHermanoProfile>(this.portalUrl).pipe(
      map((response) => this.normalizePortalHermano(response))
    );
  }

  createHermano(payload: UpsertHermanoPayload): Observable<Hermano> {
    const body = this.toBackendPayload(payload);
    return this.http.post<Hermano>(`${this.baseUrl}`, body).pipe(
      map((response) => this.normalizeHermano(response))
    );
  }

  updateHermano(id: number, payload: UpsertHermanoPayload): Observable<Hermano> {
    const body = this.toBackendPayload(payload);
    return this.http.put<Hermano>(`${this.baseUrl}/${id}`, body).pipe(
      map((response) => this.normalizeHermano(response))
    );
  }

  importarHermanos(payload: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/importar`, payload);
  }

  deleteHermano(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/baja-logica`, {});
  }

  private normalizeHermano(row: Partial<Hermano>): Hermano {
    const primerApellido = String(row.primerApellido ?? '').trim();
    const segundoApellido = String(row.segundoApellido ?? '').trim();
    const apellidosCalculados = `${primerApellido} ${segundoApellido}`.trim();

    return {
      id: Number(row.id ?? 0),
      idHermandad: Number(row.idHermandad ?? this.defaultHermandadId),
      nombre: String(row.nombre ?? ''),
      primerApellido,
      segundoApellido,
      apellidos: apellidosCalculados,
      nif: String(row.nif ?? ''),
      telefonoMovil: row.telefonoMovil,
      telefonoFijo: row.telefonoFijo,
      email: row.email,
      estado: row.estado,
      numeroHermano: this.normalizeNumeroHermano(row.numeroHermano),
      fechaAlta: row.fechaAlta,
      fechaBaja: row.fechaBaja,
      fechaNacimiento: row.fechaNacimiento,
      direccion: row.direccion,
      numero: row.numero,
      pisoPuerta: row.pisoPuerta,
      codigoPostal: row.codigoPostal,
      poblacion: row.poblacion,
      provincia: row.provincia,
      pais: row.pais,
      formaPago: row.formaPago,
      iban: row.iban,
      titularCuenta: row.titularCuenta,
      enCuotas: !!row.enCuotas,
      observaciones: row.observaciones,
      tutorLegal: row.tutorLegal,
      deleted: !!row.deleted
    };
  }

  private normalizePortalHermano(row: Partial<PortalHermanoProfile>): PortalHermanoProfile {
    return {
      id: Number(row.id ?? 0),
      nombreCompleto: String(row.nombreCompleto ?? ''),
      numeroHermano: this.normalizePortalNumeroHermano(row.numeroHermano),
      email: row.email ? String(row.email) : null,
      telefonoMovil: row.telefonoMovil ? String(row.telefonoMovil) : null,
      direccionCompleta: row.direccionCompleta ? String(row.direccionCompleta) : null,
      nif: row.nif ? String(row.nif) : null,
      fechaAlta: row.fechaAlta ?? null,
      estado: row.estado ? String(row.estado) : null,
      grupos: row.grupos ?? null,
      cuotas: row.cuotas ?? null
    };
  }

  private normalizePortalProfileAsHermano(profile: PortalHermanoProfile): Hermano {
    const parts = String(profile.nombreCompleto ?? '').trim().split(/\s+/).filter(Boolean);
    const [nombre = '', ...apellidos] = parts;
    const primerApellido = apellidos[0] ?? '';
    const segundoApellido = apellidos.slice(1).join(' ');

    return {
      id: profile.id,
      idHermandad: this.defaultHermandadId,
      nombre,
      primerApellido,
      segundoApellido,
      apellidos: apellidos.join(' '),
      email: profile.email ?? undefined,
      numeroHermano: profile.numeroHermano ?? undefined,
      fechaAlta: profile.fechaAlta ?? undefined,
      nif: profile.nif ?? ''
    };
  }

  private normalizePortalNumeroHermano(value: unknown): number | null {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private normalizeNumeroHermano(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private toBackendPayload(payload: UpsertHermanoPayload): Record<string, unknown> {
    return {
      idHermandad: this.toPositiveInt(payload.idHermandad) ?? this.defaultHermandadId,
      numeroHermano: this.toPositiveInt(payload.numeroHermano),
      nif: String(payload.nif ?? '').trim(),
      nombre: String(payload.nombre ?? '').trim(),
      primerApellido: String(payload.primerApellido ?? '').trim(),
      segundoApellido: String(payload.segundoApellido ?? '').trim() || null,
      fechaNacimiento: payload.fechaNacimiento ?? null,
      direccion: String(payload.direccion ?? '').trim() || null,
      numero: String(payload.numero ?? '').trim() || null,
      pisoPuerta: String(payload.pisoPuerta ?? '').trim() || null,
      codigoPostal: String(payload.codigoPostal ?? '').trim() || null,
      poblacion: String(payload.poblacion ?? '').trim() || null,
      provincia: String(payload.provincia ?? '').trim() || null,
      pais: String(payload.pais ?? '').trim() || null,
      telefonoMovil: String(payload.telefonoMovil ?? '').trim() || null,
      telefonoFijo: String(payload.telefonoFijo ?? '').trim() || null,
      email: String(payload.email ?? '').trim() || null,
      fechaAlta: payload.fechaAlta ?? null,
      fechaBaja: payload.fechaBaja ?? null,
      estado: String(payload.estado ?? 'ACTIVO').trim() || 'ACTIVO',
      formaPago: String(payload.formaPago ?? '').trim() || null,
      iban: String(payload.iban ?? '').trim() || null,
      titularCuenta: String(payload.titularCuenta ?? '').trim() || null,
      enCuotas: payload.enCuotas ?? false,
      observaciones: String(payload.observaciones ?? '').trim() || null,
      tutorLegal: String(payload.tutorLegal ?? '').trim() || null,
      deleted: false
    };
  }

  private toPositiveInt(value: unknown): number | null {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return Math.trunc(parsed);
  }

  private filterByQuery(rows: Hermano[], params: HermanosQueryParams): Hermano[] {
    const search = String(params.search ?? '').trim().toLowerCase();
    const estado = String(params.estado ?? '').trim().toLowerCase();

    return rows.filter((row) => {
      if (estado && String(row.estado ?? '').toLowerCase() !== estado) {
        return false;
      }

      if (!search) return true;

      const searchable = [
        row.nombre,
        row.apellidos,
        row.primerApellido,
        row.segundoApellido,
        row.nif,
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
    const sortBy = params.sortBy ?? 'primerApellido';

    const getValue = (row: Hermano): string => {
      if (sortBy === 'primerApellido' || sortBy === 'apellidos') {
        return `${row.primerApellido ?? ''} ${row.segundoApellido ?? ''}`.trim().toLowerCase();
      }

      if (sortBy === 'numeroHermano') {
        return String(row.numeroHermano ?? 0).padStart(10, '0');
      }

      return String(row[sortBy as keyof Hermano] ?? '').toLowerCase();
    };

    return [...rows].sort((a, b) => {
      const left = getValue(a);
      const right = getValue(b);
      if (left < right) return -1 * sortDirection;
      if (left > right) return 1 * sortDirection;
      return 0;
    });
  }
}