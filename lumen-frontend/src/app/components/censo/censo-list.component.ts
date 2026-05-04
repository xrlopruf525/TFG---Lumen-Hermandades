import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { Cuota } from '../../core/models/cuota.model';
import { CuotaService } from '../../core/services/cuota.service';
import { HermanoService } from '../../services/hermano.service';
import { CensoFormComponent } from './censo-form.component';
import * as XLSX from 'xlsx';

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
  cuotasByHermanoId = new Map<number, Cuota[]>();

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
    private readonly cuotaService: CuotaService
  ) {}

  ngOnInit(): void {
    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;
        this.loadHermanos();
      });

    this.loadHermanos();
    this.loadCuotas();
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

  private loadCuotas(): void {
    this.cuotaService.obtenerTodasLasCuotas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (cuotas) => {
        const grouped = new Map<number, Cuota[]>();

        (cuotas || []).forEach((cuota) => {
          const idHermano = cuota.idHermano;
          if (!idHermano) {
            return;
          }

          const current = grouped.get(idHermano) ?? [];
          current.push(cuota);
          grouped.set(idHermano, current);
        });

        this.cuotasByHermanoId = grouped;
      },
      error: () => {
        this.cuotasByHermanoId = new Map<number, Cuota[]>();
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

  getCuotaResumen(hermanoId: number): string {
    const cuotas = this.cuotasByHermanoId.get(hermanoId) ?? [];
    if (!cuotas.length) {
      return 'Sin cuotas';
    }

    const pendientes = cuotas.filter((cuota) => String(cuota.estado).toUpperCase() === 'PENDIENTE').length;
    const pagadas = cuotas.filter((cuota) => String(cuota.estado).toUpperCase() === 'PAGADA').length;

    if (pendientes > 0 && pagadas === 0) {
      return `${pendientes} pendiente${pendientes === 1 ? '' : 's'}`;
    }

    if (pagadas > 0 && pendientes === 0) {
      return 'Pagada';
    }

    return `${pendientes} pendientes / ${pagadas} pagadas`;
  }

  getCuotaClass(hermanoId: number): string {
    const cuotas = this.cuotasByHermanoId.get(hermanoId) ?? [];
    const pendientes = cuotas.filter((cuota) => String(cuota.estado).toUpperCase() === 'PENDIENTE').length;
    const pagadas = cuotas.filter((cuota) => String(cuota.estado).toUpperCase() === 'PAGADA').length;

    if (pendientes > 0 && pagadas === 0) {
      return 'quota-pill--pending';
    }

    if (pagadas > 0 && pendientes === 0) {
      return 'quota-pill--paid';
    }

    return 'quota-pill--neutral';
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

      camposHermano: string[] = [
    'idHermandad',
    'numeroHermano',
    'dni',
    'nombre',
    'primer_apellido',
    'segundo_apellido',
    'fecha_nacimiento',
    'direccion',
    'piso_puerta',
    'codigo_postal',
    'localidad',
    'provincia',
    'pais',
    'telefono_movil',
    'telefono_fijo',
    'email',
    'fechaAlta',
    'fechaBaja',
    'estado',
    'forma_pago',
    'iban',
    'titular_cuenta',
    'en_cuotas',
    'observaciones',
    'tutor_legal',
  ];

  descargarPlantilla(): void {
    const filaVacia: any = {};

    this.camposHermano.forEach(campo => {
      filaVacia[campo] = '';
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([filaVacia], {
      header: this.camposHermano
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Plantilla hermanos': worksheet },
      SheetNames: ['Plantilla hermanos']
    };

    XLSX.writeFile(workbook, 'plantilla_hermanos.xlsx');
  }

  exportarHermanos(): void {
    const hermanosParaExportar = this.obtenerHermanosParaExportar();

    if (!hermanosParaExportar || hermanosParaExportar.length === 0) {
      alert('No hay hermanos para exportar.');
      return;
    }

    const datosExcel = hermanosParaExportar.map((hermano: any) => {
      const fila: any = {};

      this.camposHermano.forEach(campo => {
        fila[campo] = hermano[campo] ?? '';
      });

      return fila;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel, {
      header: this.camposHermano
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Hermanos': worksheet },
      SheetNames: ['Hermanos']
    };

    XLSX.writeFile(workbook, 'exportacion_hermanos.xlsx');
  }

  private obtenerHermanosParaExportar(): Hermano[] {
    return this.hermanos || [];
  }

    importarHermanosDesdeExcel(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
          defval: ''
        });

        if (!rows || rows.length === 0) {
          alert('El Excel está vacío.');
          input.value = '';
          return;
        }

        const hermanos = rows
          .map((row) => this.normalizarHermanoImportado(row))
          .filter((hermano) => hermano.nombre && hermano.primer_apellido && hermano.dni);

        if (hermanos.length === 0) {
          alert('No se encontraron hermanos válidos. Revisa que el Excel tenga nombre, primer_apellido y dni.');
          input.value = '';
          return;
        }

        if (!window.confirm(`Se van a importar ${hermanos.length} hermanos. ¿Deseas continuar?`)) {
          input.value = '';
          return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.hermanoService.importarHermanos(hermanos).subscribe({
          next: (response) => {
            this.loading = false;
            input.value = '';

            alert(
              `Importación finalizada.\n\n` +
              `Total leídos: ${response.totalLeidos}\n` +
              `Importados correctamente: ${response.importados}\n` +
              `Errores: ${response.errores}`
            );

            this.page = 1;
            this.loadHermanos();
          },
          error: () => {
            this.loading = false;
            input.value = '';
            this.errorMessage = 'No se pudo importar el Excel. Revisa el formato de la plantilla.';
          }
        });
      } catch (error) {
        input.value = '';
        this.loading = false;
        this.errorMessage = 'Error leyendo el archivo Excel.';
      }
    };

    reader.readAsArrayBuffer(file);
  }

  private normalizarHermanoImportado(row: Record<string, any>): UpsertHermanoPayload {
    return {
      numeroHermano: this.toNumberOrUndefined(row['numeroHermano']),
      dni: this.toText(row['dni'] ?? row['nif']),
      nombre: this.toText(row['nombre']) ?? '',
      primer_apellido: this.toText(row['primer_apellido'] ?? row['primerApellido']) ?? '',
      segundo_apellido: this.toText(row['segundo_apellido'] ?? row['segundoApellido']) ?? '',
      fecha_nacimiento: this.toExcelDate(row['fecha_nacimiento'] ?? row['fechaNacimiento']),
      direccion: this.toText(row['direccion']),
      piso_puerta: this.toText(row['piso_puerta'] ?? row['pisoPuerta']),
      codigo_postal: this.toText(row['codigo_postal'] ?? row['codigoPostal']),
      localidad: this.toText(row['localidad'] ?? row['poblacion']),
      provincia: this.toText(row['provincia']),
      pais: this.toText(row['pais']) || 'Espana',
      telefono_movil: this.toText(row['telefono_movil'] ?? row['telefonoMovil']),
      telefono_fijo: this.toText(row['telefono_fijo'] ?? row['telefonoFijo']),
      email: this.toText(row['email']),
      fechaAlta: this.toExcelDate(row['fechaAlta']),
      estado: this.toText(row['estado']) || 'ACTIVO',
      forma_pago: this.toText(row['forma_pago'] ?? row['formaPago']),
      iban: this.toText(row['iban']),
      titular_cuenta: this.toText(row['titular_cuenta'] ?? row['titularCuenta']),
      en_cuotas: this.toBoolean(row['en_cuotas'] ?? row['enCuotas']),
      observaciones: this.toText(row['observaciones']),
      tutor_legal: this.toText(row['tutor_legal'] ?? row['tutorLegal'])
    };
  }

  private toText(value: unknown): string | undefined {
    const text = String(value ?? '').trim();
    return text ? text : undefined;
  }

  private toNumberOrUndefined(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
  }

  private toBoolean(value: unknown): boolean {
    const text = String(value ?? '').trim().toLowerCase();

    return text === 'true' ||
      text === '1' ||
      text === 'sí' ||
      text === 'si' ||
      text === 'x';
  }

  private toExcelDate(value: unknown): string | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    if (typeof value === 'number') {
      const parsedDate = XLSX.SSF.parse_date_code(value);

      if (!parsedDate) {
        return undefined;
      }

      const month = String(parsedDate.m).padStart(2, '0');
      const day = String(parsedDate.d).padStart(2, '0');

      return `${parsedDate.y}-${month}-${day}`;
    }

    const text = String(value).trim();

    if (!text) {
      return undefined;
    }

    return text;
  }
}
