import { Component, OnInit } from '@angular/core';
import { get } from 'lodash';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { BsDatepickerInlineConfig } from 'ngx-bootstrap/datepicker';
import { SessionService } from '../../../shared/services/session.service';
import { TimeScheduleService } from '../../../shared/services/time.schedule.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-veterinarian',
  templateUrl: './home-veterinarian.component.html',
  styleUrls: ['./home-veterinarian.component.css']
})
export class HomeVeterinarianComponent implements OnInit {
  public readonly faClipboardList = faClipboardList;
  bsConfig: Partial<BsDatepickerInlineConfig>;
  public colorTheme = 'theme-dark-blue';
  public date = new Date();
  public todayMedicalRequests = [];
  public totalMedicalRequests: number;
  public _user: string;
  public availableHours = [];
  public schedule = [];
  public where = {
    sort: 'date',
    limit: 200,
    page: 1,
    search: '',
  };

  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly timeScheduleService: TimeScheduleService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, selectWeekDateRange: true, showWeekNumbers: false, daysDisabled: [0, 6] });
  }

  ngOnInit(): void {
    this._user = get(this.sessionService, 'user._id');
    this.getSchedule();
    for (let i = 8; i <= 16; i++) {
      this.availableHours.push(i);
    }
    this.getTodayMedicalRequests();
  }

  getSchedule() {
    this.date.setMinutes(0, 0);
    this.timeScheduleService.getAllTimeSchedules({ ...this.where, _veterinarian: this._user, date: this.date })
      .subscribe(res => {
        this.schedule = res.data;
      });
  }

  onValueChange(value: Date): void {
    this.date = value;
    this.getSchedule();
  }

  getDate(date) {
    // tslint:disable-next-line:max-line-length
    return new Date(date).toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  }

  getDateForCalendar(date) {
    // tslint:disable-next-line:max-line-length
    return new Date(date).toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  getServiceTitle(hour: number): any {
    let title = '';
    if (this.schedule && this.schedule[0]) {
      this.schedule.find(el => {
        const hours = new Date(get(el, 'date')).getHours();
        if (hours === hour) {
          title = el._medicalRecord._service.title.toString();
          return;
        }
      });
    }
    return title;
  }

  getPetOwner(hour: number): any {
    let nameSurname = '';
    if (this.schedule && this.schedule[0]) {
      this.schedule.find(el => {
        const hours = new Date(get(el, 'date')).getHours();
        if (hours === hour) {
          if (get(el._medicalRecord, '_animal._petOwner')) {
            // tslint:disable-next-line:max-line-length
            nameSurname = `${el._medicalRecord._animal._petOwner.name.toString()} ${el._medicalRecord._animal._petOwner.surname.toString()}`;
          } else {
            nameSurname = `${el._medicalRecord._petOwner.name.toString()} ${el._medicalRecord._petOwner.surname.toString()}`;
          }
          return;
        }
      });
    }
    return nameSurname;
  }

  getAnimal(hour: number): any {
    let animal = '';
    if (this.schedule && this.schedule[0]) {
      this.schedule.find(el => {
        const hours = new Date(get(el, 'date')).getHours();
        if (hours === hour) {
          if (get(el._medicalRecord, '_animal')) {
            animal = el._medicalRecord._animal.animalType.toString();
          } else {
            animal = 'Zivotinja nema otvoren karton';
          }
          return;
        }
      });
    }
    return animal;
  }

  getTodayMedicalRequests(page?) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // tslint:disable-next-line:max-line-length
    this.timeScheduleService.getAllTimeSchedules({ ...this.where, date: today, _veterinarian: this._user })
      .subscribe(res => {
        this.todayMedicalRequests = res.data;
        this.totalMedicalRequests = res.total;
      });
  }

  createNewAnimal(id: string) {
    this.router.navigate(['/veterinarian/new-animal-profile'], { queryParams: { _medicalRecord: id } });
  }

  goToAnimalProfile(id: string, animal: string) {
    this.router.navigate(['/veterinarian/animals', animal], { queryParams: { _medicalRecord: id } });
  }

  checkStatus(status: string): boolean {
    if (status === 'RESERVED') {
      return true;
    }
    else {
      return false;
    }
  }
}
