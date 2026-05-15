export interface Evento {
  idEvento: number;
  idHermandad: number;
  titulo: string;
  fechaInicio: string | Date;
  fechaFin: string | Date | null;
  lugar: string | null;
  tipoEvento: string | null;
  deleted: boolean;
  googleCalendarUrl: string | null;
}
