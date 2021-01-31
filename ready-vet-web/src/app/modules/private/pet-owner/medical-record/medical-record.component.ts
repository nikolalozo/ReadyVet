import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { get, isEmpty } from 'lodash';
import { IMedicalRecord, IUser } from '../../../shared/interfaces/interface';
import { MedicalRecordStatusType } from '../../../shared/enum/medical.record.status.type.enum';
import { ChooseDoctorComponent } from '../../choose-doctor/choose-doctor.component';
import { ChooseAnimalComponent } from '../../choose-animal/choose-animal.component';
import { MedicalRecordService } from '../../../shared/services/medical.record.service';
import { MedicalServiceService } from '../../../shared/services/medical.service.service';
import { UserService } from '../../../shared/services/user.service';
import { FeedbackService } from '../../../shared/services/feedback.service';
import { TimeScheduleService } from '../../../shared/services/time.schedule.service';
import { AnimalService } from '../../../shared/services/animal.service';
import { SessionService } from '../../../shared/services/session.service';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css']
})
export class MedicalRecordComponent implements OnInit {
  public readonly faCalendarAlt = faCalendarAlt;
  public colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  public isCreatingInProgress = false;
  public hoursChosen = true;
  private bsModalRef: BsModalRef;
  public availableHours = [];
  public _selectedAnimal = '';
  public where = {
    sort: '-createdAt',
    limit: 200,
    page: 1,
    search: '',
    role: 'VETERINARIAN'
  };
  public whereFeedback = {
    sort: '',
    limit: 0,
    page: 1,
    search: ''
  };
  public medicalServices = [];
  public veterinarians = [];
  public feedbacks = [];
  public animals = [];
  public totalAnimals: number;
  public totalVeterinarians: number;
  public withoutMedRec = true;
  public data: IMedicalRecord = {
    _veterinarian: '',
    _service: '',
    date: new Date(),
    status: MedicalRecordStatusType.REQUEST_SENT
  };
  public today = new Date();
  // tslint:disable-next-line:variable-name
  public _user: string;

  constructor(
    private readonly router: Router,
    private readonly notifier: NotifierService,
    private readonly modalService: BsModalService,
    private readonly sessionService: SessionService,
    private readonly medicalRecordService: MedicalRecordService,
    private readonly medicalService: MedicalServiceService,
    private readonly userService: UserService,
    private readonly feedbackService: FeedbackService,
    private readonly timeScheduleService: TimeScheduleService,
    private readonly animalService: AnimalService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, selectWeekDateRange: true, showWeekNumbers:false, minDate: this.today });
  }

  ngOnInit(): void {
    this.getMedicalServices();
    this.getVeterinarians();
    this.getTimeSchedules();
    this.getUsersAnimals();
  }

  getMedicalServices() {
    this.medicalService.getAllMedicalServices(this.where)
      .subscribe(result => {
        this.medicalServices = result.data;
      });
  }

  getVeterinarians() {
    this.userService.getAllUsers(this.where)
      .subscribe(result => {
        this.veterinarians = result.data;
        this.totalVeterinarians = result.total;
        this.getFeedbacks();
      });
  }

  getTimeSchedules() {
    this.data.date.setMinutes(0, 0);
    this.timeScheduleService.getAllTimeSchedules({ ...this.where, date: this.data.date })
      .subscribe(result => {
        const reservedTimeSchedules = result.data;
        this.searchFreeHours(reservedTimeSchedules);
      });
  }

  getUsersAnimals() {
    this._user = get(this.sessionService, 'user._id');
    this.animalService.getAllAnimals({ ...this.where, _petOwner: this._user })
      .subscribe(result => {
        this.animals = result.data;
        this.totalAnimals = result.total;
      });
  }

  searchFreeHours(reservedHours) {
    reservedHours.forEach(el => {
      if (get(el, '_medicalRecord.status') === 'RESERVED') {
        const date = new Date(get(el, 'date'));
        const hours = date.getHours();
        const index = this.availableHours.findIndex(hour => hour === hours);
        if (index > -1) {
          this.availableHours.splice(index, 1);
        }
      }
    });
  }

  onValueChange(value: Date): void {
    this.data.date = value;
    this.availableHours = [];
    const currentHours = this.today.getHours();
    if (this.data.date.getDay() !== 0 && this.data.date.getDay() !== 6) {
      if (value > this.today) {
        for (let i = 8; i <= 16; i++) {
          this.availableHours.push(i);
        }
      } else if (currentHours <= 15) {
        for (let i = 8; i <= 16; i++) {
          if (currentHours < i) {
            this.availableHours.push(i);
          }
        }
      }
    }
    this.getTimeSchedules();
  }

  chooseHour(hour: number) {
    this.data.date.setHours(hour);
    this.hoursChosen = false;
  }

  getSelectedHour(): string {
    return new Date(this.data.date).toLocaleString('en-us', { hour: 'numeric', minute: 'numeric' });
  }

  create(): void {
    if (this.isCreatingInProgress) { return; }
    this.isCreatingInProgress = true;
    this.data.date.setMinutes(0, 0);
    // tslint:disable-next-line:max-line-length
    this.medicalRecordService.saveMedicalRecord(this.withoutMedRec ? { ...this.data, _petOwner: this._user } : { ...this.data, _animal: this._selectedAnimal })
      .subscribe(res => {
        this.isCreatingInProgress = false;
        this.router.navigate(['/pet-owner/profile']);
        this.notifier.notify('success', 'Zahtev za pregled je poslat');
      }, error => {
        this.isCreatingInProgress = false;
      });
  }

  checkIfDataIsEmpty(): boolean {
    return isEmpty(this.data._veterinarian) || isEmpty(this.data._service) || isNaN(this.data.date.getTime()) || (!this.withoutMedRec && isEmpty(this._selectedAnimal));
  }

  getFeedbacks() {
    this.feedbackService.getAllFeedbacks(this.whereFeedback)
      .subscribe(res => {
        this.feedbacks = res.data;
        this.calculateAverage();
      });
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
      this.veterinarians[index] = { ...el, averageMark: totalSum / total };
    });
  }

  openModal() {
    const initialState = {
      veterinarians: this.veterinarians,
      totalVeterinarians: this.totalVeterinarians,
      title: 'Izaberite doktora'
    };

    this.bsModalRef = this.modalService.show(ChooseDoctorComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Cancel';
    this.bsModalRef.content.confirmBtnName = 'Confirm';
    this.bsModalRef.content.confirmColor = 'btn-outline-danger';
    this.bsModalRef.content.closeColor = 'btn-outline-primary';

    this.bsModalRef.content.action
      .subscribe((value) => {
        if (value) {
          this.data._veterinarian = get(value, '_id');
        }
        return value;
      }, () => {
        return false;
      });
  }

  openAnimalModal() {
    const initialState = {
      animals: this.animals,
      totalAnimals: this.totalAnimals,
      title: 'Izaberite zivotinju'
    };

    this.bsModalRef = this.modalService.show(ChooseAnimalComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Cancel';
    this.bsModalRef.content.confirmBtnName = 'Confirm';
    this.bsModalRef.content.confirmColor = 'btn-outline-danger';
    this.bsModalRef.content.closeColor = 'btn-outline-primary';

    this.bsModalRef.content.action
      .subscribe((value) => {
        if (value) {
          this._selectedAnimal = get(value, '_id');
        }
        return value;
      }, () => {
        return false;
      });
  }

  getName(): string {
    if (this.veterinarians && this.veterinarians[0] && !isEmpty(this.data._veterinarian)) {
      const selectedVeterinarian = this.veterinarians.find(el => el._id === this.data._veterinarian);
      return `${selectedVeterinarian.name} ${selectedVeterinarian.surname}`;
    } else {
      return '';
    }
  }

  getAnimal(): string {
    if (this.animals && this.animals[0] && !isEmpty(this._selectedAnimal)) {
      const selectedAnimal = this.animals.find(el => el._id === this._selectedAnimal);
      return `${selectedAnimal.animalType} ${selectedAnimal.animalBreed}`;
    } else {
      return '';
    }
  }

}
