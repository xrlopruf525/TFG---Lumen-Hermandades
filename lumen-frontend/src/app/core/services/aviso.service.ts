import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AvisoRequest {
  tipoDestinatario: 'HERMANO' | 'GRUPO' | 'TODOS';
  idHermano?: number;
  idGrupo?: number;
  asunto: string;
  mensaje: string;
}

export interface AvisoResponse {
  mensaje: string;
  totalEnviados: number;
}

@Injectable({
  providedIn: 'root'
})
export class AvisoService {
  private apiUrl = `${environment.apiUrl}/avisos`;

  constructor(private http: HttpClient) { }

  enviarAviso(aviso: AvisoRequest): Observable<AvisoResponse> {
    return this.http.post<AvisoResponse>(`${this.apiUrl}/enviar`, aviso);
  }
}
