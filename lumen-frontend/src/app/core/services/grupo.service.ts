import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hermano } from '../../models/hermano.model';

export interface Grupo {
  id?: number;
  nombre: string;
  tipo?: string;
  descripcion?: string;
  deleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private apiUrl = `${environment.apiUrl}/grupos`;

  constructor(private http: HttpClient) { }

  listarGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.apiUrl);
  }

  obtenerGrupo(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.apiUrl}/${id}`);
  }

  crearGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(this.apiUrl, grupo);
  }

  actualizarGrupo(id: number, grupo: Grupo): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.apiUrl}/${id}`, grupo);
  }

  eliminarGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerHermanosDelGrupo(idGrupo: number): Observable<Hermano[]> {
    return this.http.get<Hermano[]>(`${this.apiUrl}/${idGrupo}/hermanos`);
  }

  agregarHermanoAlGrupo(idGrupo: number, idHermano: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idGrupo}/hermanos/${idHermano}`, {});
  }

  quitarHermanoDelGrupo(idGrupo: number, idHermano: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idGrupo}/hermanos/${idHermano}`);
  }
}
