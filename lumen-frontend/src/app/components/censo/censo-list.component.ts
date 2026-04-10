import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Hermano } from '../../models/hermano.model';
import { HermanoService } from '../../services/hermano.service';

type SortDirection = 'asc' | 'desc';
type SortableColumn = 'nombre' | 'apellidos' | 'dni' | 'telefono_movil' | 'email' | 'estado';

@Component({
  selector: 'app-censo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './censo-list.component.html',
  styleUrls: ['./censo-list.component.scss']
})
export class CensoListComponent implements OnInit {
  hermanos: Hermano[] = [];
  visibleHermanos: Hermano[] = [];

  searchTerm = '';
  sortColumn: SortableColumn = 'apellidos';
  sortDirection: SortDirection = 'asc';

  loading = false;
  errorMessage = '';

  constructor(private readonly hermanoService: HermanoService) {}

  ngOnInit(): void {
    this.loadHermanos();
  }

  loadHermanos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.hermanoService.getHermanos().subscribe({
      next: (data) => {
        this.hermanos = data ?? [];
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: () => {
        this.hermanos = [];
        this.visibleHermanos = [];
        this.errorMessage = 'No se pudo cargar el censo. Revisa la conexion con la API.';
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilterAndSort();
  }

  sortBy(column: SortableColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applyFilterAndSort();
  }

  getSortIcon(column: SortableColumn): string {
    if (this.sortColumn !== column) {
      return '<>';
    }

    return this.sortDirection === 'asc' ? '^' : 'v';
  }

  trackByHermanoId(_index: number, hermano: Hermano): number {
    return hermano.id;
  }

  private applyFilterAndSort(): void {
    const normalizedTerm = this.searchTerm.trim().toLowerCase();

    const filtered = this.hermanos.filter((hermano) => {
      if (!normalizedTerm) {
        return true;
      }

      const nombreCompleto = `${hermano.nombre ?? ''} ${hermano.primer_apellido ?? ''} ${hermano.segundo_apellido ?? ''}`.toLowerCase();
      return nombreCompleto.includes(normalizedTerm);
    });

    this.visibleHermanos = [...filtered].sort((a, b) => {
      const left = this.normalizeSortableValue(this.getColumnValue(a, this.sortColumn));
      const right = this.normalizeSortableValue(this.getColumnValue(b, this.sortColumn));

      if (left < right) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }

      if (left > right) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  private normalizeSortableValue(value: string | number | undefined): string {
    return String(value ?? '').toLowerCase();
  }

  private getColumnValue(hermano: Hermano, column: SortableColumn): string | number | undefined {
    if (column === 'apellidos') {
      return `${hermano.primer_apellido ?? ''} ${hermano.segundo_apellido ?? ''}`.trim();
    }

    if (column === 'telefono_movil') {
      return hermano.telefono_movil;
    }

    return hermano[column];
  }
}
