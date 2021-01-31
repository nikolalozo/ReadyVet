import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { get, isEmpty } from 'lodash';
import { MedicalServiceService } from '../../../shared/services/medical.service.service';
import { IMedicalService, IUser } from 'src/app/modules/shared/interfaces/interface';
import { SessionService } from '../../../shared/services/session.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-medical-services',
  templateUrl: './medical-services.component.html',
  styleUrls: ['./medical-services.component.css'],
})
export class MedicalServicesComponent implements OnInit {
  public isAdmin = false;
  public isVet = false;
  public user: IUser;
  public medicalServices: IMedicalService[] = [];
  public totalMedicalServices: number;
  public selectedService = '';
  public where = {
    sort: '-createdAt',
    limit: 6,
    page: 1,
    search: '',
  };
  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly notifier: NotifierService,
    private readonly medicalService: MedicalServiceService
  ) { }

  ngOnInit(): void {
    if (get(this.sessionService, 'user') && get(this.sessionService, 'user.role') === 'ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.user = get(this.sessionService, 'user');
    if (this.user && get(this.user, 'role') === 'VETERINARIAN') {
      this.isVet = true;
    }

    this.getMedicalServices();
  }

  getMedicalServices(page?) {
    this.medicalService.getAllMedicalServices({ ...this.where, page: page || this.where.page })
      .subscribe(result => {
        this.medicalServices = result.data;
        this.totalMedicalServices = result.total;
        if (this.medicalServices && this.medicalServices[0]) {
          this.selectedService = get(this.medicalServices[0], '_id');
        }
      });
  }

  selectService(id: string) {
    this.selectedService = id;
  }

  createNewMedicalService() {
    this.router.navigate(['/veterinarian/new-medical-service']);
  }

  deleteMedicalService() {
    if (isEmpty(this.selectedService)) { return; }
    this.medicalService.deleteMedicalService(this.selectedService).subscribe(res => {
      this.notifier.notify('success', 'Usluga je izbrisana');
      this.getMedicalServices();
    }, err => {
      this.notifier.notify('error', 'Uslugu nije moguce izbrisati');
    });
  }

  editMedicalService() {
    if (isEmpty(this.selectedService)) { return; }
    this.router.navigate(['/veterinarian/edit-medical-service', this.selectedService]);
  }

  getTitle(): string {
    let title = '';
    if (!isEmpty(this.selectedService)) {
      title = this.medicalServices.find(el => get(el, '_id') === this.selectedService).title;
    }
    return title;
  }

  getDescription(): string {
    let description = '';
    if (!isEmpty(this.selectedService)) {
      description = this.medicalServices.find(el => get(el, '_id') === this.selectedService).description;
    }
    return description;
  }

  getMinPrice(): number {
    let minPrice = 0;
    let service;
    if (!isEmpty(this.selectedService)) {
      service = this.medicalServices.find(el => get(el, '_id') === this.selectedService);
      if (get(service, 'minPrice')) {
        minPrice = get(service, 'minPrice');
      }
    }
    return minPrice;
  }

  goToProfile() {
    if (this.user) {
      const role = get(this.user, 'role');
      if (role === 'ANIMAL_OWNER') {
        this.router.navigate([`/pet-owner/medical-service-request`]);
      }

    } else {
      this.router.navigate(['vet/medical-service-request']);
    }
  }
}
