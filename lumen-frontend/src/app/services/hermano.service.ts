import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Hermano } from '../models/hermano.model';

export interface HermanoUpsertPayload {
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

  getHermanoById(id: number): Observable<Hermano> {
    return this.http.get<Hermano>(`${this.baseUrl}/${id}`);
  }

  createHermano(hermano: HermanoUpsertPayload): Observable<Hermano> {
    return this.http.post<Hermano>(`${this.baseUrl}/guardar`, hermano);
  }

  updateHermano(id: number, hermano: HermanoUpsertPayload): Observable<Hermano> {
    return this.http.put<Hermano>(`${this.baseUrl}/${id}`, hermano);
  }
}
