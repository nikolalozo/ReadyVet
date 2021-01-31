import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get, isEmpty } from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IAnimal, IUser } from '../../../shared/interfaces/interface';
import { CreateFeedbackComponent } from '../create-feedback/create-feedback.component';
import { SessionService } from '../../../shared/services/session.service';
import { AnimalService } from '../../../shared/services/animal.service';
import { MedicalRecordService } from '../../../shared/services/medical.record.service';
import { FeedbackService } from '../../../shared/services/feedback.service';
import { NotifierService } from 'angular-notifier';
import { MedicalRecordDetailsComponent } from '../../medicalRecord- details/medicalRecord- details.component';

@Component({
  selector: 'app-animal-profile',
  templateUrl: './animal-profile.component.html',
  styleUrls: ['./animal-profile.component.css']
})
export class AnimalProfileComponent implements OnInit {
  public isVet = false;
  public currentPage = 1;
  private bsModalRef: BsModalRef;
  public today = new Date();
  public feedbacksForAnimal = [];
  private subcription: Subscription;
  public animal: IAnimal;
  // tslint:disable-next-line:variable-name
  public _animal: string;
  private _medicalRecord: string;
  public isPetOwner = false;
  // tslint:disable-next-line:variable-name
  public user: IUser;
  public disabledButton = false;
  public medicalRecords = [];
  public totalMedicalRecord: number;
  public where = {
    status: 'DONE',
    sort: '-createdAt',
    limit: 6,
    page: 1,
    search: '',
    _animal: ''
  };
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly notifier: NotifierService,
    private readonly modalService: BsModalService,
    private readonly animalService: AnimalService,
    private readonly sessionService: SessionService,
    private readonly feedbackService: FeedbackService,
    private readonly medicalRecordService: MedicalRecordService
  ) { }

  ngOnInit(): void {
    this.user = get(this.sessionService, 'user');
    if (get(this.user, 'role') === 'ANIMAL_OWNER') {
      this.isPetOwner = true;
    }

    this.user = get(this.sessionService, 'user');
    if (get(this.user, 'role') === 'VETERINARIAN') {
      this.isVet = true;
    }
    this._animal = get(this.route, 'snapshot.params._animal');
    this.where._animal = this._animal;
    this.getAnimal();
    this.subcription = this.route
      .queryParams
      .subscribe(params => {
        this._medicalRecord = get(params, '_medicalRecord');
        if (!isEmpty(this._medicalRecord)) {
          this.disabledButton = true;
        }
      });
  }

  getAnimal() {
    this.animalService.getOneAnimal(get(this.sessionService, 'user.role') === 'ANIMAL_OWNER' ? get(this.user, '_id') : null, this._animal)
      .subscribe(res => {
        this.animal = res;
        this.getAllMedicalRecords();
      });
  }

  getAllMedicalRecords() {
    this.medicalRecordService.getAllMedicalRecords(this.where)
      .subscribe(res => {
        this.medicalRecords = res.data;
        this.totalMedicalRecord = res.total;
        let _records = [];
        if (this.medicalRecords && this.medicalRecords[0]) {
          _records = this.medicalRecords.map(el => el._id);
          this.feedbackService.getFeedbacksByRecordIds({ _records }).subscribe(result => {
            this.feedbacksForAnimal = result.data;
          });
        }
      });
  }

  getDate(date) {
    return moment(date).format('DD.MM.YYYY');
  }

  getAnimalGender(gender: string): string {
    if (gender === 'MUZJAK') {
      return 'Mužjak';
    } else {
      return 'Ženka';
    }
  }

  getAnimalType(type: string): string {
    if (type === 'PAS') {
      return 'Pas';
    } else if (type === 'MACKA') {
      return 'Macka';
    } else {
      return 'Zec';
    }
  }

  createNewExamination() {
    this.router.navigate(['/veterinarian/animals', this._animal, 'add-medical-examination', this._medicalRecord]);
  }

  createFeedback(data: any) {
    this.feedbackService.saveFeedback(data).subscribe(res => {
      this.notifier.notify('success', 'Komentar je uspesno dodat');
      this.feedbacksForAnimal.push(get(res, '_id'));
    }, err => {
      this.notifier.notify('error', 'Komentar nije dodat');
    });
  }

  canPutFeedback(date: any, id: string): boolean {
    let index = -1;
    const dateOfExamination = new Date(date);
    if (this.feedbacksForAnimal && this.feedbacksForAnimal[0]) {
      index = this.feedbacksForAnimal.findIndex(el => el._medicalRecord === id);
    }
    if (this.today.getDate() - dateOfExamination.getDate() > 7 || index !== -1) {
      return false;
    } else {
      return true;
    }
  }

  openModal(id: string) {
    const initialState = {
      title: 'Dodajte utisak'
    };

    this.bsModalRef = this.modalService.show(CreateFeedbackComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Odustani';
    this.bsModalRef.content.confirmBtnName = 'Potvrdi';
    this.bsModalRef.content.confirmColor = 'btn-outline-primary';
    this.bsModalRef.content.closeColor = 'btn-outline-danger';

    this.bsModalRef.content.action
      .subscribe((value) => {
        if (value) {
          this.createFeedback({ _medicalRecord: id, mark: get(value, 'mark'), comment: get(value, 'comment') });
        }
        return value;
      }, () => {
        return false;
      });
  }

  openModalForMoreDetails(medical: any) {
    const initialState = {
      description: get(medical, 'description'),
      medicines: get(medical, 'medicines'),
      price: get(medical, 'price'),
      veterinarian: `${get(medical, '_veterinarian.name')} ${get(medical, '_veterinarian.surname')}`,
      animalBreed: this.animal.animalBreed,
      animalType: this.animal.animalType,
      title: 'Detaljnije'
    };
    this.bsModalRef = this.modalService.show(MedicalRecordDetailsComponent, { initialState });
    this.bsModalRef.content.confirmBtnName = 'Stampaj PDF';
    this.bsModalRef.content.confirmColor = 'btn-outline-primary';
  }

  calculate(i: number): number {
    if (this.currentPage > 1) {
      return ((this.currentPage - 1) * this.where.limit) + i;
    } else {
      return i;
    }
  }

}
