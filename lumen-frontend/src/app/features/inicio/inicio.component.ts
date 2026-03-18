import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  readonly paneles = [
    { color: 'bg-primary', valor: 300, texto: 'Hermanos' },
    { color: 'bg-warning', valor: 10, texto: 'Cuotas pendientes' },
    { color: 'bg-purple', valor: 24, texto: 'Eventos del mes' },
    { color: 'bg-success', valor: 5, texto: 'Procesiones activas' }
  ];
}
