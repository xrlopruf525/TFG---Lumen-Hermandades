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
  deleted?: boolean;
}

export interface HermanoDto {
  id: number;
  idHermandad: number;
  numeroHermano?: number;
  nif: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento?: string | Date;
  direccion?: string;
  numero?: string;
  pisoPuerta?: string;
  codigoPostal?: string;
  poblacion?: string;
  provincia?: string;
  pais?: string;
  telefonoMovil?: string;
  telefonoFijo?: string;
  email?: string;
  fechaAlta?: string | Date;
  fechaBaja?: string | Date;
  estado?: string;
  formaPago?: string;
  iban?: string;
  titularCuenta?: string;
  enCuotas?: boolean;
  observaciones?: string;
  tutorLegal?: string;
  deleted?: boolean;
}

export interface HermanoRequest {
  idHermandad: number;
  numeroHermano?: number;
  nif: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento?: string | Date;
  direccion?: string | null;
  numero?: string | null;
  pisoPuerta?: string | null;
  codigoPostal?: string | null;
  poblacion?: string | null;
  provincia?: string | null;
  pais?: string | null;
  telefonoMovil?: string | null;
  telefonoFijo?: string | null;
  email?: string | null;
  fechaAlta?: string | Date | null;
  fechaBaja?: string | Date | null;
  estado?: string | null;
  formaPago?: string | null;
  iban?: string | null;
  titularCuenta?: string | null;
  enCuotas?: boolean | null;
  observaciones?: string | null;
  tutorLegal?: string | null;
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

export type UpsertHermanoPayload = HermanoRequest;
