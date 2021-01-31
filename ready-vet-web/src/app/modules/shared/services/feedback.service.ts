import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IFeedback } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(
    private apiService: ApiService
  ) {}

  getAllFeedbacks(where) {
    return this.apiService.get(`/feedbacks`, where);
  }

  getFeedbacksByRecordIds(data: any) {
    return this.apiService.post(`/feedbacks/get-feedbacks-by-record-ids`, data);
  }

  getOneFeedback(id: string) {
    return this.apiService.get(`/feedbacks/${id}`);
  }

  saveFeedback(data: IFeedback) {
    return this.apiService.post(`/feedbacks`, data);
  }

  deleteMedicalService(id: string) {
    return this.apiService.delete(`/feedbacks/${id}`);
  }
}
