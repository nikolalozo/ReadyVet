import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IMedicalService } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class MedicalServiceService {
  constructor(
    private apiService: ApiService
  ) {}

  getAllMedicalServices(where) {
    return this.apiService.get(`/medical-services`, where);
  }

  getOneMedicalService(id: string) {
    return this.apiService.get(`/medical-services/${id}`);
  }

  saveMedicalService(data: IMedicalService) {
    if (!data._id) {
      return this.apiService.post(`/medical-services`, data);
    } else {
      return this.apiService.put(`/medical-services/${data._id}`, data);
    }
  }

  deleteMedicalService(id: string) {
    return this.apiService.delete(`/medical-services/${id}`);
  }
}
