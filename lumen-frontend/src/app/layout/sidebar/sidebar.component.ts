import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

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

  esAdmin = true;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
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
}
