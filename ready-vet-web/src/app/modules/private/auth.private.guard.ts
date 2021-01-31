import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, CanActivateChild } from '@angular/router';
import { get } from 'lodash';
import { SessionService } from '../shared/services/session.service';

@Injectable({ providedIn: 'root' })
export class AuthPrivateVeterinarianGuard implements CanActivate, CanLoad, CanActivateChild {
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
    if (accessToken && get(user, 'role') === 'VETERINARIAN' || accessToken && get(user, 'role') === 'ADMIN') {
      return true;
    }

    this.router.navigate(['/pet-owner/home-pet']);
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthPrivatePetOwnerGuard implements CanActivate, CanLoad {
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
    if (accessToken && get(user, 'role') === 'ANIMAL_OWNER') { return true; }
    this.router.navigate(['/veterinarian/home-vet']);
    return false;
  }
}
export const appPrivateRoutingProviders: any[] = [AuthPrivateVeterinarianGuard, AuthPrivatePetOwnerGuard];

