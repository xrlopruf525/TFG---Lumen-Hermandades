import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface GrupoResumen {
  idGrupo: number;
  nombre: string;
  numeroMiembros: number;
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

  hermanos: any[] = [];
  grupos: any[] = [];

  gruposResumen: GrupoResumen[] = [];
  nombreNuevoGrupo = '';
  creandoGrupo = false;
  errorGrupo = '';
  mostrarCrearGrupo = false;

  private readonly API_BASE = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarHermanos();
    this.cargarGrupos();
  }

  cargarHermanos(): void {
    this.http.get<any>(`${this.API_BASE}/hermanos`, {
        params: {
        page: 0,
        size: 10000
        }
    }).subscribe({
        next: (response) => {
        this.hermanos = this.normalizarRespuesta(response);
        },
        error: (error) => {
        console.error('Error cargando hermanos:', error);
        this.hermanos = [];
        }
    });
    }

  cargarGrupos(): void {
    this.http.get<any>(`${this.API_BASE}/grupos`).subscribe({
        next: (response) => {
        const gruposNormalizados = this.normalizarRespuesta(response);

        this.grupos = gruposNormalizados;

        this.gruposResumen = gruposNormalizados.map((grupo: any) => ({
            idGrupo: grupo.idGrupo ?? grupo.id ?? grupo.id_grupo,
            nombre: grupo.nombre ?? grupo.nombreGrupo,
            numeroMiembros: grupo.numeroMiembros ?? 0
        }));

        console.log('Grupos cargados en Avisos:', this.grupos);
        },
        error: (error) => {
        console.error('Error cargando grupos en Avisos:', error);
        this.grupos = [];
        this.gruposResumen = [];
        }
    });
    }

  crearGrupo(): void {
    const nombre = this.nombreNuevoGrupo.trim();

    if (!nombre) {
        this.errorGrupo = 'Debes escribir el nombre del grupo.';
        return;
    }

    this.creandoGrupo = true;
    this.errorGrupo = '';

    const payload = {
        nombre: nombre
    };

    this.http.post<any>(`${this.API_BASE}/grupos`, payload).subscribe({
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
        this.errorGrupo = error?.error || 'No se pudo crear el grupo.';
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
}