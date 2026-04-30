import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil
} from 'rxjs';

import {
  Hermano,
  HermanosQueryParams,
  UpsertHermanoPayload
} from '../../models/hermano.model';
import { HermanoService } from '../../services/hermano.service';
import { CensoFormComponent } from './censo-form.component';

type SortDirection = 'asc' | 'desc';
type SortableColumn =
  | 'nombre'
  | 'primer_apellido'
  | 'dni'
  | 'telefono_movil'
  | 'email'
  | 'estado'
  | 'numeroHermano';

@Component({
  selector: 'app-censo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CensoFormComponent],
  templateUrl: './censo-list.component.html',
  styleUrls: ['./censo-list.component.scss']
})
export class CensoListComponent implements OnInit, OnDestroy {
  readonly pageSizeOptions = [10, 25, 50];
  readonly estadoOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'BAJA', label: 'Baja' },
    { value: 'FALLECIDO', label: 'Fallecido' }
  ];

  hermanos: Hermano[] = [];

  searchTerm = '';
  estadoFiltro = '';
  sortColumn: SortableColumn = 'primer_apellido';
  sortDirection: SortDirection = 'asc';
  page = 1;
  pageSize = 10;
  total = 0;
  totalPages = 1;

  formVisible = false;
  editingHermano: Hermano | null = null;

  loading = false;
  saving = false;
  deletingId: number | null = null;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();
  private readonly searchTerm$ = new Subject<string>();

  constructor(
    private readonly hermanoService: HermanoService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;
        this.loadHermanos();
      });

    this.loadHermanos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHermanos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.hermanoService.getHermanos(this.buildQueryParams()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.hermanos = data.data ?? [];
        this.page = data.pagination?.page ?? this.page;
        this.pageSize = data.pagination?.pageSize ?? this.pageSize;
        this.total = data.pagination?.total ?? this.hermanos.length;
        this.totalPages = Math.max(data.pagination?.totalPages ?? 1, 1);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.hermanos = [];
        this.errorMessage = error.status === 0
          ? 'No se pudo cargar el censo porque la API no esta disponible (backend apagado o sin conexion a BD).'
          : 'No se pudo cargar el censo. Revisa la conexion con la API.';
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.searchTerm$.next(this.searchTerm);
  }

  onEstadoChange(): void {
    this.page = 1;
    this.loadHermanos();
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.loadHermanos();
  }

  sortBy(column: SortableColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.loadHermanos();
  }

  getSortIcon(column: SortableColumn): string {
    if (this.sortColumn !== column) {
      return '<>';
    }

    return this.sortDirection === 'asc' ? '^' : 'v';
  }

  openCreateForm(): void {
    this.editingHermano = null;
    this.formVisible = true;
    this.errorMessage = '';
  }

  openEditForm(hermano: Hermano): void {
    // clone the object to avoid accidental mutations in the list
    this.editingHermano = { ...hermano } as Hermano;
    this.errorMessage = '';
    this.formVisible = true;
  }

  closeForm(): void {
    // clear editing state and hide form; clearing editingHermano first
    this.editingHermano = null;
    this.formVisible = false;
  }

  saveHermano(payload: UpsertHermanoPayload): void {
    this.saving = true;
    this.errorMessage = '';

    const request$ = this.editingHermano
      ? this.hermanoService.updateHermano(this.editingHermano.id, payload)
      : this.hermanoService.createHermano(payload);

    request$.pipe(finalize(() => (this.saving = false)), takeUntil(this.destroy$)).subscribe({
      next: () => {
        // Close form and refresh list in-place (no routing) to preserve UX and pagination
        this.closeForm();
        this.loadHermanos();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 0
          ? 'No se pudo guardar porque la API no esta disponible. Levanta backend y base de datos.'
          : 'No se pudo guardar el hermano. Verifica los datos del formulario.';
      }
    });
  }

  deleteHermano(hermano: Hermano): void {
    if (!window.confirm(`Eliminar a ${hermano.nombre} ${hermano.primer_apellido}?`)) {
      return;
    }

    this.deletingId = hermano.id;
    this.errorMessage = '';

    this.hermanoService
      .deleteHermano(hermano.id)
      .pipe(finalize(() => (this.deletingId = null)), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.hermanos.length === 1 && this.page > 1) {
            this.page -= 1;
          }
          this.loadHermanos();
        },
        error: () => {
          this.errorMessage = 'No se pudo eliminar el registro.';
        }
      });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) {
      return;
    }

    this.page = page;
    this.loadHermanos();
  }

  previousPage(): void {
    this.goToPage(this.page - 1);
  }

  nextPage(): void {
    this.goToPage(this.page + 1);
  }

  get pageNumbers(): number[] {
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  }

  getStatusClass(estado: string | undefined): string {
    const normalized = String(estado ?? '').toUpperCase();
    if (normalized === 'ACTIVO') {
      return 'status-pill--active';
    }
    if (normalized === 'PENDIENTE') {
      return 'status-pill--pending';
    }
    if (normalized === 'BAJA') {
      return 'status-pill--inactive';
    }
    if (normalized === 'FALLECIDO') {
      return 'status-pill--deceased';
    }
    return 'status-pill--neutral';
  }

  formatApellidos(hermano: Hermano): string {
    const full = `${hermano.primer_apellido ?? ''} ${hermano.segundo_apellido ?? ''}`.trim();
    return full || '-';
  }

  trackByHermanoId(_index: number, hermano: Hermano): number {
    return hermano.id;
  }

  private buildQueryParams(): HermanosQueryParams {
    return {
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchTerm.trim() || undefined,
      estado: this.estadoFiltro || undefined,
      sortBy: this.sortColumn,
      sortDirection: this.sortDirection
    };
  }
}
