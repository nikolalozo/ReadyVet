import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { NotifierService } from 'angular-notifier';
import { SessionService } from './session.service';
import { get } from 'lodash';

@Injectable()
export class ApiService {
  readonly API_URL = environment.apiUrl;

  private headers: HttpHeaders;
  private headersBlob: HttpHeaders;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly notifier: NotifierService,
    private readonly sessionService: SessionService
  ) {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
  }

  get(route: any, params?: HttpParams | { [param: string]: string | string[]; }): Observable<any> {
    this.headers = this.headers.set('Authorization', 'JWT ' + get(this.sessionService, 'accessTokenObj'));
    route = typeof route === 'object' ? route.join('/') : route;
    return this.httpClient.get(this.generateUrl(route), {
      params,
      headers: this.headers,
    }).pipe(
      map(this.extractData),
      catchError(err => this.showErrorMessage(err))
    );
  }

  post(route: any, body: any = {}): Observable<any> {
    this.headers = this.headers.set('Authorization', 'JWT ' + get(this.sessionService, 'accessTokenObj'));
    route = typeof route === 'object' ? route.join('/') : route;
    return this.httpClient.post(this.generateUrl(route), body, {
      headers: this.headers
    }).pipe(
      map(this.extractData),
      catchError(err => this.showErrorMessage(err))
    );
  }

  put(route: any, body: any): Observable<any> {
    this.headers = this.headers.set('Authorization', 'JWT ' + get(this.sessionService, 'accessTokenObj'));
    route = typeof route === 'object' ? route.join('/') : route;
    return this.httpClient.put(this.generateUrl(route), body, {
      headers: this.headers
    }).pipe(
      map(this.extractData),
      catchError(err => this.showErrorMessage(err))
    );
  }

  delete(route: any, params?: HttpParams): Observable<any> {
    this.headers = this.headers.set('Authorization', 'JWT ' + get(this.sessionService, 'accessTokenObj'));
    route = typeof route === 'object' ? route.join('/') : route;
    return this.httpClient.delete(this.generateUrl(route), {
      params,
      headers: this.headers
    }).pipe(
      map(this.extractData),
      catchError(err => this.showErrorMessage(err))
    );
  }

  file(route: any, reqMethod: 'post' | 'put', params = {}, fileName: string, file: any): Observable<any> {
    this.headers = this.headers.set('Authorization', 'JWT ' + get(this.sessionService, 'accessTokenObj'));
    route = typeof route === 'object' ? route.join('/') : route;

    let headers: HttpHeaders = Object.assign(Object.create(Object.getPrototypeOf(this.headers)), this.headers);
    headers = headers.delete('Content-Type');

    const formData: FormData = new FormData();

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      }
    }

    if (file) { formData.append(fileName, file); }
    return this.httpClient[reqMethod](this.generateUrl(route), formData, { headers })
      .pipe(
        map(this.extractData),
        catchError(err => this.showErrorMessage(this.showErrorMessage(err)))
      );
  }

  private generateUrl(route: string): string {
    return `${this.API_URL}${route.startsWith('/') ? route : '/' + route}`;
  }

  showErrorMessage(error) {
    this.notifier.notify('error', error);
    return throwError(error);
  }

  private extractData = (res: Response) => {
    return res || {};
  }
}
