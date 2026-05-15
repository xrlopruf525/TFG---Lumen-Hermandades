import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { HermanoDto } from '../../models/hermano.model';

interface GrupoResumen {
  idGrupo: number;
  nombre: string;
  numeroMiembros: number;
}

interface GrupoDetalle extends GrupoResumen {
  idHermanos: number[];
}

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss']
})
export class AvisosComponent implements OnInit {

  enviandoAviso = false;

  tipoDestinatario = 'GRUPO';
  idHermanoSeleccionado: number | null = null;
  idGrupoSeleccionado: number | null = null;
  asuntoAviso = '';
  mensajeAviso = '';

  gruposResumen: GrupoResumen[] = [];

  nombreNuevoGrupo = '';
  creandoGrupo = false;
  errorGrupo = '';
  mostrarCrearGrupo = false;

  grupoEditando: GrupoDetalle | null = null;
  nombreGrupoEditando = '';
  miembrosGrupoEditando: number[] = [];
  hermanosGrupoSeleccionados: HermanoDto[] = [];
  resultadosBusquedaGrupo: HermanoDto[] = [];
  busquedaGrupo = '';
  cargandoGrupoDetalle = false;
  buscandoGrupo = false;
  guardandoGrupoEditado = false;
  guardandoMiembrosGrupo = false;

  hermanoAvisoSeleccionado: HermanoDto | null = null;
  resultadosBusquedaAviso: HermanoDto[] = [];
  busquedaAviso = '';
  buscandoAviso = false;

  private readonly API_BASE = 'http://localhost:8080';
  private timerBusquedaGrupo: ReturnType<typeof setTimeout> | null = null;
  private timerBusquedaAviso: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.http.get<any>(`${this.API_BASE}/grupos`).subscribe({
      next: (response) => {
        const gruposNormalizados = this.normalizarRespuesta(response);

        this.gruposResumen = gruposNormalizados.map((grupo: any) => ({
          idGrupo: grupo.idGrupo ?? grupo.id ?? grupo.id_grupo,
          nombre: grupo.nombre ?? grupo.nombreGrupo,
          numeroMiembros: grupo.numeroMiembros ?? 0
        }));

        if (this.grupoEditando) {
          const grupoActualizado = this.gruposResumen.find((grupo) => grupo.idGrupo === this.grupoEditando?.idGrupo);
          if (grupoActualizado) {
            this.grupoEditando.nombre = grupoActualizado.nombre;
            this.grupoEditando.numeroMiembros = grupoActualizado.numeroMiembros;
          }
        }
      },
      error: (error) => {
        console.error('Error cargando grupos en Avisos:', error);
        this.gruposResumen = [];
      }
    });
  }

  abrirEdicionGrupo(grupo: GrupoResumen): void {
    this.cargandoGrupoDetalle = true;
    this.busquedaGrupo = '';
    this.resultadosBusquedaGrupo = [];

    this.http.get<any>(`${this.API_BASE}/grupos/${grupo.idGrupo}`).subscribe({
      next: (response) => {
        const detalle = this.normalizarObjeto(response) as GrupoDetalle;

        this.grupoEditando = {
          idGrupo: detalle.idGrupo ?? grupo.idGrupo,
          nombre: detalle.nombre ?? grupo.nombre,
          numeroMiembros: detalle.numeroMiembros ?? grupo.numeroMiembros,
          idHermanos: detalle.idHermanos ?? []
        };
        this.nombreGrupoEditando = this.grupoEditando.nombre;
        this.miembrosGrupoEditando = [...this.grupoEditando.idHermanos];
        this.idGrupoSeleccionado = this.grupoEditando.idGrupo;

        if (this.miembrosGrupoEditando.length > 0) {
          this.cargarHermanosSeleccionadosGrupo(this.miembrosGrupoEditando);
        } else {
          this.hermanosGrupoSeleccionados = [];
        }

        this.cargandoGrupoDetalle = false;
      },
      error: (error) => {
        console.error('Error cargando detalle del grupo:', error);
        this.cargandoGrupoDetalle = false;
        alert('No se pudo cargar el grupo para editarlo.');
      }
    });
  }

  guardarGrupoEditado(): void {
    if (!this.grupoEditando) {
      return;
    }

    const nombre = this.nombreGrupoEditando.trim();
    if (!nombre) {
      alert('El nombre del grupo es obligatorio.');
      return;
    }

    this.guardandoGrupoEditado = true;

    this.http.put<any>(`${this.API_BASE}/grupos/${this.grupoEditando.idGrupo}`, { nombre }).subscribe({
      next: (response) => {
        const detalle = this.normalizarObjeto(response) as GrupoDetalle;

        this.grupoEditando = {
          idGrupo: detalle.idGrupo ?? this.grupoEditando?.idGrupo ?? 0,
          nombre: detalle.nombre ?? nombre,
          numeroMiembros: detalle.numeroMiembros ?? this.grupoEditando?.numeroMiembros ?? 0,
          idHermanos: detalle.idHermanos ?? this.miembrosGrupoEditando
        };
        this.nombreGrupoEditando = this.grupoEditando.nombre;
        this.guardandoGrupoEditado = false;
        this.cargarGrupos();
      },
      error: (error) => {
        console.error('Error guardando grupo:', error);
        this.guardandoGrupoEditado = false;
        alert(error?.error?.message ?? error?.error ?? 'No se pudo guardar el grupo.');
      }
    });
  }

  guardarMiembrosGrupo(): void {
    if (!this.grupoEditando) {
      return;
    }

    this.guardandoMiembrosGrupo = true;

    this.http.put<any>(`${this.API_BASE}/grupos/${this.grupoEditando.idGrupo}/hermanos`, {
      idHermanos: this.miembrosGrupoEditando
    }).subscribe({
      next: (response) => {
        const detalle = this.normalizarObjeto(response) as GrupoDetalle;

        this.grupoEditando = {
          idGrupo: detalle.idGrupo ?? this.grupoEditando?.idGrupo ?? 0,
          nombre: detalle.nombre ?? this.grupoEditando?.nombre ?? '',
          numeroMiembros: detalle.numeroMiembros ?? 0,
          idHermanos: detalle.idHermanos ?? [...this.miembrosGrupoEditando]
        };
        this.miembrosGrupoEditando = [...this.grupoEditando.idHermanos];
        this.guardandoMiembrosGrupo = false;
        this.cargarGrupos();
        this.cargarHermanosSeleccionadosGrupo(this.miembrosGrupoEditando);
      },
      error: (error) => {
        console.error('Error guardando miembros del grupo:', error);
        this.guardandoMiembrosGrupo = false;
        alert(error?.error?.message ?? error?.error ?? 'No se pudieron guardar los hermanos del grupo.');
      }
    });
  }

  cancelarEdicionGrupo(): void {
    this.grupoEditando = null;
    this.nombreGrupoEditando = '';
    this.miembrosGrupoEditando = [];
    this.hermanosGrupoSeleccionados = [];
    this.resultadosBusquedaGrupo = [];
    this.busquedaGrupo = '';
    this.idGrupoSeleccionado = null;
    this.cargandoGrupoDetalle = false;
    this.guardandoGrupoEditado = false;
    this.guardandoMiembrosGrupo = false;
  }

  seleccionarGrupoHermanos(hermano: HermanoDto): void {
    if (this.esHermanoSeleccionado(hermano.id)) {
      this.quitarHermanoDeGrupo(hermano.id);
      return;
    }

    this.agregarHermanoAGrupo(hermano);
  }

  esHermanoSeleccionado(idHermano: number): boolean {
    return this.miembrosGrupoEditando.includes(idHermano);
  }

  agregarHermanoAGrupo(hermano: HermanoDto): void {
    if (this.esHermanoSeleccionado(hermano.id)) {
      return;
    }

    this.miembrosGrupoEditando = [...this.miembrosGrupoEditando, hermano.id];
    this.hermanosGrupoSeleccionados = [...this.hermanosGrupoSeleccionados, hermano];
  }

  quitarHermanoDeGrupo(idHermano: number): void {
    this.miembrosGrupoEditando = this.miembrosGrupoEditando.filter((id) => id !== idHermano);
    this.hermanosGrupoSeleccionados = this.hermanosGrupoSeleccionados.filter((hermano) => hermano.id !== idHermano);
  }

  quitarHermanoSeleccionado(hermano: HermanoDto): void {
    this.quitarHermanoDeGrupo(hermano.id);
  }

  onBusquedaGrupoChange(termino: string): void {
    this.busquedaGrupo = termino;

    if (this.timerBusquedaGrupo) {
      clearTimeout(this.timerBusquedaGrupo);
    }

    const texto = termino.trim();
    if (texto.length < 2) {
      this.resultadosBusquedaGrupo = [];
      this.buscandoGrupo = false;
      return;
    }

    this.buscandoGrupo = true;
    this.timerBusquedaGrupo = setTimeout(() => {
      this.http.get<any>(`${this.API_BASE}/hermanos/buscar`, { params: { q: texto } }).subscribe({
        next: (response) => {
          const hermanos = this.normalizarRespuesta(response) as HermanoDto[];
          this.resultadosBusquedaGrupo = hermanos.filter((hermano) => !this.esHermanoSeleccionado(hermano.id));
          this.buscandoGrupo = false;
        },
        error: (error) => {
          console.error('Error buscando hermanos para grupo:', error);
          this.resultadosBusquedaGrupo = [];
          this.buscandoGrupo = false;
        }
      });
    }, 250);
  }

  cargarHermanosSeleccionadosGrupo(idsHermanos: number[]): void {
    if (idsHermanos.length === 0) {
      this.hermanosGrupoSeleccionados = [];
      return;
    }

    forkJoin(idsHermanos.map((id) => this.http.get<any>(`${this.API_BASE}/hermanos/${id}`))).subscribe({
      next: (response) => {
        this.hermanosGrupoSeleccionados = response.map((item) => this.normalizarObjeto(item) as HermanoDto);
      },
      error: (error) => {
        console.error('Error cargando hermanos seleccionados del grupo:', error);
        this.hermanosGrupoSeleccionados = [];
      }
    });
  }

  seleccionarHermanoAviso(hermano: HermanoDto): void {
    this.hermanoAvisoSeleccionado = hermano;
    this.idHermanoSeleccionado = hermano.id;
    this.resultadosBusquedaAviso = [];
    this.busquedaAviso = this.formatoHermano(hermano);
  }

  onBusquedaAvisoChange(termino: string): void {
    this.busquedaAviso = termino;

    if (this.timerBusquedaAviso) {
      clearTimeout(this.timerBusquedaAviso);
    }

    const texto = termino.trim();
    if (texto.length < 2) {
      this.resultadosBusquedaAviso = [];
      this.buscandoAviso = false;
      return;
    }

    this.buscandoAviso = true;
    this.timerBusquedaAviso = setTimeout(() => {
      this.http.get<any>(`${this.API_BASE}/hermanos/buscar`, { params: { q: texto } }).subscribe({
        next: (response) => {
          this.resultadosBusquedaAviso = this.normalizarRespuesta(response) as HermanoDto[];
          this.buscandoAviso = false;
        },
        error: (error) => {
          console.error('Error buscando hermanos para aviso:', error);
          this.resultadosBusquedaAviso = [];
          this.buscandoAviso = false;
        }
      });
    }, 250);
  }

  limpiarHermanoAviso(): void {
    this.hermanoAvisoSeleccionado = null;
    this.idHermanoSeleccionado = null;
    this.busquedaAviso = '';
    this.resultadosBusquedaAviso = [];
  }

  formatoHermano(hermano: HermanoDto): string {
    const numero = hermano.numeroHermano ? `#${hermano.numeroHermano}` : '';
    return `${hermano.nombre} ${hermano.primerApellido ?? ''} ${hermano.segundoApellido ?? ''} ${numero}`.trim().replace(/\s+/g, ' ');
  }

  crearGrupo(): void {
    const nombre = this.nombreNuevoGrupo.trim();

    if (!nombre) {
      this.errorGrupo = 'Debes escribir el nombre del grupo.';
      return;
    }

    this.creandoGrupo = true;
    this.errorGrupo = '';

    this.http.post<any>(`${this.API_BASE}/grupos`, { nombre }).subscribe({
      next: () => {
        this.creandoGrupo = false;
        this.nombreNuevoGrupo = '';
        this.errorGrupo = '';
        this.mostrarCrearGrupo = false;
        this.cargarGrupos();
      },
      error: (error) => {
        console.error('Error creando grupo:', error);
        this.creandoGrupo = false;
        this.errorGrupo = error?.error?.message ?? error?.error ?? 'No se pudo crear el grupo.';
      }
    });
  }

  enviarAviso(): void {
    if (!this.asuntoAviso.trim() || !this.mensajeAviso.trim()) {
      alert('Debes escribir un asunto y un mensaje.');
      return;
    }

    if (this.tipoDestinatario === 'HERMANO' && !this.idHermanoSeleccionado) {
      alert('Debes seleccionar un hermano.');
      return;
    }

    if (this.tipoDestinatario === 'GRUPO' && !this.idGrupoSeleccionado) {
      alert('Debes seleccionar un grupo.');
      return;
    }

    this.enviandoAviso = true;

    const payload = {
      tipoDestinatario: this.tipoDestinatario,
      idHermano: this.tipoDestinatario === 'HERMANO' ? this.idHermanoSeleccionado : null,
      idGrupo: this.tipoDestinatario === 'GRUPO' ? this.idGrupoSeleccionado : null,
      asunto: this.asuntoAviso,
      mensaje: this.mensajeAviso
    };

    this.http.post<any>(`${this.API_BASE}/avisos/enviar`, payload).subscribe({
      next: (response) => {
        this.enviandoAviso = false;

        const total = response?.totalEnviados ?? 0;
        alert(`Aviso enviado correctamente a ${total} destinatario/s.`);

        this.limpiarFormularioAviso();
      },
      error: (error) => {
        console.error('Error enviando aviso:', error);
        this.enviandoAviso = false;
        alert('No se pudo enviar el aviso.');
      }
    });
  }

  limpiarFormularioAviso(): void {
    this.tipoDestinatario = 'GRUPO';
    this.idHermanoSeleccionado = null;
    this.idGrupoSeleccionado = null;
    this.hermanoAvisoSeleccionado = null;
    this.busquedaAviso = '';
    this.resultadosBusquedaAviso = [];
    this.asuntoAviso = '';
    this.mensajeAviso = '';
  }

  normalizarRespuesta(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  normalizarObjeto(response: any): any {
    if (response?.content && !Array.isArray(response.content)) {
      return response.content;
    }

    if (response?.data && !Array.isArray(response.data)) {
      return response.data;
    }

    return response;
  }
}
