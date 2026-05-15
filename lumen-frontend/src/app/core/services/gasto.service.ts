import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Gasto } from '../models/gasto.model';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private readonly baseUrl = `${environment.apiUrl}/gastos`;

  constructor(private readonly http: HttpClient) {}

  obtenerTodosLosGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.baseUrl);
  }

  crearGasto(payload: Omit<Gasto, 'idGasto'>): Observable<Gasto> {
    return this.http.post<Gasto>(this.baseUrl, payload);
  }
}
