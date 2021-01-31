import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { get } from 'lodash';
import { NotifierService } from 'angular-notifier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from '../confirm/confirm.component';
import { environment } from '../../../../../environments/environment';
import { UserType } from '../../../shared/enum/user.type.enum';
import { IUser } from '../../../shared/interfaces/interface';
import { UserService } from '../../../shared/services/user.service';
import { FeedbackService } from '../../../shared/services/feedback.service';
import { SessionService } from '../../../shared/services/session.service';

@Component({
  selector: 'app-veterinarians-profiles',
  templateUrl: './veterinarians-profiles.component.html',
  styleUrls: ['./veterinarians-profiles.component.css']
})
export class VeterinariansProfilesComponent implements OnInit {
  public baseUrl = environment.baseUrl;
  private bsModalRef: BsModalRef;
  public isAdmin = false;
  public feedbacks = [];
  public veterinarians = [];
  public user: IUser;
  public totalVeterinarians: number;
  public where = {
    sort: '-createdAt',
    limit: 15,
    page: 1,
    search: '',
    role: UserType.VETERINARIAN
  };
  public whereFeedback = {
    sort: '',
    limit: 0,
    page: 1,
    search: ''
  };


  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly modalService: BsModalService,
    private readonly notifier: NotifierService,
    private readonly userService: UserService,
    private readonly feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
    this.getVeterinarians();
    this.user = get(this.sessionService, 'user');
    if (this.user && get(this.user, 'role') === 'ADMIN') {
      this.isAdmin = true;
    }
  }

  getVeterinarians(page?) {
    this.userService.getAllUsers({ ...this.where, page: page || this.where.page })
      .subscribe(result => {
        this.veterinarians = result.data;
        this.totalVeterinarians = result.total;
        this.getFeedbacks();
      });
  }

  getFeedbacks() {
    this.feedbackService.getAllFeedbacks(this.whereFeedback)
      .subscribe(res => {
        this.feedbacks = res.data;
        this.calculateAverage();
      });
  }

  goToProfile(id: string) {
    if (this.user) {
      const role = get(this.user, 'role');
      if (role === 'ANIMAL_OWNER') {
        this.router.navigate([`/pet-owner/veterinarian/${id}`]);
      } else if (role === 'ADMIN') {
        this.router.navigate([`veterinarian/profile/${id}`]);
      }
    } else {
      this.router.navigate([`/vet/veterinarian/${id}`]);
    }
  }

  calculateAverage() {
    this.veterinarians.forEach((el, index) => {
      let totalSum = 0;
      let total = 0;
      this.feedbacks.forEach(feedback => {
        const vet = get(feedback, '_medicalRecord._veterinarian');
        if (get(el, '_id') === vet) {
          totalSum += get(feedback, 'mark');
          total += 1;
        }
      });
      this.veterinarians[index] = { ...el, averageMark: Math.round((totalSum / total + Number.EPSILON) * 100) / 100 };
    });
  }

  generateUrl(image: any): string {
    if (get(image, 'filename')) {
      return `${this.baseUrl}/users/${get(image, 'filename')}`;
    } else {
      return `../../../../../assets/images/avatar.jpg`;
    }
  }

  removeVet(id: string) {
    this.userService.deleteUser(id).subscribe(res => {
      this.notifier.notify('success', 'Veterinar je uspesno obrisan');
      this.getVeterinarians();
    }, err => {
      this.notifier.notify('error', 'Veterinar nije uspesno obrisan');
    });
  }

  openModal(id: string) {
    const initialState = {
      message: 'Da li stvarno hocete da obrisete veterinara?',
      title: 'Obrisite veterinara'
    };

    this.bsModalRef = this.modalService.show(ConfirmComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Odustani';
    this.bsModalRef.content.confirmBtnName = 'Potvrdi';
    this.bsModalRef.content.confirmColor = 'btn-outline-danger';
    this.bsModalRef.content.closeColor = 'btn-outline-primary';

    this.bsModalRef.content.action
      .subscribe((value) => {
        if (value) {
          this.removeVet(id);
        }
        return value;
      }, () => {
        return false;
      });
  }
}
