export interface Hermano {
  id: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  dni?: string;
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
