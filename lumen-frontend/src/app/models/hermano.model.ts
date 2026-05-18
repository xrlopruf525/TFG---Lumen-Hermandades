export type HermanoEstado = 'ACTIVO' | 'BAJA' | 'FALLECIDO' | 'PENDIENTE' | string;

export interface Hermano {
  id: number;
  idHermandad: number;
  numeroHermano?: number;
  nif: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  apellidos?: string;
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
  estado?: HermanoEstado;
  formaPago?: string;
  iban?: string;
  titularCuenta?: string;
  enCuotas?: boolean;
  observaciones?: string;
  tutorLegal?: string;
  deleted?: boolean;
}

export interface HermanoDto extends Hermano {}

export type HermanoRequest = Omit<Hermano, 'id' | 'deleted'> & {
  id?: number;
};

export type UpsertHermanoPayload = HermanoRequest;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface HermanosQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  estado?: HermanoEstado;
  sortBy?: keyof Hermano;
  sortDirection?: 'asc' | 'desc';
}