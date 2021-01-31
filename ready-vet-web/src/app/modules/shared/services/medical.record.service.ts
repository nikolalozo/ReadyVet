import { Injectable } from '@angular/core';
import { get, isEmpty } from 'lodash';
import { ApiService } from './api.service';
import { IMedicalRecord } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService {
  constructor(
    private apiService: ApiService
  ) {}

  getAllMedicalRecords(where) {
    return this.apiService.get(`/medical-records`, where);
  }

  getExaminationsInLastWeek() {
    return this.apiService.get(`/medical-records/get-examinations-last-week`, null);
  }

  getMedRecordsForAnimalIds(data) {
    return this.apiService.post(`/medical-records/get-all-by-animal-ids`, data);
  }

  getOneMedicalRecord(id: string) {
    return this.apiService.get(`/medical-records/${id}`);
  }

  saveMedicalRecord(data: IMedicalRecord) {
    if (isEmpty(get(data, '_id'))) {
      return this.apiService.post(`/medical-records`, data);
    } else {
      return this.apiService.put(`/medical-records/${data._id}`, data);
    }
  }

  deleteMedicalRecord(query, id: string) {
    return this.apiService.delete(`/medical-records/${id}`, query);
  }
}
