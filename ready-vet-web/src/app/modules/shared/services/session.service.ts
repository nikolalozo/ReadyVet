import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
  useFactory: () => new SessionService(localStorage.getItem('accessTokenObj'), localStorage.getItem('user'))
 })
export class SessionService {
  // tslint:disable-next-line:variable-name
  private _accessTokenObj: string;
  // tslint:disable-next-line:variable-name
  private _user: any;

  constructor(accTokenObj: string, userObj: string) {
    try {
      this.accessTokenObj = JSON.parse(accTokenObj);
      this.user = JSON.parse(userObj);
    } catch (err) {
      localStorage.removeItem('accessTokenObj');
      localStorage.removeItem('user');
    }
  }

  public get accessTokenObj(): string {
    return this._accessTokenObj;
  }

  public set accessTokenObj(value: string) {
    this._accessTokenObj = value;
    if (value) {
      localStorage.setItem('accessTokenObj', JSON.stringify(value));
    } else {
      localStorage.removeItem('accessTokenObj');
    }
  }

  public get user(): any {
    return this._user;
  }

  public set user(value: any) {
    this._user = value;
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      localStorage.removeItem('user');
    }
  }
}
