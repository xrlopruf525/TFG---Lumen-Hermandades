export interface Cuota {
  idCuota: number;
  idHermano?: number;
  anyo?: number;
  concepto: string;
  importe: number;
  fecha_emision?: string | Date;
  fecha_vencimiento?: string | Date;
  fechaPago?: string | Date | null;
  fecha_pago?: string | Date | null;
  estado: 'PENDIENTE' | 'PAGADA' | 'ANULADA' | string;
  nota?: string;
  pagoSimulado?: boolean;
}

export interface CuotaResumen {
  totalPendientes: number;
  totalPagadas: number;
}
