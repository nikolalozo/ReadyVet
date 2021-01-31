import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ITimeSchedule } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class TimeScheduleService {
  constructor(
    private apiService: ApiService
  ) {}

  getAllTimeSchedules(where) {
    return this.apiService.get(`/time-schedule`, where);
  }

  saveTimeSchedule(data: ITimeSchedule) {
    return this.apiService.post(`/time-schedule`, data);
  }

  deleteTimeSchedule(id: string) {
    return this.apiService.delete(`/time-schedule/${id}`);
  }
}
