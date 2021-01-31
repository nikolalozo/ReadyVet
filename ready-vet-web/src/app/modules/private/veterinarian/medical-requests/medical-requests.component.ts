import { Component, OnInit } from '@angular/core';
import { get, isEmpty } from 'lodash';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MedicalRecordService } from '../../../shared/services/medical.record.service';
import { SessionService } from '../../../shared/services/session.service';
import { MedicalServiceService } from '../../../shared/services/medical.service.service';
import { NotifierService } from 'angular-notifier';
import { SocketIoService } from '../../../shared/services/socket.io.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medical-requests',
  templateUrl: './medical-requests.component.html',
  styleUrls: ['./medical-requests.component.css']
})
export class MedicalRequestsComponent implements OnInit {
  public readonly faSearch = faSearch;
  public readonly faTrash = faTrash;
  public _user: string;
  private subscription: Subscription;
  public medicalRequests = [];
  public tempForMedRequests = [];
  public selectedServiceFilter = '';
  public selectedDateFilter = -1;
  public services = [];
  public totalServices: number;
  public totalMedicalRequests: number;
  public dateFilters = [ 'Danas', 'Sutra', 'Ove nedelje', 'Ovog meseca'];
  public currentPage = 1;
  public where = {
    sort: '-createdAt',
    limit: 7,
    page: 1,
    search: ''
  };
  constructor(
    private readonly sessionService: SessionService,
    private readonly notifier: NotifierService,
    private readonly socketIoService: SocketIoService,
    private readonly medicalService: MedicalServiceService,
    private readonly medicalRecordService: MedicalRecordService
  ) { }

  ngOnInit(): void {
    this._user = get(this.sessionService, 'user._id');
    this.getMedicalRequests();
    this.getMedicalServices();
    this.subscription = this.socketIoService.receivedNewReservation().subscribe(res => {
      this.receivedNewReservation(res);
    });
  }

  receivedNewReservation(data) {
    this.medicalRequests.unshift(data);
  }

  getMedicalServices() {
    this.medicalService.getAllMedicalServices(this.where)
      .subscribe(result => {
        this.services = result.data;
        this.totalServices = result.total;
      });
  }

  getMedicalRequests(page?) {
    if (page) {
      this.currentPage = page;
    }
    this.medicalRecordService.getAllMedicalRecords({ ...this.where, page: page || this.where.page, _veterinarian: this._user, status: 'REQUEST_SENT' })
      .subscribe(res => {
        this.medicalRequests = res.data;
        this.tempForMedRequests = res.data;
        this.totalMedicalRequests = res.total;
      });
  }

  getDate(date) {
    // tslint:disable-next-line:max-line-length
    return new Date(date).toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  }

  approveRequest(request: any) {
    this.medicalRecordService.saveMedicalRecord({ ...request, status: 'CONFIRMED_VET' }).subscribe(res => {
      this.getMedicalRequests();
      this.notifier.notify('success', 'Zahtev je potvrdjen');
    }, err => {
      this.notifier.notify('error', 'Zahtev ne moze biti potvrdjen');
    });
  }

  rejectRequest(request: any) {
    this.medicalRecordService.saveMedicalRecord({ ...request, status: 'REJECTED_VET' }).subscribe(res => {
      this.getMedicalRequests();
      this.notifier.notify('success', 'Zahtev je odbijen');
    }, err => {
      this.notifier.notify('error', 'Zahtev ne moze biti odbijen');
    });
  }

  getDateFilter(i: number) {
    this.selectedDateFilter = i;
  }

  getServiceFilter(id: string) {
    this.selectedServiceFilter = id;
  }

  filter() {
    this.medicalRequests = this.tempForMedRequests;
    if (!isEmpty(this.selectedServiceFilter)) {
      this.medicalRequests = this.medicalRequests.filter(el => get(el, '_service._id') === this.selectedServiceFilter);
    }
    if (this.selectedDateFilter > -1) {
      if (this.selectedDateFilter === 0) {
        this.medicalRequests = this.medicalRequests.filter(el => new Date(get(el, 'date')) === new Date());
      } else if (this.selectedDateFilter === 1) {
        this.medicalRequests = this.medicalRequests.filter(el => new Date(get(el, 'date')).getDate() === (new Date().getDate() + 1));
      } else if (this.selectedDateFilter === 2) {
        this.medicalRequests = this.medicalRequests.filter(el => this.getWeek(new Date(get(el, 'date'))) === this.getWeek(new Date()));
      } else {
        this.medicalRequests = this.medicalRequests.filter(el => new Date(get(el, 'date')).getFullYear() === new Date().getFullYear());
      }
    }
  }

  clearFilters() {
    this.selectedServiceFilter = '';
    this.selectedDateFilter = -1;
    this.medicalRequests = this.tempForMedRequests;
  }

  getWeek(date: Date) {
    const onejan: any = new Date(date.getFullYear(), 0, 1);
    const today: any = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfYear = ((today - onejan + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
  }

  calculate(i: number): number {
    if (this.currentPage > 1) {
      return ((this.currentPage - 1) * this.where.limit) + i;
    } else {
      return i;
    }
  }

}
