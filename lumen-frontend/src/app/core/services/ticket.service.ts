import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CrearTicketPayload, Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly baseUrl = `${environment.apiUrl}/tickets`;

  constructor(private readonly http: HttpClient) {}

  obtenerTicketsRecientes(): Observable<Ticket[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/recientes`).pipe(
      map((response) => (response ?? []).map((item) => this.normalizeTicket(item as Partial<Ticket>)))
    );
  }

  obtenerTodosLosTickets(): Observable<Ticket[]> {
    return this.http.get<unknown[]>(this.baseUrl).pipe(
      map((response) => (response ?? []).map((item) => this.normalizeTicket(item as Partial<Ticket>)))
    );
  }

  crearTicket(payload: CrearTicketPayload): Observable<Ticket> {
    return this.http.post<unknown>(this.baseUrl, payload).pipe(
      map((response) => this.normalizeTicket(response as Partial<Ticket>))
    );
  }

  descargarTicketPdf(idTicket: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${idTicket}/pdf`, { responseType: 'blob' });
  }

  private normalizeTicket(row: Partial<Ticket>): Ticket {
    const rowData = row as Partial<Ticket> & Record<string, unknown>;

    return {
      idTicket: Number(rowData.idTicket ?? 0),
      idHermano: Number(rowData.idHermano ?? 0),
      idEvento: rowData.idEvento === null || rowData.idEvento === undefined ? null : Number(rowData.idEvento),
      concepto: String(rowData.concepto ?? ''),
      importe: Number(rowData.importe ?? 0),
      fechaEmision: (rowData.fechaEmision as string | Date | undefined) ?? '',
      urlPdf: (rowData.urlPdf as string | null | undefined) ?? null,
      deleted: Boolean(rowData.deleted ?? false),
      nombreHermano: String(rowData.nombreHermano ?? ''),
      tituloEvento: String(rowData.tituloEvento ?? '')
    };
  }
}
