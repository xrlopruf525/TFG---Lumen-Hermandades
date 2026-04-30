import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

interface LoginResponsePayload {
  token?: string;
  accessToken?: string;
  jwt?: string;
  username?: string;
  role?: string;
  data?: {
    token?: string;
    username?: string;
    role?: string;
  };
}

export interface AuthUser {
  username: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  hermandad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly authUserKey = 'auth_user';
  private readonly authUserIdKey = 'auth_user_id';
  private readonly loginEndpoint = `${environment.apiUrl}/auth/login`;

  constructor(private readonly http: HttpClient) {}

  // Realiza el login contra la API y almacena el JWT para el resto de peticiones.
  login(credentials: LoginCredentials): Observable<string> {
    if (environment.enableDevAuthBypass) {
      const devToken = `dev-token-${credentials.username || 'user'}`;
      localStorage.setItem(this.tokenKey, devToken);
      localStorage.setItem(this.authUserKey, JSON.stringify({ username: credentials.username || 'user', role: 'ADMIN' }));
      const parsedId = Number(credentials.username);
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
      username: credentials.username,
      password: credentials.password,
      hermandad: credentials.hermandad
    };

    return this.http.post<LoginResponsePayload>(this.loginEndpoint, payload).pipe(
      map((response) => {
        const token = this.extractToken(response);
        if (!token) {
          throw new Error('No se encontro un token JWT en la respuesta del backend.');
        }

        localStorage.setItem(this.tokenKey, token);
        const username = this.extractUsername(response) ?? credentials.username;
        const role = this.extractRole(response) ?? 'ADMIN';
        localStorage.setItem(this.authUserKey, JSON.stringify({ username, role }));

        const parsedId = Number(username);
        if (!Number.isNaN(parsedId) && parsedId > 0) {
          localStorage.setItem(this.authUserIdKey, String(parsedId));
        }

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
    localStorage.removeItem(this.authUserKey);
    localStorage.removeItem(this.authUserIdKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): AuthUser | null {
    const stored = localStorage.getItem(this.authUserKey);
    if (!stored) {
      return null;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<AuthUser>;
      if (typeof parsed.username === 'string' && typeof parsed.role === 'string') {
        return { username: parsed.username, role: parsed.role };
      }
    } catch {
      return null;
    }

    return null;
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

  private extractToken(response: LoginResponsePayload): string | null {
    const directToken = response.token ?? response.accessToken ?? response.jwt;
    if (typeof directToken === 'string' && directToken.trim()) {
      return directToken;
    }

    if (typeof response.data?.token === 'string' && response.data.token.trim()) {
      return response.data.token;
    }

    return null;
  }

  private extractUsername(response: LoginResponsePayload): string | null {
    if (typeof response.username === 'string' && response.username.trim()) {
      return response.username.trim();
    }

    if (typeof response.data?.username === 'string' && response.data.username.trim()) {
      return response.data.username.trim();
    }

    return null;
  }

  private extractRole(response: LoginResponsePayload): string | null {
    if (typeof response.role === 'string' && response.role.trim()) {
      return response.role.trim();
    }

    if (typeof response.data?.role === 'string' && response.data.role.trim()) {
      return response.data.role.trim();
    }

    return null;
  }
}
