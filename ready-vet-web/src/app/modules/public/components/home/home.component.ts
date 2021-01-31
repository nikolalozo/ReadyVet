import { Component, OnInit } from '@angular/core';
import { faNotesMedical, faDog, faHeartbeat, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { FeedbackService } from '../../../shared/services/feedback.service';
import { MedicalServiceService } from '../../../shared/services/medical.service.service';
import { SessionService } from '../../../shared/services/session.service';
import { IUser } from '../../../shared/interfaces/interface';
import { get } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public readonly faNotesMedical = faNotesMedical;
  public readonly faDog = faDog;
  public readonly faHeartbeat = faHeartbeat;
  public readonly faQuoteRight = faQuoteRight;
  public user: IUser;
  public isPetOwner = false;
  public commentsGetParams = {
    limit: 20,
    page: 1
  };
  public where = {
    sort: '-createdAt',
    limit: 6,
    page: 1,
    search: '',
  };
  public medicalServices = [];
  public totalMedicalServices: number;
  public feedbacksFetching = false;
  public feedbacks = [];
  public feedbacksTotal: number;

  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly feedbackService: FeedbackService,
    private readonly medicalService: MedicalServiceService
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.user;
    this.findRole();
    this.getMedicalServices();
    this.feedbackService.getAllFeedbacks(this.commentsGetParams)
    .subscribe(res => {
      this.feedbacks = res.data;
      this.feedbacksTotal = res.total;
    });
  }

  getMedicalServices(page?) {
    this.medicalService.getAllMedicalServices(this.where)
    .subscribe(result => {
      this.medicalServices = result.data;
      this.totalMedicalServices = result.total;
    });
  }

  findRole() {
    if (this.user) {
      const role = get(this.user, 'role');
      if (role === 'ANIMAL_OWNER') {
        this.isPetOwner = true;
      }
    }
  }

  login() {
    this.router.navigate(['/vet/login']);
  }

  newRecord() {
    this.router.navigate(['/pet-owner/medical-service-request']);
  }

}
