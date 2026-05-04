import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CensoListComponent } from '../../components/censo/censo-list.component';
import { GestionEconomicaComponent } from '../../components/gestion-economica/gestion-economica.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-hermanos',
  standalone: true,
  imports: [CommonModule, CensoListComponent, GestionEconomicaComponent],
  templateUrl: './hermanos.component.html',
  styleUrls: ['./hermanos.component.scss']
})
export class HermanosComponent {
  activeTab: 'hermanos' | 'economica' | 'informes' = 'hermanos';

  constructor(private readonly authService: AuthService) {}

  get isAdmin(): boolean {
    const user = this.authService.getUser();
    return !!user && user.role === 'ADMIN';
  }
}
