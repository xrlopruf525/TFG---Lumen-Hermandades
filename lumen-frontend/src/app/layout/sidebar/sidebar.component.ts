import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private readonly desktopBreakpoint = 992;
  private navigationSubscription?: Subscription;

  @HostBinding('class.is-collapsed')
  isCollapsed = false;

  @HostBinding('class.is-mobile-open')
  isMobileOpen = false;

  currentUser = null as ReturnType<AuthService['getUser']>;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.syncResponsiveState();
    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobileViewport()) {
          this.isMobileOpen = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    if (this.isMobileViewport()) {
      this.isMobileOpen = !this.isMobileOpen;
      return;
    }

    this.isCollapsed = !this.isCollapsed;
  }

  closeMobileSidebar(): void {
    this.isMobileOpen = false;
  }

  onNavigate(): void {
    if (this.isMobileViewport()) {
      this.isMobileOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.syncResponsiveState();
  }

  private syncResponsiveState(): void {
    if (this.isMobileViewport()) {
      this.isCollapsed = false;
      return;
    }

    this.isMobileOpen = false;
  }

  private isMobileViewport(): boolean {
    return window.innerWidth < this.desktopBreakpoint;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  get isHermano(): boolean {
    return this.currentUser?.role === 'HERMANO';
  }
}
