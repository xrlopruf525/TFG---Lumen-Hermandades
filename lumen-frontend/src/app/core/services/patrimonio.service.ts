import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patrimonio, CategoriaPatrimonio, ImagenPatrimonio } from '../models/patrimonio.model';

@Injectable({
  providedIn: 'root'
})
export class PatrimonioService {
  private readonly baseUrl = `${environment.apiUrl}/patrimonio`;
  private readonly categoriasUrl = `${environment.apiUrl}/categorias-patrimonio`;

  constructor(private readonly http: HttpClient) {}

  // CRUD Patrimonio
  obtenerTodosLosPatrimonios(): Observable<Patrimonio[]> {
    return this.http.get<Patrimonio[]>(this.baseUrl);
  }

  obtenerPatrimonioPorId(id: number): Observable<Patrimonio> {
    return this.http.get<Patrimonio>(`${this.baseUrl}/${id}`);
  }

  crearPatrimonio(patrimonio: Omit<Patrimonio, 'idPatrimonio'>): Observable<Patrimonio> {
    return this.http.post<Patrimonio>(this.baseUrl, patrimonio);
  }

  actualizarPatrimonio(id: number, patrimonio: Partial<Patrimonio>): Observable<Patrimonio> {
    return this.http.put<Patrimonio>(`${this.baseUrl}/${id}`, patrimonio);
  }

  eliminarPatrimonio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Categorías
  obtenerCategorias(): Observable<CategoriaPatrimonio[]> {
    return this.http.get<CategoriaPatrimonio[]>(this.categoriasUrl);
  }

  // Imágenes
  subirImagenes(patrimonioId: number, archivos: File[]): Observable<ImagenPatrimonio[]> {
    const formData = new FormData();
    archivos.forEach(archivo => {
      formData.append('archivos', archivo);
    });
    return this.http.post<ImagenPatrimonio[]>(`${this.baseUrl}/${patrimonioId}/imagenes`, formData);
  }

  eliminarImagen(imagenId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/imagenes/${imagenId}`);
  }
}
