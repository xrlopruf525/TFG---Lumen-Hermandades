import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.checkAccess(route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.checkAccess(childRoute);
  }

  private checkAccess(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    const expectedRoles = route.data['roles'] as string[] | undefined;
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const user = this.authService.getUser();
    if (user && this.authService.hasAnyRole(expectedRoles)) {
      return true;
    }

    return this.router.createUrlTree([user?.roles?.includes('HERMANO') ? '/portal-hermano' : '/dashboard']);
  }
}
