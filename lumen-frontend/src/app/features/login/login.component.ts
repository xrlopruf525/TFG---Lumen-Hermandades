import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    this.error = '';

    if (!this.usuario || !this.password) {
      this.error = 'Completa usuario y contrasena.';
      return;
    }

    this.loading = true;
    this.authService.login(this.usuario, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Credenciales invalidas o backend no disponible.';
      }
    });
  }
}
