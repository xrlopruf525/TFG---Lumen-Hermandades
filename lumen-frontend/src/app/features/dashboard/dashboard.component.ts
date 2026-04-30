import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { HermanoService } from '../../services/hermano.service';

interface Notice {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  date: Date;
}

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Metrics
  totalHermanos = 0;
  hermanosThisMonth = 12;
  upcomingEvents = 5;
  activeNotices = 3;
  recentActivity = 28;

  // Notices & Events
  notices: Notice[] = [];
  events: Event[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly hermanoService: HermanoService
  ) {}

  ngOnInit(): void {
    this.loadRealData();
    this.loadMockData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load real data from services
   */
  private loadRealData(): void {
    // Cargar hermanos reales del censo
    this.hermanoService
      .getHermanos({ page: 1, pageSize: 10000 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalHermanos = response.pagination?.total ?? 0;
        },
        error: (err) => {
          console.error('Error cargando hermanos:', err);
          this.totalHermanos = 0;
        }
      });
  }

  /**
   * Load mock data - replace with real service calls when API is ready
   */
  private loadMockData(): void {
    this.notices = [
      {
        id: 1,
        title: 'Junta General Ordinaria el próximo 15 de mayo',
        priority: 'high',
        date: new Date(2024, 4, 8, 10, 30)
      },
      {
        id: 2,
        title: 'Cambio de horario en procesión',
        priority: 'medium',
        date: new Date(2024, 4, 7, 14, 0)
      },
      {
        id: 3,
        title: 'Nuevas cuotas para el año fiscal',
        priority: 'low',
        date: new Date(2024, 4, 6, 9, 15)
      },
      {
        id: 4,
        title: 'Recordatorio: Envío de documentos por correo',
        priority: 'low',
        date: new Date(2024, 4, 5, 11, 45)
      }
    ];

    this.events = [
      {
        id: 1,
        title: 'Procesión de Pascua',
        date: new Date(2024, 4, 12),
        time: '09:00'
      },
      {
        id: 2,
        title: 'Junta de Gobierno',
        date: new Date(2024, 4, 15),
        time: '19:00'
      },
      {
        id: 3,
        title: 'Acto de caridad comunitaria',
        date: new Date(2024, 4, 18),
        time: '18:30'
      },
      {
        id: 4,
        title: 'Reunión de tesorería',
        date: new Date(2024, 4, 22),
        time: '19:30'
      }
    ];
  }

  /**
   * Quick action: Add new hermano - navigates to census form
   */
  onAddHermano(): void {
    this.router.navigate(['/hermanos']);
  }

  /**
   * Quick action: Send notice - will open notice creation modal/page
   */
  onSendNotice(): void {
    console.log('Enviar aviso...');
    // TODO: Navigate to notice creation or open modal
    // this.router.navigate(['/avisos/crear']);
  }

  /**
   * Quick action: Generate report - will download/generate report
   */
  onGenerateReport(): void {
    console.log('Generar informe...');
    // TODO: Call report service to generate and download report
    // this.reportService.generateReport().subscribe(...);
  }
}
