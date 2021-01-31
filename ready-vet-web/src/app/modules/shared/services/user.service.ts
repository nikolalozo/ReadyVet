import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IUser } from '../interfaces/interface';

@Injectable ({ providedIn: 'root' })
export class UserService {
  constructor(
    private apiService: ApiService
  ) {}

  getAllUsers(where) {
    return this.apiService.get(`/users`, where);
  }

  getUsersInLastWeek() {
    return this.apiService.get(`/users/get-users-last-week`, null);
  }

  getOneUser(id: string) {
    return this.apiService.get(`/users/${id}`);
  }

  updateUser(data: any, image?) {
    if (!image) {
      return this.apiService.put(`/users/${data._id}`, data);
    } else {
      return this.apiService.file([`/users/${data._id}/change-photo`],
      'put',
      data,
      'image',
      image);
    }
  }

  deleteUser(id: string) {
    return this.apiService.delete(`/users/${id}`);
  }
}
