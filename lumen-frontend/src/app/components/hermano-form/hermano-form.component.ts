import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Hermano } from '../../models/hermano.model';
import { HermanoService, HermanoUpsertPayload } from '../../services/hermano.service';

@Component({
  selector: 'app-hermano-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './hermano-form.component.html',
  styleUrls: ['./hermano-form.component.scss']
})
export class HermanoFormComponent implements OnInit {
  isEditMode = false;
  hermanoId: number | null = null;
  loading = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    numeroHermano: ['', [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly hermanoService: HermanoService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.isEditMode = false;
      return;
    }

    const parsedId = Number(idParam);
    if (Number.isNaN(parsedId)) {
      this.errorMessage = 'El identificador de hermano no es valido.';
      return;
    }

    this.hermanoId = parsedId;
    this.isEditMode = true;
    this.loadHermanoForEdit(parsedId);
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    this.submitting = true;

    if (this.isEditMode && this.hermanoId !== null) {
      this.hermanoService.updateHermano(this.hermanoId, payload).subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Hermano actualizado correctamente.';
        },
        error: () => {
          this.submitting = false;
          this.errorMessage = 'No se pudo actualizar el hermano.';
        }
      });
      return;
    }

    this.hermanoService.createHermano(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Hermano creado correctamente.';
        this.form.reset({
          nombre: '',
          apellidos: '',
          email: '',
          numeroHermano: ''
        });
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'No se pudo crear el hermano.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/hermanos']);
  }

  hasError(controlName: 'nombre' | 'apellidos' | 'email' | 'numeroHermano', error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }

  private loadHermanoForEdit(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.hermanoService.getHermanoById(id).subscribe({
      next: (hermano) => {
        this.loading = false;
        this.patchFormWithHermano(hermano);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar la informacion del hermano.';
      }
    });
  }

  private patchFormWithHermano(hermano: Hermano): void {
    this.form.patchValue({
      nombre: hermano.nombre ?? '',
      apellidos: `${hermano.primer_apellido ?? ''} ${hermano.segundo_apellido ?? ''}`.trim(),
      email: hermano.email ?? '',
      numeroHermano: hermano.numeroHermano != null ? String(hermano.numeroHermano) : ''
    });
  }

  private buildPayload(): HermanoUpsertPayload {
    const raw = this.form.getRawValue();
    const [primer, ...resto] = raw.apellidos.trim().split(' ');

    return {
      nombre: raw.nombre.trim(),
      primer_apellido: primer || '',
      segundo_apellido: resto.join(' ') || '',
      email: raw.email.trim(),
      numeroHermano: Number(raw.numeroHermano)
    };
  }
}