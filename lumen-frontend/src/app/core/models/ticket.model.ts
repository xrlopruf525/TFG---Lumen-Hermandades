export interface Ticket {
  idTicket: number;
  idHermano: number;
  idEvento: number | null;
  concepto: string;
  importe: number;
  fechaEmision: string | Date;
  urlPdf: string | null;
  deleted: boolean;
  nombreHermano: string;
  tituloEvento: string;
}

export interface CrearTicketPayload {
  idHermano: number;
  idEvento: number | null;
  concepto: string;
  importe: number;
  fechaEmision: string;
}
