import { Component } from '@angular/core';

import { CensoListComponent } from '../../components/censo/censo-list.component';

@Component({
  selector: 'app-hermanos',
  standalone: true,
  imports: [CensoListComponent],
  templateUrl: './hermanos.component.html',
  styleUrls: ['./hermanos.component.scss']
})
export class HermanosComponent {}
