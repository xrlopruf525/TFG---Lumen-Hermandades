import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Hermano } from '../models/hermano.model';

@Injectable({
  providedIn: 'root'
})
export class HermanoService {
  private readonly baseUrl = `${environment.apiUrl}/hermanos`;

  constructor(private readonly http: HttpClient) {}

  getHermanos(): Observable<Hermano[]> {
    return this.http.get<Hermano[]>(this.baseUrl);
  }
}
