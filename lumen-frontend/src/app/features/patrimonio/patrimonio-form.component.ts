import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PatrimonioService } from '../../core/services/patrimonio.service';
import { Patrimonio, CategoriaPatrimonio } from '../../core/models/patrimonio.model';

@Component({
  selector: 'app-patrimonio-form',
  templateUrl: './patrimonio-form.component.html',
  styleUrls: ['./patrimonio-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PatrimonioFormComponent implements OnInit {
  form!: FormGroup;
  categorias: CategoriaPatrimonio[] = [];
  patrimonioId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  estados = [
    { value: 'excelente', label: 'Excelente' },
    { value: 'bueno', label: 'Bueno' },
    { value: 'regular', label: 'Regular' },
    { value: 'deteriorado', label: 'Deteriorado' }
  ];

  valorOpciones = [
    { value: 'calculable', label: 'Valor calculable' },
    { value: 'incalculable', label: 'Incalculable' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly patrimonioService: PatrimonioService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.configurarValorTipo();
    
    // Si hay ID en la ruta, es edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.patrimonioId = parseInt(id);
        this.cargarPatrimonio(this.patrimonioId);
      }
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      categoria: [''],
      estado: ['bueno', Validators.required],
      ubicacion: [''],
      fechaAdquisicion: [''],
      imagenUrl: [''],
      valorTipo: ['calculable', Validators.required],
      valorEstimado: [null]
    });
  }

  cargarCategorias(): void {
    this.patrimonioService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  cargarPatrimonio(id: number): void {
    this.loading = true;
    this.patrimonioService.obtenerPatrimonioPorId(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          categoria: data.categoria,
          estado: data.estado,
          ubicacion: data.ubicacion,
          fechaAdquisicion: data.fechaAdquisicion,
          imagenUrl: data.imagenUrl,
          valorTipo: data.valorEstimado === null || data.valorEstimado === undefined ? 'incalculable' : 'calculable',
          valorEstimado: data.valorEstimado
        });
        this.configurarValorTipo();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar patrimonio: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const patrimonio: Omit<Patrimonio, 'idPatrimonio'> = {
      nombre: this.form.get('nombre')?.value,
      descripcion: this.form.get('descripcion')?.value,
      categoria: this.form.get('categoria')?.value,
      estado: this.form.get('estado')?.value,
      ubicacion: this.form.get('ubicacion')?.value,
      fechaAdquisicion: this.form.get('fechaAdquisicion')?.value,
      imagenUrl: this.normalizarTexto(this.form.get('imagenUrl')?.value) ?? undefined,
      valorEstimado: this.form.get('valorTipo')?.value === 'incalculable'
        ? null
        : this.normalizarValor(this.form.get('valorEstimado')?.value)
    };

    if (this.patrimonioId) {
      // Actualizar
      this.patrimonioService.actualizarPatrimonio(this.patrimonioId, patrimonio).subscribe({
        next: () => {
          this.successMessage = 'Patrimonio actualizado correctamente';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/patrimonio']), 1500);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      // Crear
      this.patrimonioService.crearPatrimonio(patrimonio).subscribe({
        next: () => {
          this.successMessage = 'Patrimonio creado correctamente';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/patrimonio']), 1500);
        },
        error: (err) => {
          this.errorMessage = 'Error al crear: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/patrimonio']);
  }

  onValorTipoChange(): void {
    this.configurarValorTipo();
  }

  private configurarValorTipo(): void {
    const valorTipo = this.form.get('valorTipo')?.value;
    const valorControl = this.form.get('valorEstimado');

    if (!valorControl) {
      return;
    }

    if (valorTipo === 'incalculable') {
      valorControl.setValue(null, { emitEvent: false });
      valorControl.disable({ emitEvent: false });
      return;
    }

    valorControl.enable({ emitEvent: false });
  }

  private normalizarValor(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private normalizarTexto(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  onImagenChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ imagenUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    this.form.patchValue({ imagenUrl: '' });
  }

  get isEditing(): boolean {
    return this.patrimonioId !== null;
  }

  get imagenPreviewUrl(): string | null {
    const value = this.form.get('imagenUrl')?.value;
    return typeof value === 'string' && value.trim() ? value : null;
  }
}
