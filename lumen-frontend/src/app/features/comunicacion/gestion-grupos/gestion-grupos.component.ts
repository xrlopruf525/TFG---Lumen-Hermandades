import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrupoService, Grupo } from '../../../core/services/grupo.service';
import { HermanoService } from '../../../core/services/hermano.service';
import { Hermano } from '../../../models/hermano.model';

@Component({
  selector: 'app-gestion-grupos',
  templateUrl: './gestion-grupos.component.html',
  styleUrls: ['./gestion-grupos.component.scss']
})
export class GestionGruposComponent implements OnInit {
  grupos: Grupo[] = [];
  hermanos: Hermano[] = [];
  grupoSeleccionado: Grupo | null = null;
  hermanosDelGrupo: Hermano[] = [];
  formularioGrupo: FormGroup;
  formularioHermano: FormGroup;
  showFormularioGrupo = false;
  showFormularioHermano = false;
  editandoGrupo = false;
  cargando = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'success';

  constructor(
    private grupoService: GrupoService,
    private hermanoService: HermanoService,
    private fb: FormBuilder
  ) {
    this.formularioGrupo = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: [''],
      descripcion: ['']
    });

    this.formularioHermano = this.fb.group({
      idHermano: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarGrupos();
    this.cargarHermanos();
  }

  cargarGrupos() {
    this.cargando = true;
    this.grupoService.listarGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar grupos', error);
        this.mostrarMensaje('Error al cargar grupos', 'error');
        this.cargando = false;
      }
    });
  }

  cargarHermanos() {
    this.hermanoService.getHermanos({ page: 1, pageSize: 1000 }).subscribe({
      next: (response) => {
        this.hermanos = response.data;
      },
      error: (error) => {
        console.error('Error al cargar hermanos', error);
      }
    });
  }

  crearGrupo() {
    if (this.formularioGrupo.invalid) {
      this.mostrarMensaje('Completa todos los campos requeridos', 'error');
      return;
    }

    const nuevoGrupo: Grupo = this.formularioGrupo.value;
    this.cargando = true;

    this.grupoService.crearGrupo(nuevoGrupo).subscribe({
      next: (grupo) => {
        this.grupos.unshift(grupo);
        this.formularioGrupo.reset();
        this.showFormularioGrupo = false;
        this.mostrarMensaje('Grupo creado correctamente', 'success');
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al crear grupo', error);
        this.mostrarMensaje('Error al crear el grupo', 'error');
        this.cargando = false;
      }
    });
  }

  actualizarGrupo() {
    if (!this.grupoSeleccionado?.id || this.formularioGrupo.invalid) {
      this.mostrarMensaje('Completa todos los campos requeridos', 'error');
      return;
    }

    const grupoActualizado: Grupo = this.formularioGrupo.value;
    this.cargando = true;

    this.grupoService.actualizarGrupo(this.grupoSeleccionado.id, grupoActualizado).subscribe({
      next: (grupo) => {
        const index = this.grupos.findIndex(g => g.id === grupo.id);
        if (index !== -1) {
          this.grupos[index] = grupo;
        }
        this.grupoSeleccionado = grupo;
        this.showFormularioGrupo = false;
        this.editandoGrupo = false;
        this.mostrarMensaje('Grupo actualizado correctamente', 'success');
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al actualizar grupo', error);
        this.mostrarMensaje('Error al actualizar el grupo', 'error');
        this.cargando = false;
      }
    });
  }

  seleccionarGrupo(grupo: Grupo) {
    this.grupoSeleccionado = grupo;
    this.formularioGrupo.patchValue({
      nombre: grupo.nombre,
      tipo: grupo.tipo,
      descripcion: grupo.descripcion
    });
    this.cargarHermanosDelGrupo(grupo.id!);
    this.showFormularioGrupo = false;
    this.editandoGrupo = false;
  }

  cargarHermanosDelGrupo(idGrupo: number) {
    this.grupoService.obtenerHermanosDelGrupo(idGrupo).subscribe({
      next: (hermanos) => {
        this.hermanosDelGrupo = hermanos;
      },
      error: (error) => {
        console.error('Error al cargar hermanos del grupo', error);
        this.mostrarMensaje('Error al cargar hermanos del grupo', 'error');
      }
    });
  }

  iniciarEdicion() {
    this.editandoGrupo = true;
    this.showFormularioGrupo = true;
  }

  cancelarFormulario() {
    this.showFormularioGrupo = false;
    this.editandoGrupo = false;
    this.formularioGrupo.reset();
  }

  abrirFormularioHermano() {
    this.showFormularioHermano = true;
  }

  agregarHermano() {
    if (this.formularioHermano.invalid || !this.grupoSeleccionado?.id) {
      this.mostrarMensaje('Selecciona un hermano', 'error');
      return;
    }

    const idHermano = Number(this.formularioHermano.get('idHermano')?.value);
    this.cargando = true;

    this.grupoService.agregarHermanoAlGrupo(this.grupoSeleccionado.id, idHermano).subscribe({
      next: () => {
        this.cargarHermanosDelGrupo(this.grupoSeleccionado!.id!);
        this.formularioHermano.reset();
        this.showFormularioHermano = false;
        this.mostrarMensaje('Hermano agregado al grupo', 'success');
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al agregar hermano', error);
        this.mostrarMensaje('Error al agregar hermano al grupo', 'error');
        this.cargando = false;
      }
    });
  }

  hermanoYaEnGrupo(idHermano: number): boolean {
    return this.hermanosDelGrupo.some(h => h.id === idHermano);
  }

  quitarHermano(idHermano: number) {
    if (!this.grupoSeleccionado?.id || !confirm('¿Deseas quitar este hermano del grupo?')) {
      return;
    }

    this.cargando = true;
    this.grupoService.quitarHermanoDelGrupo(this.grupoSeleccionado.id, idHermano).subscribe({
      next: () => {
        this.cargarHermanosDelGrupo(this.grupoSeleccionado!.id!);
        this.mostrarMensaje('Hermano removido del grupo', 'success');
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al quitar hermano', error);
        this.mostrarMensaje('Error al remover hermano del grupo', 'error');
        this.cargando = false;
      }
    });
  }

  eliminarGrupo() {
    if (!this.grupoSeleccionado?.id || !confirm('¿Deseas eliminar este grupo?')) {
      return;
    }

    this.cargando = true;
    this.grupoService.eliminarGrupo(this.grupoSeleccionado.id).subscribe({
      next: () => {
        this.grupos = this.grupos.filter(g => g.id !== this.grupoSeleccionado!.id);
        this.grupoSeleccionado = null;
        this.hermanosDelGrupo = [];
        this.mostrarMensaje('Grupo eliminado correctamente', 'success');
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al eliminar grupo', error);
        this.mostrarMensaje('Error al eliminar el grupo', 'error');
        this.cargando = false;
      }
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

  obtenerNombreHermano(idHermano: number): string {
    const hermano = this.hermanos.find(h => h.id === idHermano);
    return hermano ? `${hermano.nombre} ${hermano.primer_apellido}` : 'Desconocido';
  }

  trackByHermanoId(index: number, hermano: Hermano): number {
    return hermano.id || index;
  }
}
