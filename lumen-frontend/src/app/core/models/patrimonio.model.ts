export interface Patrimonio {
  idPatrimonio?: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  estado: 'excelente' | 'bueno' | 'regular' | 'deteriorado';
  ubicacion?: string;
  fechaAdquisicion?: string | Date;
  valorEstimado?: number | null;
  imagenUrl?: string;
  imagenes?: ImagenPatrimonio[];
  deleted?: boolean;
}

export interface ImagenPatrimonio {
  idImagen?: number;
  ruta: string;
  url?: string;
  patrimonioId?: number;
}

export interface CategoriaPatrimonio {
  idCategoria?: number;
  nombre: string;
}

export interface PatrimonioStats {
  totalEnseres: number;
  estadoExcelente: number;
  valorTotalPatrimonio: number;
  pasos: number;
}
