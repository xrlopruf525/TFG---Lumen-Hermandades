import { Component, OnInit } from '@angular/core';

import { Evento } from '../../core/models/evento.model';
import { AuthService } from '../../core/services/auth.service';
import {
  CrearEventoPayload,
  EventoService,
  GuardarInscripcionesPayload,
  HermanoInscripcionEvento
} from '../../core/services/evento.service';

interface DiaCalendario {
  date: Date;
  inCurrentMonth: boolean;
  eventos: Evento[];
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {
  eventos: Evento[] = [];
  eventoSeleccionado: Evento | null = null;
  diasCalendario: DiaCalendario[] = [];

  mesActual = new Date();
  readonly nombresMes = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  mostrarFormulario = false;
  guardando = false;
  errorGuardado: string | null = null;
  successGuardado: string | null = null;

  modalInscripcionesAbierto = false;
  hermanosInscripcion: HermanoInscripcionEvento[] = [];
  buscandoHermano = '';
  cargandoInscripciones = false;
  guardandoInscripciones = false;
  errorInscripciones: string | null = null;
  successInscripciones: string | null = null;

  nuevoEvento: CrearEventoPayload = {
    titulo: '',
    fechaInicio: '',
    fechaFin: '',
    lugar: '',
    tipoEvento: ''
  };

  readonly isAdmin: boolean;
  cargando = false;
  errorCarga: string | null = null;

  constructor(
    private readonly eventoService: EventoService,
    private readonly authService: AuthService
  ) {
    this.isAdmin = this.authService.hasRole('ADMIN');
  }

  ngOnInit(): void {
    this.cargarEventos();
  }

  seleccionarEvento(evento: Evento): void {
    this.eventoSeleccionado = evento;
  }

  get tituloMesActual(): string {
    const mes = this.nombresMes[this.mesActual.getMonth()] ?? '';
    return `${mes} de ${this.mesActual.getFullYear()}`;
  }

  cambiarMes(offset: number): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + offset, 1);
    this.reconstruirCalendario();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.errorGuardado = null;
    this.successGuardado = null;
  }

  cancelarFormulario(clearSuccess = true): void {
    this.mostrarFormulario = false;
    this.guardando = false;
    this.errorGuardado = null;
    if (clearSuccess) {
      this.successGuardado = null;
    }
    this.nuevoEvento = {
      titulo: '',
      fechaInicio: '',
      fechaFin: '',
      lugar: '',
      tipoEvento: ''
    };
  }

  crearEvento(): void {
    if (!this.isAdmin || this.guardando) {
      return;
    }

    const titulo = (this.nuevoEvento.titulo ?? '').trim();
    const fechaInicio = (this.nuevoEvento.fechaInicio ?? '').trim();

    if (!titulo || !fechaInicio) {
      this.errorGuardado = 'Titulo y fecha de inicio son obligatorios.';
      return;
    }

    this.guardando = true;
    this.errorGuardado = null;
    this.successGuardado = null;

    const payload: CrearEventoPayload = {
      titulo,
      fechaInicio,
      fechaFin: (this.nuevoEvento.fechaFin ?? '').trim() || fechaInicio,
      lugar: (this.nuevoEvento.lugar ?? '').trim() || null,
      tipoEvento: (this.nuevoEvento.tipoEvento ?? '').trim() || null
    };

    this.eventoService.crearEvento(payload).subscribe({
      next: (evento) => {
        this.eventos = [...this.eventos, evento];
        this.eventoSeleccionado = evento;
        this.reconstruirCalendario();
        this.guardando = false;
        this.successGuardado = 'Evento creado correctamente.';
        this.cancelarFormulario(false);
      },
      error: () => {
        this.guardando = false;
        this.errorGuardado = 'No se ha podido crear el evento.';
      }
    });
  }

  abrirGoogleCalendar(evento: Evento): void {
    if (!evento.googleCalendarUrl) {
      return;
    }

    window.open(evento.googleCalendarUrl, '_blank', 'noopener');
  }

  abrirModalInscripciones(evento: Evento): void {
    if (!this.isAdmin) {
      return;
    }

    this.eventoSeleccionado = evento;
    this.modalInscripcionesAbierto = true;
    this.errorInscripciones = null;
    this.successInscripciones = null;
    this.buscandoHermano = '';
    this.cargarInscripciones(evento.idEvento);
  }

  cerrarModalInscripciones(): void {
    this.modalInscripcionesAbierto = false;
    this.hermanosInscripcion = [];
    this.errorInscripciones = null;
    this.successInscripciones = null;
    this.buscandoHermano = '';
  }

  get hermanosFiltrados(): HermanoInscripcionEvento[] {
    const term = this.buscandoHermano.trim().toLowerCase();
    if (!term) {
      return this.hermanosInscripcion;
    }

    return this.hermanosInscripcion.filter((hermano) => {
      const numero = hermano.numeroHermano != null ? String(hermano.numeroHermano) : '';
      return hermano.nombreCompleto.toLowerCase().includes(term) || numero.includes(term);
    });
  }

  marcarTodosFiltrados(inscrito: boolean): void {
    const idsFiltrados = new Set(this.hermanosFiltrados.map((h) => h.idHermano));
    this.hermanosInscripcion = this.hermanosInscripcion.map((hermano) =>
      idsFiltrados.has(hermano.idHermano)
        ? { ...hermano, inscrito }
        : hermano
    );
  }

  inscribirTodosActivos(): void {
    const evento = this.eventoSeleccionado;
    if (!evento || this.guardandoInscripciones) {
      return;
    }

    this.guardandoInscripciones = true;
    this.errorInscripciones = null;
    this.successInscripciones = null;

    const payload: GuardarInscripcionesPayload = {
      inscribirTodos: true,
      hermanoIds: []
    };

    this.eventoService.guardarInscripcionesEvento(evento.idEvento, payload).subscribe({
      next: () => {
        this.guardandoInscripciones = false;
        this.successInscripciones = 'Se han inscrito todos los hermanos activos.';
        this.cargarInscripciones(evento.idEvento);
      },
      error: () => {
        this.guardandoInscripciones = false;
        this.errorInscripciones = 'No se han podido guardar las inscripciones.';
      }
    });
  }

  guardarSeleccionInscripciones(): void {
    const evento = this.eventoSeleccionado;
    if (!evento || this.guardandoInscripciones) {
      return;
    }

    this.guardandoInscripciones = true;
    this.errorInscripciones = null;
    this.successInscripciones = null;

    const idsSeleccionados = this.hermanosInscripcion
      .filter((h) => h.inscrito)
      .map((h) => h.idHermano);

    const payload: GuardarInscripcionesPayload = {
      inscribirTodos: false,
      hermanoIds: idsSeleccionados
    };

    this.eventoService.guardarInscripcionesEvento(evento.idEvento, payload).subscribe({
      next: () => {
        this.guardandoInscripciones = false;
        this.successInscripciones = 'Inscripciones actualizadas correctamente.';
        this.cargarInscripciones(evento.idEvento);
      },
      error: () => {
        this.guardandoInscripciones = false;
        this.errorInscripciones = 'No se han podido guardar las inscripciones.';
      }
    });
  }

  actualizarInscrito(idHermano: number, inscrito: boolean): void {
    this.hermanosInscripcion = this.hermanosInscripcion.map((hermano) =>
      hermano.idHermano === idHermano
        ? { ...hermano, inscrito }
        : hermano
    );
  }

  private cargarEventos(): void {
    this.cargando = true;
    this.errorCarga = null;

    this.eventoService.obtenerTodosLosEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.eventoSeleccionado = eventos.length > 0 ? eventos[0] : null;
        this.reconstruirCalendario();
        this.cargando = false;
      },
      error: () => {
        this.errorCarga = 'No se han podido cargar los eventos en este momento.';
        this.cargando = false;
      }
    });
  }

  private reconstruirCalendario(): void {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const mondayBasedStart = (firstDay.getDay() + 6) % 7;

    const startDate = new Date(year, month, 1 - mondayBasedStart);
    const totalDays = 42;

    this.diasCalendario = Array.from({ length: totalDays }).map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);

      return {
        date,
        inCurrentMonth: date.getMonth() === month,
        eventos: this.obtenerEventosDelDia(date)
      };
    });

    if (this.eventoSeleccionado) {
      const existe = this.eventos.some(e => e.idEvento === this.eventoSeleccionado?.idEvento);
      if (!existe) {
        this.eventoSeleccionado = null;
      }
    }

    const hasCurrentMonthSelection = this.eventoSeleccionado !== null;
    if (!hasCurrentMonthSelection && this.eventos.length > 0) {
      this.eventoSeleccionado = this.eventos[0];
    }
  }

  private obtenerEventosDelDia(date: Date): Evento[] {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return this.eventos.filter((evento) => {
      if (!evento.fechaInicio) {
        return false;
      }

      const start = this.toDate(evento.fechaInicio);
      const end = this.toDate(evento.fechaFin ?? evento.fechaInicio);
      if (!start || !end) {
        return false;
      }

      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return dayStart >= startDay && dayStart <= endDay;
    });
  }

  private toDate(value: string | Date): Date | null {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private cargarInscripciones(idEvento: number): void {
    this.cargandoInscripciones = true;
    this.errorInscripciones = null;

    this.eventoService.obtenerInscripcionesEvento(idEvento).subscribe({
      next: (hermanos) => {
        this.hermanosInscripcion = hermanos;
        this.cargandoInscripciones = false;
      },
      error: () => {
        this.cargandoInscripciones = false;
        this.errorInscripciones = 'No se han podido cargar los hermanos activos.';
      }
    });
  }
}
