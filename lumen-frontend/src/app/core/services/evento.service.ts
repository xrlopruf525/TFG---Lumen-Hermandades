import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Evento } from '../models/evento.model';

export interface CrearEventoPayload {
  idHermandad?: number;
  titulo: string;
  fechaInicio: string;
  fechaFin?: string | null;
  lugar?: string | null;
  tipoEvento?: string | null;
}

export interface HermanoInscripcionEvento {
  idHermano: number;
  numeroHermano: number | null;
  nombreCompleto: string;
  inscrito: boolean;
}

export interface GuardarInscripcionesPayload {
  inscribirTodos: boolean;
  hermanoIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly baseUrl = `${environment.apiUrl}/eventos`;

  constructor(private readonly http: HttpClient) {}

  obtenerTodosLosEventos(): Observable<Evento[]> {
    return this.http.get<unknown[]>(this.baseUrl).pipe(
      map((response) => (response ?? []).map((item) => this.normalizeEvento(item as Partial<Evento>)))
    );
  }

  crearEvento(payload: CrearEventoPayload): Observable<Evento> {
    const body = {
      idHermandad: payload.idHermandad ?? 1,
      titulo: payload.titulo,
      fechaInicio: payload.fechaInicio,
      fechaFin: payload.fechaFin ?? payload.fechaInicio,
      lugar: payload.lugar ?? null,
      tipoEvento: payload.tipoEvento ?? null,
      deleted: false
    };

    return this.http.post<unknown>(this.baseUrl, body).pipe(
      map((response) => this.normalizeEvento(response as Partial<Evento>))
    );
  }

  obtenerInscripcionesEvento(idEvento: number): Observable<HermanoInscripcionEvento[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/${idEvento}/inscripciones`).pipe(
      map((response) => (response ?? []).map((row) => this.normalizeHermanoInscripcion(row as Partial<HermanoInscripcionEvento>)))
    );
  }

  guardarInscripcionesEvento(idEvento: number, payload: GuardarInscripcionesPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${idEvento}/inscripciones`, payload);
  }

  private normalizeEvento(row: Partial<Evento>): Evento {
    const rowData = row as Partial<Evento> & Record<string, unknown>;

    return {
      idEvento: Number(rowData.idEvento ?? 0),
      idHermandad: Number(rowData.idHermandad ?? 0),
      titulo: String(rowData.titulo ?? ''),
      fechaInicio: (rowData.fechaInicio as string | Date | undefined) ?? '',
      fechaFin: (rowData.fechaFin as string | Date | null | undefined) ?? null,
      lugar: (rowData.lugar as string | null | undefined) ?? null,
      tipoEvento: (rowData.tipoEvento as string | null | undefined) ?? null,
      deleted: Boolean(rowData.deleted ?? false),
      googleCalendarUrl: (rowData.googleCalendarUrl as string | null | undefined) ?? null
    };
  }

  private normalizeHermanoInscripcion(row: Partial<HermanoInscripcionEvento>): HermanoInscripcionEvento {
    const rowData = row as Partial<HermanoInscripcionEvento> & Record<string, unknown>;

    return {
      idHermano: Number(rowData.idHermano ?? 0),
      numeroHermano: rowData.numeroHermano === null || rowData.numeroHermano === undefined
        ? null
        : Number(rowData.numeroHermano),
      nombreCompleto: String(rowData.nombreCompleto ?? ''),
      inscrito: Boolean(rowData.inscrito ?? false)
    };
  }
}
