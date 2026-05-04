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
    const apellidosRaw = String(rowData['apellidos'] ?? `${String(rowData['primer_apellido'] ?? '')} ${String(rowData['segundo_apellido'] ?? '')}`).trim();
    const [primerApellido = '', ...resto] = apellidosRaw.split(/\s+/).filter(Boolean);
    const segundoApellido = resto.join(' ');

    return {
      id: Number(rowData.id ?? 0),
      nombre: String(rowData.nombre ?? ''),
      primer_apellido: String(rowData['primer_apellido'] ?? rowData['primerApellido'] ?? primerApellido),
      segundo_apellido: String(rowData['segundo_apellido'] ?? rowData['segundoApellido'] ?? segundoApellido),
      dni: (rowData['dni'] as string | undefined) ?? (rowData['nif'] as string | undefined),
      telefono_movil: (rowData['telefono_movil'] as string | undefined) ?? (rowData['telefonoMovil'] as string | undefined) ?? (rowData['telefono'] as string | undefined),
      email: rowData.email as string | undefined,
      estado: rowData.estado as string | undefined,
      numeroHermano: this.normalizeNumeroHermano(rowData.numeroHermano),
      fechaAlta: (rowData['fecha_alta'] as string | Date | undefined) ?? (rowData['fechaAlta'] as string | Date | undefined),
      fecha_nacimiento: (rowData['fecha_nacimiento'] as string | Date | undefined) ?? (rowData['fechaNacimiento'] as string | Date | undefined),
      piso_puerta: (rowData['piso_puerta'] as string | undefined) ?? (rowData['pisoPuerta'] as string | undefined),
      codigo_postal: (rowData['codigo_postal'] as string | undefined) ?? (rowData['codigoPostal'] as string | undefined),
      localidad: (rowData['localidad'] as string | undefined) ?? (rowData['poblacion'] as string | undefined),
      telefono_fijo: (rowData['telefono_fijo'] as string | undefined) ?? (rowData['telefonoFijo'] as string | undefined),
      forma_pago: (rowData['forma_pago'] as  string | undefined) ?? (rowData['formaPago'] as string | undefined),
      titular_cuenta: (rowData['titular_cuenta'] as string | undefined) ?? (rowData['titularCuenta'] as string | undefined),
      en_cuotas: (rowData['en_cuotas'] as boolean | undefined) ?? (rowData['enCuotas'] as boolean | undefined),
      tutor_legal: (rowData['tutor_legal'] as string | undefined) ?? (rowData['tutorLegal'] as string | undefined),
      direccion: rowData.direccion as string | undefined,
      provincia: rowData.provincia as string | undefined,
      pais: rowData.pais as string | undefined,
      iban: rowData.iban as string | undefined,
      observaciones: rowData.observaciones as string | undefined,
      telefono: rowData.telefono as string | undefined,
      apellidos: rowData.apellidos as string | undefined
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
      primer_apellido: apellidos[0] ?? '',
      segundo_apellido: apellidos.slice(1).join(' '),
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
    return `${payload.primer_apellido ?? ''} ${payload.segundo_apellido ?? ''}`.trim();
  }

  private toBackendPayload(payload: UpsertHermanoPayload): Record<string, unknown> {
    const row = payload as UpsertHermanoPayload & Record<string, unknown>;
    const nombre = String(payload.nombre ?? '').trim();
    const primerApellido = String(payload.primer_apellido?? '').trim();
    const segundoApellido = String(payload.segundo_apellido?? '').trim();

    return {
      idHermandad: this.toPositiveInt(row['idHermandad']) ?? this.defaultHermandadId,
      numeroHermano: this.toPositiveInt(payload.numeroHermano),
      nif: String(payload.dni?? row['dni'] ?? row['nif'] ?? '').trim(),
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento: row['fecha_nacimiento'] ?? row['fechaNacimiento'] ?? null,
      direccion: String(payload.direccion ?? '').trim() || null,
      numero: String(row['numero'] ?? '').trim() || null,
      pisoPuerta: String(payload.piso_puerta ?? '').trim() || null,
      codigoPostal: String(payload.codigo_postal ?? '').trim() || null,
      poblacion: String(payload.localidad ?? row['localidad'] ?? '').trim() || null,
      provincia: String(payload.provincia ?? '').trim() || null,
      pais: String(payload.pais ?? '').trim() || null,
      telefonoMovil: String(payload.telefono_movil ?? '').trim() || null,
      telefonoFijo: String(payload.telefono_fijo ?? '').trim() || null,
      email: String(payload.email ?? '').trim() || null,
      fechaAlta: row['fecha_alta'] ?? row.fechaAlta ?? null,
      estado: String(payload.estado ?? 'ACTIVO').trim() || 'ACTIVO',
      formaPago: String(payload.forma_pago ?? '').trim() || null,
      iban: String(payload.iban ?? '').trim() || null,
      titularCuenta: String(payload.titular_cuenta ?? '').trim() || null,
      enCuotas: payload.en_cuotas ?? false,
      observaciones: String(payload.observaciones ?? '').trim() || null,
      tutorLegal: String(payload.tutor_legal ?? '').trim() || null,
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
    if (sortBy === 'primer_apellido') {
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
