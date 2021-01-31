import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { SocketIoService } from './socket.io.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly apiService: ApiService,
    private readonly sessionService: SessionService,
    private readonly socketIoService: SocketIoService,
    private readonly router: Router
  ) {}

  register(data: any): Observable<void> {
    return this.apiService.post('auth/register', data);
  }

  login({email, password}) {
    return this.apiService.post('auth/login', {email, password})
    .pipe(
      map(response => {
        this.sessionService.accessTokenObj = response.token;
        this.sessionService.user = response.user;
        return new Observable(observer => {
          observer.next(response);
          observer.complete();
        });
      }),
      catchError(err => this.apiService.showErrorMessage(err))
    );
  }

  logout() {
    this.sessionService.accessTokenObj = null;
    this.sessionService.user = null;
    this.router.navigate(['/vet/home']);
    this.socketIoService.disconnect();
  }

  getCurrentUser(): Observable<any> {
    return this.apiService.get('/auth/me');
  }
}
