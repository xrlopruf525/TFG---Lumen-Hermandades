export interface Hermano {
  id: number;
  nombre: string;
  apellidos?: string;
  primer_apellido: string;
  segundo_apellido: string;
  dni?: string;
  telefono?: string;
  telefono_movil?: string;
  email?: string;
  estado?: string;
  numeroHermano?: number;
  fechaAlta?: string | Date;
  fecha_nacimiento?: string | Date;
  direccion?: string;
  piso_puerta?: string;
  codigo_postal?: string;
  localidad?: string;
  provincia?: string;
  pais?: string;
  telefono_fijo?: string;
  forma_pago?: string;
  iban?: string;
  titular_cuenta?: string;
  en_cuotas?: boolean;
  observaciones?: string;
  tutor_legal?: string;
}

export type HermanoEstado = 'ACTIVO' | 'BAJA' | 'FALLECIDO' | 'PENDIENTE' | string;

export interface HermanosQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  estado?: string;
  sortBy?: keyof Hermano | 'apellidos';
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type UpsertHermanoPayload = Omit<Hermano, 'id'>;
