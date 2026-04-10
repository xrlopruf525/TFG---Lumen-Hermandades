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
  private readonly authUserIdKey = 'auth_user_id';

  constructor(private readonly http: HttpClient) {}

  login(usuario: string, password: string): Observable<string> {
    if (environment.enableDevAuthBypass) {
      const devToken = `dev-token-${usuario || 'user'}`;
      localStorage.setItem(this.tokenKey, devToken);
      const parsedId = Number(usuario);
      if (!Number.isNaN(parsedId) && parsedId > 0) {
        localStorage.setItem(this.authUserIdKey, String(parsedId));
      }

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
    localStorage.removeItem(this.authUserIdKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthenticatedHermanoId(): number | null {
    const stored = localStorage.getItem(this.authUserIdKey);
    if (stored) {
      const parsedStored = Number(stored);
      if (!Number.isNaN(parsedStored) && parsedStored > 0) {
        return parsedStored;
      }
    }

    if (environment.enableDevAuthBypass) {
      const token = this.getToken();
      const match = token?.match(/dev-token-(\d+)/);
      if (match?.[1]) {
        const parsedFromToken = Number(match[1]);
        if (!Number.isNaN(parsedFromToken) && parsedFromToken > 0) {
          return parsedFromToken;
        }
      }

      const fallback = Number(environment.simulatedHermanoId);
      if (!Number.isNaN(fallback) && fallback > 0) {
        return fallback;
      }
    }

    return null;
  }
}
