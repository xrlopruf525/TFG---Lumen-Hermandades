import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatrimonioService } from '../../core/services/patrimonio.service';
import { Patrimonio, CategoriaPatrimonio, PatrimonioStats } from '../../core/models/patrimonio.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-patrimonio-list',
  templateUrl: './patrimonio-list.component.html',
  styleUrls: ['./patrimonio-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PatrimonioListComponent implements OnInit {
  patrimonios: Patrimonio[] = [];
  categorias: CategoriaPatrimonio[] = [];
  stats: PatrimonioStats = {
    totalEnseres: 0,
    estadoExcelente: 0,
    valorTotalPatrimonio: 0,
    pasos: 0
  };

  loading = false;
  errorMessage = '';

  // Filtros
  searchTerm = '';
  selectedCategoria = '';

  constructor(
    private readonly patrimonioService: PatrimonioService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.patrimonioService.obtenerTodosLosPatrimonios().subscribe({
      next: (data) => {
        this.patrimonios = data;
        this.calcularStats();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar patrimonio: ' + err.message;
        this.loading = false;
        console.error('Error cargando patrimonio:', err);
      }
    });

    this.patrimonioService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  calcularStats(): void {
    this.stats.totalEnseres = this.patrimonios.length;
    this.stats.estadoExcelente = this.patrimonios.filter(p => p.estado === 'excelente').length;
    this.stats.valorTotalPatrimonio = this.patrimonios.reduce((acc, p) => {
      const valor = typeof p.valorEstimado === 'number' ? p.valorEstimado : 0;
      return acc + valor;
    }, 0);
    this.stats.pasos = Math.ceil(this.patrimonios.length / 12); // Suponiendo 12 items por página
  }

  get patrimoniosFiltrados(): Patrimonio[] {
    return this.patrimonios.filter(p => {
      const matchSearch = !this.searchTerm || 
        p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.descripcion ?? '').toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchCategoria = !this.selectedCategoria || p.categoria === this.selectedCategoria;
      
      return matchSearch && matchCategoria;
    });
  }

  onNuevoEnser(): void {
    this.router.navigate(['/patrimonio/nuevo']);
  }

  onVerDetalle(patrimonio: Patrimonio): void {
    if (patrimonio.idPatrimonio) {
      this.router.navigate(['/patrimonio/editar', patrimonio.idPatrimonio]);
    }
  }

  getEstadoBadgeClass(estado: string): string {
    return `badge-${estado}`;
  }

  getEstadoChipClass(estado: string): string {
    return `estado-chip--${estado}`;
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      excelente: 'Excelente',
      bueno: 'Bueno',
      regular: 'Regular',
      deteriorado: 'Deteriorado'
    };
    return labels[estado] || estado;
  }

  formatCurrency(value: number | null | undefined): string {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 'Incalculable';
    }

    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    }).format(value);
  }

  getPatrimonioImage(patrimonio: Patrimonio): string | null {
    const rawImage = patrimonio.imagenUrl
      || patrimonio.imagenes?.[0]?.url
      || patrimonio.imagenes?.[0]?.ruta;

    if (!rawImage) {
      return null;
    }

    if (/^(https?:|data:|blob:)/i.test(rawImage)) {
      return rawImage;
    }

    if (environment.apiUrl) {
      return `${environment.apiUrl.replace(/\/$/, '')}/${rawImage.replace(/^\//, '')}`;
    }

    return rawImage;
  }

  getIconClass(categoria?: string): string {
    const normalizedCategoria = (categoria ?? '').trim().toLowerCase();
    const icons: Record<string, string> = {
      pasos: 'fa-cross',
      imagenes: 'fa-person-praying',
      imagen: 'fa-person-praying',
      orfebreria: 'fa-gem',
      textil: 'fa-shirt',
      madera: 'fa-tree',
      metal: 'fa-hammer',
      documento: 'fa-scroll',
      ornamentos: 'fa-sparkles',
      joyas: 'fa-ring',
      andas: 'fa-church',
      carretas: 'fa-church',
      insignias: 'fa-cross',
      culto: 'fa-church',
      liturgia: 'fa-church',
      musica: 'fa-music'
    };

    return icons[normalizedCategoria] || 'fa-landmark';
  }
}

