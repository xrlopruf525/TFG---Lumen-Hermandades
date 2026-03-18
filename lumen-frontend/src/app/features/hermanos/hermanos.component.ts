import { Component, OnInit } from '@angular/core';

import { Hermano } from '../../core/models/hermano.model';
import { HermanoService } from '../../core/services/hermano.service';

@Component({
  selector: 'app-hermanos',
  templateUrl: './hermanos.component.html',
  styleUrls: ['./hermanos.component.scss']
})
export class HermanosComponent implements OnInit {
  hermanos: Hermano[] = [];

  nuevoHermano = {
    nombre: '',
    apellidos: '',
    email: '',
    numeroHermano: null as number | null
  };

  pageSize = 5;
  pageIndex = 0;

  cargando = false;

  constructor(private readonly hermanoService: HermanoService) {}

  ngOnInit(): void {
    this.cargarHermanos();
  }

  cargarHermanos(): void {
    this.cargando = true;
    this.hermanoService.getHermanos().subscribe({
      next: (data) => {
        this.hermanos = data;
        this.pageIndex = 0;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    if (!this.nuevoHermano.nombre || !this.nuevoHermano.apellidos || !this.nuevoHermano.email || !this.nuevoHermano.numeroHermano) {
      return;
    }

    const hermanoAGuardar = {
      nombre: this.nuevoHermano.nombre,
      apellidos: this.nuevoHermano.apellidos,
      email: this.nuevoHermano.email,
      numeroHermano: String(this.nuevoHermano.numeroHermano)
    };

    this.hermanoService.saveHermano(hermanoAGuardar).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.cargarHermanos();
      },
      error: () => {
      }
    });
  }

  editarHermano(_hermano: Hermano): void {
  }

  borrarHermano(hermano: Hermano): void {
    this.hermanoService.deleteHermano(hermano.id).subscribe({
      next: () => {
        this.cargarHermanos();
      },
      error: () => {
      }
    });
  }

  private limpiarFormulario(): void {
    this.nuevoHermano = {
      nombre: '',
      apellidos: '',
      email: '',
      numeroHermano: null
    };
  }
}
