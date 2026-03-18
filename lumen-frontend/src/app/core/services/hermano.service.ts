import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Hermano } from '../models/hermano.model';
import { environment } from '../../../environments/environment';

export interface GuardarHermanoRequest {
  nombre: string;
  apellidos: string;
  email: string;
  numeroHermano: string;
}

@Injectable({
  providedIn: 'root'
})
export class HermanoService {
  private readonly baseUrl = `${environment.apiUrl}/hermanos`;

  constructor(private readonly http: HttpClient) {}

  getHermanos(): Observable<Hermano[]> {
    return this.http.get<Hermano[]>(`${this.baseUrl}/buscar`);
  }

  saveHermano(hermano: GuardarHermanoRequest): Observable<Hermano> {
    return this.http.post<Hermano>(`${this.baseUrl}/guardar`, hermano);
  }

  deleteHermano(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
