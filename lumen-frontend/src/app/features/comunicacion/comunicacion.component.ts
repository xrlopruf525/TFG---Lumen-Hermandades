import { Component } from '@angular/core';

@Component({
  selector: 'app-comunicacion',
  templateUrl: './comunicacion.component.html',
  styleUrls: ['./comunicacion.component.scss']
})
export class ComunicacionComponent {
  activeTab = 'avisos';

  changeTab(tab: string) {
    this.activeTab = tab;
  }
}
