import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Hermano } from '../../models/hermano.model';
import { HermanoService } from '../../services/hermano.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {
  hermano: Hermano | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly hermanoService: HermanoService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get nombreCompleto(): string {
    if (!this.hermano) {
      return '';
    }

    return `${this.hermano.nombre} ${this.hermano.apellidos}`.trim();
  }

  retry(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    const authenticatedHermanoId = this.authService.getAuthenticatedHermanoId();

    if (authenticatedHermanoId !== null) {
      this.hermanoService.getHermanoById(authenticatedHermanoId).subscribe({
        next: (data) => {
          this.hermano = data;
          this.loading = false;
        },
        error: () => {
          this.loadProfileFromMeEndpoint();
        }
      });
      return;
    }

    this.loadProfileFromMeEndpoint();
  }

  private loadProfileFromMeEndpoint(): void {
    this.hermanoService.getMiPerfil().subscribe({
      next: (data) => {
        this.hermano = data;
        this.loading = false;
      },
      error: () => {
        this.hermano = null;
        this.loading = false;
        this.errorMessage = 'No se pudo cargar tu perfil. Revisa autenticacion y endpoint de perfil.';
      }
    });
  }
}
