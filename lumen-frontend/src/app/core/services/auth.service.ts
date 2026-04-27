import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface LoginCredentials {
  email: string;
  password: string;
  hermandad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly authUserIdKey = 'auth_user_id';
  private readonly loginEndpoint = `${environment.apiUrl}/auth/login`;

  constructor(private readonly http: HttpClient) {}

  // Realiza el login contra la API y almacena el JWT para el resto de peticiones.
  login(credentials: LoginCredentials): Observable<string> {
    if (environment.enableDevAuthBypass) {
      const devToken = `dev-token-${credentials.email || 'user'}`;
      localStorage.setItem(this.tokenKey, devToken);
      const parsedId = Number(credentials.email);
      if (!Number.isNaN(parsedId) && parsedId > 0) {
        localStorage.setItem(this.authUserIdKey, String(parsedId));
      }

      return new Observable<string>((subscriber) => {
        subscriber.next(devToken);
        subscriber.complete();
      });
    }

    // Punto unico para adaptar rapidamente el contrato de login si el backend lo requiere.
    const payload = {
      email: credentials.email,
      password: credentials.password,
      hermandad: credentials.hermandad
    };

    return this.http.post<unknown>(this.loginEndpoint, payload).pipe(
      map((response) => {
        const token = this.extractToken(response);
        if (!token) {
          throw new Error('No se encontro un token JWT en la respuesta del backend.');
        }

        localStorage.setItem(this.tokenKey, token);
        return token;
      }),
      catchError((error: HttpErrorResponse | Error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return throwError(() => error);
        }

        return throwError(() => error);
      })
    );
  }

  // Elimina toda la sesion local del frontend.
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

  // Permite reutilizar el id del hermano autenticado en vistas como "Mi perfil".
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

  private extractToken(response: unknown): string | null {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const data = response as Record<string, unknown>;
    const directToken = data['token'] ?? data['accessToken'] ?? data['jwt'];
    if (typeof directToken === 'string' && directToken.trim()) {
      return directToken;
    }

    const nestedData = data['data'];
    if (nestedData && typeof nestedData === 'object') {
      const nestedToken = (nestedData as Record<string, unknown>)['token'];
      if (typeof nestedToken === 'string' && nestedToken.trim()) {
        return nestedToken;
      }
    }

    return null;
  }
}
