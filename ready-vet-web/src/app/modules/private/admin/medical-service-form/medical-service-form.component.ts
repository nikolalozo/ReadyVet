import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMedicalService } from '../../../shared/interfaces/interface';
import { MedicalServiceService } from '../../../shared/services/medical.service.service';
import { NotifierService } from 'angular-notifier';
import { get, isEmpty } from 'lodash';


@Component({
  selector: 'app-medical-service-form',
  templateUrl: './medical-service-form.component.html',
  styleUrls: ['./medical-service-form.component.css']
})
export class MedicalServiceFormComponent implements OnInit {
  public _medicalService: string;
  public isCreatingInProgress = false;
  public data: IMedicalService = {
    title: '',
    description: '',
    minPrice: 0
  };
  public error = {
    image: false
  };
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notifier: NotifierService,
    private readonly medicalService: MedicalServiceService
  ) { }

  ngOnInit(): void {
    this._medicalService = get(this.route, 'snapshot.params._id');
    if (this._medicalService) {
      this.medicalService.getOneMedicalService(this._medicalService)
        .subscribe(res => {
          this.data = res;
        });
    }

  }

  create(): void {
    if (this.isCreatingInProgress) { return; }
    this.isCreatingInProgress = true;
    if (!isEmpty(this._medicalService)) {
      this.data = { ...this.data, _id: this._medicalService };
    }
    this.medicalService.saveMedicalService(this.data)
      .subscribe(res => {
        this.isCreatingInProgress = false;
        this.router.navigate(['veterinarian/all-medical-services']);
        if (this._medicalService) {
          this.notifier.notify('success', 'Uspesno menjanje usluge.');
        } else {
          this.notifier.notify('success', 'Uspesno dodavanje usluge');
        }
      }, error => {
        this.isCreatingInProgress = false;
        if (this._medicalService) {
          this.notifier.notify('error', 'Usluga nije izmenjena');
        } else {
          this.notifier.notify('error', 'Usluga nije dodata');
        }
        this.router.navigate(['veterinarian/all-medical-services']);
      });
  }

  checkIfDataIsEmpty(): boolean {
    return isEmpty(this.data.title) || isEmpty(this.data.description) || this.data.minPrice < 1;
  }
}
