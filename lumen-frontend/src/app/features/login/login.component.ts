import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService, LoginCredentials } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword = false;
  loading = false;
  serverError = '';

  // Formulario simplificado: solo email/usuario y contrasena.
  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get usernameControl() {
    return this.loginForm.controls.username;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.serverError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Se envian solo las credenciales necesarias al servicio de autenticacion.
    const formValue = this.loginForm.getRawValue();
    const credentials: LoginCredentials = {
      username: formValue.username.trim(),
      password: formValue.password
    };

    this.loading = true;
    this.authService.login(credentials).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        const user = this.authService.getUser();
        this.router.navigate([user?.role === 'HERMANO' ? '/portal-hermano' : '/dashboard']);
      },
      error: (error) => {
        const status = error?.status;
        if (status === 401) {
          this.serverError = 'Credenciales invalidas. Intentalo de nuevo.';
          return;
        }

        this.serverError = 'No fue posible iniciar sesion. Verifica la conexion con la API.';
      }
    });
  }
}
