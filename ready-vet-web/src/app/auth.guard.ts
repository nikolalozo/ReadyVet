import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, CanActivateChild } from '@angular/router';
import { get } from 'lodash';
import { SessionService } from './modules/shared/services/session.service';

@Injectable({ providedIn: 'root' })
export class AuthPrivateGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.handle();
  }

  canLoad(route: Route): boolean {
    return this.handle();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.handle();
  }

  handle() {
    const accessToken = get(this.sessionService, 'accessTokenObj');
    const user = get(this.sessionService, 'user');
    if (accessToken && user) { return true; }
    this.router.navigate(['/vet/home']);
    return false;
  }
}

@Injectable()
export class AuthPublicGuard implements CanActivate, CanLoad {
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.handle();
  }

  canLoad(route: Route): boolean {
    return this.handle();
  }
  handle() {
    const accessToken = get(this.sessionService, 'accessTokenObj');
    const user = this.sessionService.user;
    if (
      (!accessToken && !user) ||
      (!accessToken || !user)
    ) { return true; }
    this.router.navigate(['/veterinarian/home-vet']);
    return false;
  }
}

export const appRoutingProviders: any[] = [AuthPrivateGuard, AuthPublicGuard];

