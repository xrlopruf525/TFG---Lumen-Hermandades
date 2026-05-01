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

export type HermanoUpsertPayload = UpsertHermanoPayload;

export interface ImportarHermanosResponse {
  totalLeidos: number;
  importados: number;
  errores: number;
  detalleErrores: string[];
}

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
    return this.http.get<unknown[]>(`${this.baseUrl}`).pipe(
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
    return this.http.get<unknown>(`${this.baseUrl}/${id}`).pipe(
      map((response) => this.normalizeHermano(response as Partial<Hermano>))
    );
  }

  getMiPerfil(): Observable<Hermano> {
    return this.getPortalHermano().pipe(
      map((profile) => this.normalizePortalProfileAsHermano(profile))
    );
  }

  getPortalHermano(): Observable<PortalHermanoProfile> {
    return this.http.get<unknown>(this.portalUrl).pipe(
      map((response) => this.normalizePortalHermano(response as Partial<PortalHermanoProfile>))
    );
  }

  createHermano(payload: UpsertHermanoPayload): Observable<Hermano> {
    const body = this.toBackendPayload(payload);

    return this.http.post<unknown>(`${this.baseUrl}`, body).pipe(
      map((response) => this.normalizeHermano(response as Partial<Hermano>))
    );
  }

  importarHermanos(hermanos: UpsertHermanoPayload[]): Observable<ImportarHermanosResponse> {
    const body = hermanos.map((hermano) => this.toBackendPayload(hermano));

    return this.http.post<ImportarHermanosResponse>(`${this.baseUrl}/importar`, body);
  }

  updateHermano(id: number, payload: UpsertHermanoPayload): Observable<Hermano> {
    const body = this.toBackendPayload(payload);

    return this.http.put<unknown>(`${this.baseUrl}/${id}`, body).pipe(
      map((response) => this.normalizeHermano(response as Partial<Hermano>))
    );
  }

  deleteHermano(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/baja-logica`, {});
  }

  private normalizeHermano(row: Partial<Hermano>): Hermano {
    const rowData = row as Partial<Hermano> & Record<string, unknown>;
    const apellidosRaw = String(rowData['apellidos'] ?? `${String(rowData['primerApellido'] ?? '')} ${String(rowData['segundoApellido'] ?? '')}`).trim();
    const [primerApellido = '', ...resto] = apellidosRaw.split(/\s+/).filter(Boolean);
    const segundoApellido = resto.join(' ');

    return {
      id: Number(rowData.id ?? 0),
      nombre: String(rowData.nombre ?? ''),
      primerApellido: String(rowData['primerApellido'] ?? rowData['primer_apellido'] ?? primerApellido),
      segundoApellido: String(rowData['segundoApellido'] ?? rowData['segundo_apellido'] ?? segundoApellido),
      nif: (rowData['nif'] as string | undefined) ?? (rowData['dni'] as string | undefined),
      telefonoMovil: (rowData['telefonoMovil'] as string | undefined) ?? (rowData['telefono_movil'] as string | undefined) ?? (rowData['telefono'] as string | undefined),
      email: rowData.email as string | undefined,
      estado: rowData.estado as string | undefined,
      numeroHermano: this.normalizeNumeroHermano(rowData.numeroHermano),
      fechaAlta: (rowData.fechaAlta as string | Date | undefined) ?? (rowData['fecha_alta'] as string | Date | undefined),
      fechaNacimiento: (rowData['fechaNacimiento'] as string | Date | undefined) ?? (rowData['fecha_nacimiento'] as string | Date | undefined),
      pisoPuerta: (rowData['pisoPuerta'] as string | undefined) ?? (rowData['piso_puerta'] as string | undefined),
      codigoPostal: (rowData['codigoPostal'] as string | undefined) ?? (rowData['codigo_postal'] as string | undefined),
      poblacion: (rowData['poblacion'] as string | undefined) ?? (rowData['localidad'] as string | undefined),
      telefonoFijo: (rowData['telefonoFijo'] as string | undefined) ?? (rowData['telefono_fijo'] as string | undefined),
      formaPago: (rowData['formaPago'] as  string | undefined) ?? (rowData['forma_pago'] as string | undefined),
      titularCuenta: (rowData['titularCuenta'] as string | undefined) ?? (rowData['titular_cuenta'] as string | undefined),
      enCuotas: (rowData['enCuotas'] as boolean | undefined) ?? (rowData['en_cuotas'] as boolean | undefined),
      tutorLegal: (rowData['tutorLegal'] as string | undefined) ?? (rowData['tutor_legal'] as string | undefined)
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
      estado: row.estado ? String(row.estado) : null
    };
  }

  private normalizePortalProfileAsHermano(profile: PortalHermanoProfile): Hermano {
    const parts = String(profile.nombreCompleto ?? '').trim().split(/\s+/).filter(Boolean);
    const [nombre = '', ...apellidos] = parts;

    return {
      id: profile.id,
      nombre,
      primerApellido: apellidos[0] ?? '',
      segundoApellido: apellidos.slice(1).join(' '),
      email: profile.email ?? '',
      numeroHermano: profile.numeroHermano ?? undefined,
      fechaAlta: profile.fechaAlta ?? ''
    };
  }

  private normalizePortalNumeroHermano(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private normalizeNumeroHermano(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private toApellidos(payload: UpsertHermanoPayload): string {
    return `${payload.primerApellido ?? ''} ${payload.segundoApellido ?? ''}`.trim();
  }

  private toBackendPayload(payload: UpsertHermanoPayload): Record<string, unknown> {
    const row = payload as UpsertHermanoPayload & Record<string, unknown>;
    const nombre = String(payload.nombre ?? '').trim();
    const primerApellido = String(payload.primerApellido?? '').trim();
    const segundoApellido = String(payload.segundoApellido?? '').trim();

    return {
      idHermandad: this.toPositiveInt(row['idHermandad']) ?? this.defaultHermandadId,
      numeroHermano: this.toPositiveInt(payload.numeroHermano),
      nif: String(payload.nif?? row['nif'] ?? '').trim(),
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento: row['fechaNacimiento'] ?? row['fecha_nacimiento'] ?? null,
      direccion: String(payload.direccion ?? '').trim() || null,
      numero: String(row['numero'] ?? '').trim() || null,
      pisoPuerta: String(payload.pisoPuerta ?? '').trim() || null,
      codigoPostal: String(payload.codigoPostal ?? '').trim() || null,
      poblacion: String(payload.poblacion ?? row['poblacion'] ?? '').trim() || null,
      provincia: String(payload.provincia ?? '').trim() || null,
      pais: String(payload.pais ?? '').trim() || null,
      telefonoMovil: String(payload.telefonoMovil ?? '').trim() || null,
      telefonoFijo: String(payload.telefonoFijo ?? '').trim() || null,
      email: String(payload.email ?? '').trim() || null,
      fechaAlta: row.fechaAlta ?? row['fecha_alta'] ?? null,
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
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }

    return Math.trunc(parsed);
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
    if (sortBy === 'primerApellido') {
      return `${row.primerApellido ?? ''} ${row.segundoApellido ?? ''}`.trim().toLowerCase();
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
