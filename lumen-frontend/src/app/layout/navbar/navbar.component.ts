import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  userLabel = 'Usuario autenticado';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.userLabel = this.resolveUserLabel();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private resolveUserLabel(): string {
    const token = this.authService.getToken();
    if (!token) {
      return 'Usuario autenticado';
    }

    const payload = token.split('.')[1];
    if (!payload) {
      return 'Usuario autenticado';
    }

    try {
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const parsedPayload = JSON.parse(decodedPayload) as Record<string, unknown>;
      const username = parsedPayload['email'] ?? parsedPayload['username'] ?? parsedPayload['sub'];

      if (typeof username === 'string' && username.trim()) {
        return username;
      }

      return 'Usuario autenticado';
    } catch {
      return 'Usuario autenticado';
    }
  }
}
