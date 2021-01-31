import { Component, OnInit } from '@angular/core';
import { get } from 'lodash';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../../../shared/services/session.service';
import { IUser } from '../../../shared/interfaces/interface';
import { AnimalService } from '../../../shared/services/animal.service';
import { MedicalRecordService } from '../../../shared/services/medical.record.service';
import { NotifierService } from 'angular-notifier';
import { SocketIoService } from '../../../shared/services/socket.io.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  public readonly faTrash = faTrash;
  private subscription: Subscription;
  public user: IUser;
  public animals = [];
  public animalsTotal: number;
  public requests = [];
  public requestsTotal: number;
  public where = {
    sort: '-createdAt',
    limit: 10,
    page: 1,
    search: '',
    _petOwner: ''
  };
  constructor(
    private readonly notifier: NotifierService,
    private readonly sessionService: SessionService,
    private readonly socketIoService: SocketIoService,
    private readonly animalService: AnimalService,
    private readonly medicalRecordService: MedicalRecordService
  ) { }

  ngOnInit(): void {
    this.subscription = this.socketIoService.receivedNewConfirmation().subscribe(res => {
      this.receivedNewConfirmation(res);
    });
    this.user = this.sessionService.user;
    this.where._petOwner = get(this.user, '_id');
    this.getAnimals();
  }

  receivedNewConfirmation(data) {
    if (this.requests && this.requests[0]) {
      const index = this.requests.findIndex(el => get(el, '_id') === get(data, '_id'));
      this.requests[index].status = 'CONFIRMED_VET';
    }
  }

  getAnimals(page?) {
    this.animalService.getAllAnimals({ ...this.where, page: page || this.where.page })
      .subscribe(res => {
        this.animals = res.data;
        this.animalsTotal = res.total;
        this.getMedicalRequests();
      });
  }

  getMedicalRequests() {
    // tslint:disable-next-line:variable-name
    const _animals = this.animals.map(el => el._id);
    this.medicalRecordService.getMedRecordsForAnimalIds({ _animals, _petOwner: get(this.user, '_id') })
      .subscribe(res => {
        this.requests = res.data;
        this.requestsTotal = res.total;
      });
  }

  getStatus(status: string) {
    if (status === 'REJECTED_VET') {
      return 'Odbijen zahtev od veterinara';
    } else if (status === 'RESERVED') {
      return 'Zakazano';
    } else if (status === 'REQUEST_SENT') {
      return 'Zahtev za rezervaciju poslat';
    } else if (status === 'CONFIRMED_VET') {
      return 'Potvrdjen zahtev od veterinara';
    }
  }

  getDate(date) {
    // tslint:disable-next-line:max-line-length
    return new Date(date).toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  }

  approveRequest(request: any) {
    this.medicalRecordService.saveMedicalRecord({ ...request, status: 'RESERVED' }).subscribe(res => {
      this.getMedicalRequests();
      this.notifier.notify('success', 'Zahtev je potvrdjen');
    }, err => {
      this.notifier.notify('error', 'Zahtev ne moze biti potvrdjen');
    });
  }

  rejectRequest(request: any) {
    this.medicalRecordService.saveMedicalRecord({ ...request, status: 'REJECTED_CLIENT' }).subscribe(res => {
      this.getMedicalRequests();
      this.notifier.notify('success', 'Zahtev je odbijen');
    }, err => {
      this.notifier.notify('error', 'Zahtev ne moze biti odbijen');
    });
  }

  checkStatus(status: string): boolean {
    if (status === 'CONFIRMED_VET') {
      return true;
    }
    else {
      return false;
    }
  }

}
