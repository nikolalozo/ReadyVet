import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { get } from 'lodash';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { SessionService } from '../../../shared/services/session.service';
import { FeedbackService } from 'src/app/modules/shared/services/feedback.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { IUser } from 'src/app/modules/shared/interfaces/interface';

@Component({
  selector: 'app-vet-profile',
  templateUrl: './vet-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./vet-profile.component.css']
})
export class VetProfileComponent implements OnInit {
  public baseUrl = environment.baseUrl;
  public previewUrl: any;
  public imgFile = null;
  closeResult: string;
  public veterinarian: IUser;
  public _id: string;
  public userWantToAddEduc = false;
  public isLoggedVet = false;
  public feedbacks = [];
  public vetFeedbacks = [];
  public totalFeedbacks = 0;
  public selected = 0;
  public vetComment: string;
  public filter: string;
  public whereFeedback = {
    sort: '',
    limit: 0,
    page: 1,
    search: ''
  };
  public error = {
    image: false
  };
  constructor(
    private readonly notifier: NotifierService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly feedbackService: FeedbackService,
    private readonly sessionService: SessionService,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this._id = get(this.route, 'snapshot.params._id');
    if (get(this.sessionService, 'user._id') && get(this.sessionService, 'user.role') === 'VETERINARIAN') {
      this.isLoggedVet = true;
    }
    this.getVeterinarian();
    this.getFeedbacks();
  }

  getVeterinarian() {
    this.userService.getOneUser(this._id).subscribe(res => this.veterinarian = res);
  }

  getFeedbacks() {
    this.feedbackService.getAllFeedbacks(this.whereFeedback)
      .subscribe(res => {
        this.feedbacks = res.data;
        this.calculateAverage();
      });
  }

  getDate(date) {
    return moment(date).format('DD.MM.YYYY');
  }

  calculateAverage() {
    let totalSum = 0;
    let total = 0;
    this.feedbacks.forEach(feedback => {
      const vet = get(feedback, '_medicalRecord._veterinarian');
      if (this._id === vet) {
        totalSum += get(feedback, 'mark');
        total += 1;
        this.vetFeedbacks.push(feedback);
      }
    });
    this.totalFeedbacks = total;
    this.veterinarian = { ...this.veterinarian, averageMark: Math.round((totalSum / total + Number.EPSILON) * 100) / 100 };
  }

  editProfile() {
    if (!this.imgFile) { return; }
    this.userService.updateUser({ _id: get(this.sessionService, 'user._id') }, this.imgFile)
      .subscribe(res => {
        this.veterinarian.image = res.image;
        this.imgFile = null;
        this.previewUrl = null;
        this.notifier.notify('success', 'Slika je sacuvana');
      }, err => {
        this.notifier.notify('error', 'Slika nije sacuvana');
      }
      );
  }

  changeEducation() {
    this.userWantToAddEduc = true;
  }

  updateUser() {
    this.userService.updateUser(this.veterinarian)
    .subscribe(res => {
      this.userWantToAddEduc = false;
      this.notifier.notify('success', 'Obrazovanje izmenjeno');
    }, err => {
      this.notifier.notify('error', 'Obrazovanje nije izmenjeno');
    }
    );
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  uploadFile(event) {
    this.error.image = false;
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) { return; }
    const mimeType = get(file, 'type');
    if (!mimeType) {
      this.notifier.notify('error', 'Ovaj tip fajla nije dozvoljen.');
      this.error.image = true;
      return;
    } else if (mimeType && mimeType.match(/image\/jpg|jpeg|png/) == null) {
      this.notifier.notify('error', 'Ovaj tip fajla nije dozvoljen.');
      this.error.image = true;
      return;
    }

    this.imgFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
  }

  clearImage(fileInput): void {
    this.imgFile = null;
    fileInput.value = '';
    this.previewUrl = '';
    if (!get(this.veterinarian, 'image.filename')) {
      this.previewUrl = `../../../../../assets/images/avatar.jpg`;
    } else {
      this.previewUrl = this.veterinarian.image.fileName;
    }
  }

  generateUrl(image): string {
    if (get(image, 'filename')) {
      return `${this.baseUrl}/users/${get(image, 'filename')}`;
    } else {
      return `../../../../../assets/images/avatar.jpg`;
    }
  }
}
