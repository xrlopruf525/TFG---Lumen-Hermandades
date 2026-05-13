import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AvisoService, AvisoRequest } from '../../../core/services/aviso.service';
import { GrupoService, Grupo } from '../../../core/services/grupo.service';
import { HermanoService } from '../../../core/services/hermano.service';
import { Hermano } from '../../../models/hermano.model';

@Component({
  selector: 'app-envio-avisos',
  templateUrl: './envio-avisos.component.html',
  styleUrls: ['./envio-avisos.component.scss']
})
export class EnvioAvisosComponent implements OnInit {
  formularioAviso: FormGroup;
  grupos: Grupo[] = [];
  hermanos: Hermano[] = [];
  tiposDestinatario = ['GRUPO', 'HERMANO', 'TODOS'];
  cargando = false;
  enviado = false;
  mensaje = '';
  totalEnviados = 0;

  constructor(
    private fb: FormBuilder,
    private avisoService: AvisoService,
    private grupoService: GrupoService,
    private hermanoService: HermanoService
  ) {
    this.formularioAviso = this.fb.group({
      tipoDestinatario: ['GRUPO', Validators.required],
      idGrupo: [''],
      idHermano: [''],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.cargarGrupos();
    this.cargarHermanos();
    
    this.formularioAviso.get('tipoDestinatario')?.valueChanges.subscribe((tipo) => {
      const controlGrupo = this.formularioAviso.get('idGrupo');
      const controlHermano = this.formularioAviso.get('idHermano');
      
      if (tipo === 'GRUPO') {
        controlGrupo?.setValidators([Validators.required]);
        controlHermano?.clearValidators();
      } else if (tipo === 'HERMANO') {
        controlHermano?.setValidators([Validators.required]);
        controlGrupo?.clearValidators();
      } else {
        controlGrupo?.clearValidators();
        controlHermano?.clearValidators();
      }
      
      controlGrupo?.updateValueAndValidity();
      controlHermano?.updateValueAndValidity();
    });
  }

  cargarGrupos() {
    this.grupoService.listarGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
      },
      error: (error) => {
        console.error('Error al cargar grupos', error);
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

  enviarAviso() {
    if (this.formularioAviso.invalid) {
      alert('Completa todos los campos requeridos');
      return;
    }

    const tipoDestinatario = this.formularioAviso.get('tipoDestinatario')?.value;
    
    const avisoRequest: AvisoRequest = {
      tipoDestinatario,
      asunto: this.formularioAviso.get('asunto')?.value,
      mensaje: this.formularioAviso.get('mensaje')?.value
    };

    if (tipoDestinatario === 'GRUPO') {
      avisoRequest.idGrupo = Number(this.formularioAviso.get('idGrupo')?.value);
    } else if (tipoDestinatario === 'HERMANO') {
      avisoRequest.idHermano = Number(this.formularioAviso.get('idHermano')?.value);
    }

    this.cargando = true;
    this.enviado = false;

    this.avisoService.enviarAviso(avisoRequest).subscribe({
      next: (response) => {
        this.totalEnviados = response.totalEnviados;
        this.mensaje = `✓ Aviso enviado a ${response.totalEnviados} hermano(s)`;
        this.enviado = true;
        this.formularioAviso.reset({
          tipoDestinatario: 'GRUPO'
        });
        this.cargando = false;

        setTimeout(() => {
          this.enviado = false;
          this.mensaje = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Error al enviar aviso', error);
        this.mensaje = 'Error al enviar el aviso';
        this.enviado = true;
        this.cargando = false;
      }
    });
  }

  obtenerNombreGrupo(idGrupo: number): string {
    const grupo = this.grupos.find(g => g.id === idGrupo);
    return grupo?.nombre || '';
  }

  obtenerNombreHermano(idHermano: number): string {
    const hermano = this.hermanos.find(h => h.id === idHermano);
    return hermano ? `${hermano.nombre} ${hermano.primer_apellido}` : '';
  }
}
