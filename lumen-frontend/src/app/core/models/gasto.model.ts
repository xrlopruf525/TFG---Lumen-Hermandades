export interface Gasto {
  idGasto: number;
  concepto: string;
  importe: number;
  fecha: string | Date;
  proveedor?: string;
}

export interface GastoResumen {
  total_ingresos: number;
  total_gastos: number;
  balance: number;
}

export interface Movimiento {
  id: number;
  fecha: string | Date;
  concepto: string;
  tipo: 'ingreso' | 'gasto';
  importe: number;
}
