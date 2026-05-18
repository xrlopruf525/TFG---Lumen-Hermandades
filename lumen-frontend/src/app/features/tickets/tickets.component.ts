import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Evento } from '../../core/models/evento.model';
import { CrearTicketPayload, Ticket } from '../../core/models/ticket.model';
import { EventoService } from '../../core/services/evento.service';
import { HermanoService } from '../../core/services/hermano.service';
import { TicketService } from '../../core/services/ticket.service';
import { Hermano } from '../../models/hermano.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  form = this.fb.group({
    idHermano: [null as number | null, Validators.required],
    idEvento: [null as number | null],
    concepto: ['', [Validators.required, Validators.maxLength(255)]],
    importe: [0, [Validators.required, Validators.min(0.01)]],
    fechaEmision: [this.todayIso(), Validators.required]
  });

  loading = false;
  saving = false;
  errorMessage: string | null = null;
  hermanos: Hermano[] = [];
  eventos: Evento[] = [];
  ticketsRecientes: Ticket[] = [];
  tickets: Ticket[] = [];
  downloadBusyId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly hermanoService: HermanoService,
    private readonly eventoService: EventoService,
    private readonly ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  get conceptoActual(): string {
    return String(this.form.controls.concepto.value ?? '').trim();
  }

  get totalTickets(): number {
    return this.tickets.length;
  }

  get totalImporte(): number {
    return this.tickets.reduce((suma, ticket) => suma + (Number(ticket.importe) || 0), 0);
  }

  submit(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const concepto = String(raw.concepto ?? '').trim();

    const payload: CrearTicketPayload = {
      idHermano: Number(raw.idHermano),
      idEvento: raw.idEvento ? Number(raw.idEvento) : null,
      concepto,
      importe: Number(raw.importe) || 0,
      fechaEmision: raw.fechaEmision ?? this.todayIso()
    };

    this.saving = true;
    this.errorMessage = null;

    this.ticketService.crearTicket(payload).subscribe({
      next: (ticket) => {
        this.saving = false;
        this.prependTicket(ticket);
        this.resetForm();
        this.descargarTicketPdf(ticket.idTicket);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'No se ha podido generar el ticket.';
      }
    });
  }

  limpiar(): void {
    this.resetForm();
    this.errorMessage = null;
  }

  descargarTicketPdf(idTicket: number): void {
    this.downloadBusyId = idTicket;
    this.ticketService.descargarTicketPdf(idTicket).subscribe({
      next: (blob) => {
        this.downloadBusyId = null;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `ticket-${idTicket}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.downloadBusyId = null;
        this.errorMessage = 'No se ha podido descargar el PDF.';
      }
    });
  }

  trackByTicket(_: number, ticket: Ticket): number {
    return ticket.idTicket;
  }

  formatHermano(hermano: Hermano): string {
    const numero = hermano.numeroHermano ? `#${hermano.numeroHermano}` : '';
    const apellidos = `${hermano.primerApellido ?? ''} ${hermano.segundoApellido ?? ''}`.trim();
    return `${hermano.nombre} ${apellidos} ${numero}`.trim().replace(/\s+/g, ' ');
  }

  private cargarDatos(): void {
    this.loading = true;
    this.errorMessage = null;

    this.hermanoService.getHermanos({ page: 1, pageSize: 500, sortBy: 'primerApellido', sortDirection: 'asc' }).subscribe({
      next: (response) => {
        this.hermanos = response.data;
        this.cargarEventos();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se han podido cargar los hermanos.';
      }
    });
  }

  private cargarEventos(): void {
    this.eventoService.obtenerTodosLosEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.cargarTickets();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se han podido cargar los eventos.';
      }
    });
  }

  private cargarTickets(): void {
    this.ticketService.obtenerTicketsRecientes().subscribe({
      next: (ticketsRecientes) => {
        this.ticketsRecientes = ticketsRecientes;
        this.ticketService.obtenerTodosLosTickets().subscribe({
          next: (tickets) => {
            this.tickets = tickets;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.errorMessage = 'No se han podido cargar los tickets.';
          }
        });
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se han podido cargar los tickets recientes.';
      }
    });
  }

  private prependTicket(ticket: Ticket): void {
    this.ticketsRecientes = [ticket, ...this.ticketsRecientes].slice(0, 3);
    this.tickets = [ticket, ...this.tickets];
  }

  private resetForm(): void {
    this.form.reset({
      idHermano: null,
      idEvento: null,
      concepto: '',
      importe: 0,
      fechaEmision: this.todayIso()
    });
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }
}