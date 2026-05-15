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
import * as XLSX from 'xlsx';

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
  private readonly templateHeaders = [
    'idHermandad',
    'numeroHermano',
    'nif',
    'nombre',
    'primerApellido',
    'segundoApellido',
    'fechaNacimiento',
    'direccion',
    'numero',
    'pisoPuerta',
    'codigoPostal',
    'poblacion',
    'provincia',
    'pais',
    'telefonoMovil',
    'telefonoFijo',
    'email',
    'fechaAlta',
    'fechaBaja',
    'estado',
    'formaPago',
    'iban',
    'titularCuenta',
    'enCuotas',
    'observaciones',
    'tutorLegal'
  ];

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
  importandoExcel = false;
  importacionMensaje = '';

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

  descargarPlantillaExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet([
      this.templateHeaders.reduce((acc, header) => ({ ...acc, [header]: '' }), { idHermandad: 1, estado: 'ACTIVO', pais: 'Espana' })
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');
    XLSX.writeFile(workbook, 'plantilla_censo_hermanos.xlsx');
  }

  abrirSelectorImportacion(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.importacionMensaje = '';
    this.importandoExcel = true;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          throw new Error('El archivo Excel no contiene hojas.');
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

        if (rows.length === 0) {
          throw new Error('El archivo Excel no contiene filas para importar.');
        }

        const payload = rows.map((row) => this.normalizarFilaImportacion(row));

        this.hermanoService.importarHermanos(payload).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            const importados = response?.importados ?? 0;
            const errores = response?.errores ?? 0;
            this.importacionMensaje = `Importación finalizada: ${importados} hermanos importados${errores > 0 ? `, ${errores} con error` : ''}.`;
            this.importandoExcel = false;
            this.loadHermanos();
          },
          error: (error: HttpErrorResponse) => {
            this.importandoExcel = false;
            this.importacionMensaje = error.status === 0
              ? 'No se pudo importar porque la API no esta disponible.'
              : 'No se pudo importar el Excel. Revisa el formato del archivo.';
          }
        });
      } catch (error) {
        this.importandoExcel = false;
        this.importacionMensaje = error instanceof Error ? error.message : 'No se pudo leer el archivo Excel.';
      }
    };

    reader.onerror = () => {
      this.importandoExcel = false;
      this.importacionMensaje = 'No se pudo leer el archivo Excel.';
    };

    reader.readAsArrayBuffer(file);
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

  private normalizarFilaImportacion(row: Record<string, unknown>): Record<string, unknown> {
    const get = (...keys: string[]): unknown => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
          return row[key];
        }
      }
      return '';
    };

    return {
      idHermandad: Number(get('idHermandad', 'id_hermandad')) || 1,
      numeroHermano: this.toNumberOrNull(get('numeroHermano', 'numero_hermano')),
      nif: String(get('nif', 'dni')).trim(),
      nombre: String(get('nombre')).trim(),
      primerApellido: String(get('primerApellido', 'primer_apellido')).trim(),
      segundoApellido: String(get('segundoApellido', 'segundo_apellido')).trim() || null,
      fechaNacimiento: this.normalizarFecha(get('fechaNacimiento', 'fecha_nacimiento')),
      direccion: String(get('direccion')).trim() || null,
      numero: String(get('numero')).trim() || null,
      pisoPuerta: String(get('pisoPuerta', 'piso_puerta')).trim() || null,
      codigoPostal: String(get('codigoPostal', 'codigo_postal')).trim() || null,
      poblacion: String(get('poblacion', 'localidad')).trim() || null,
      provincia: String(get('provincia')).trim() || null,
      pais: String(get('pais')).trim() || null,
      telefonoMovil: String(get('telefonoMovil', 'telefono_movil')).trim() || null,
      telefonoFijo: String(get('telefonoFijo', 'telefono_fijo')).trim() || null,
      email: String(get('email')).trim() || null,
      fechaAlta: this.normalizarFecha(get('fechaAlta', 'fecha_alta')),
      fechaBaja: this.normalizarFecha(get('fechaBaja', 'fecha_baja')),
      estado: String(get('estado')).trim() || 'ACTIVO',
      formaPago: String(get('formaPago', 'forma_pago')).trim() || null,
      iban: String(get('iban')).trim() || null,
      titularCuenta: String(get('titularCuenta', 'titular_cuenta')).trim() || null,
      enCuotas: this.toBooleanOrNull(get('enCuotas', 'en_cuotas')),
      observaciones: String(get('observaciones')).trim() || null,
      tutorLegal: String(get('tutorLegal', 'tutor_legal')).trim() || null
    };
  }

  private normalizarFecha(value: unknown): string | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
      return String(value).trim() || null;
    }

    return date.toISOString().slice(0, 10);
  }

  private toNumberOrNull(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toBooleanOrNull(value: unknown): boolean | null {
    if (value === true || value === false) {
      return value;
    }

    const normalized = String(value ?? '').trim().toLowerCase();
    if (!normalized) {
      return null;
    }

    if (['true', '1', 'si', 'sí', 'yes'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no'].includes(normalized)) {
      return false;
    }

    return null;
  }
}
