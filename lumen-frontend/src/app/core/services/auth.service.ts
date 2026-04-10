import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

interface LoginRequest {
  usuario: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';

  constructor(private readonly http: HttpClient) {}

  login(usuario: string, password: string): Observable<string> {
    if (environment.enableDevAuthBypass) {
      const devToken = `dev-token-${usuario || 'user'}`;
      localStorage.setItem(this.tokenKey, devToken);
      return new Observable<string>((subscriber) => {
        subscriber.next(devToken);
        subscriber.complete();
      });
    }

    const payload: LoginRequest = { usuario, password };

    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, payload).pipe(
      map((response) => response?.token ?? ''),
      tap((token) => {
        if (!token) {
          throw new Error('No se recibio token JWT en la respuesta de login');
        }
        localStorage.setItem(this.tokenKey, token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
