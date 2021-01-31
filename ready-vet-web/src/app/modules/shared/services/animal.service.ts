import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { ApiService } from './api.service';
import { IAnimal } from '../interfaces/interface';


@Injectable({ providedIn: 'root' })
export class AnimalService {
  constructor(
    private apiService: ApiService
  ) {}

  getAllAnimals(where) {
    return this.apiService.get(`/animals`, where);
  }

  getOneAnimal(petOwner: string, id: string) {
    if (isEmpty(petOwner)) {
      return this.apiService.get(`/animals/${id}`, null);
    } else {
      return this.apiService.get(`/animals/${id}`, { _petOwner: petOwner });
    }
  }

  saveAnimal(data: IAnimal) {
    if (!data._id) {
      return this.apiService.post(`/animals`, data);
    } else {
      return this.apiService.put(`/animals/${data._id}`, data);
    }
  }

  deleteAnimal(query, id: string) {
    return this.apiService.delete(`/animals/${id}`, query);
  }
}
