import { Component, OnInit } from '@angular/core';
import { get, isElement, isEmpty } from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicalRecordService } from 'src/app/modules/shared/services/medical.record.service';
import { NotifierService } from 'angular-notifier';
import { MedicalRecordStatusType } from 'src/app/modules/shared/enum/medical.record.status.type.enum';
import { IMedicalRecord } from '../../../shared/interfaces/interface';

@Component({
  selector: 'app-new-medical-record',
  templateUrl: './new-medical-record.component.html',
  styleUrls: ['./new-medical-record.component.css']
})
export class NewMedicalRecordComponent implements OnInit {
  public _medicalRecord: string;
  public isCreatingInProgress = false;
  public withoutMedRec = false;
  public data: IMedicalRecord = {
    _id: '',
    description: '',
    medicines: '',
    status: MedicalRecordStatusType.DONE,
    price: 0
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly notifier: NotifierService,
    private readonly medicalRecordService: MedicalRecordService
  ) { }

  ngOnInit(): void {
    this._medicalRecord = get(this.route, 'snapshot.params._medicalRecord');
  }

  update(): void {
    this.medicalRecordService.saveMedicalRecord({ ...this.data, _id: this._medicalRecord })
      .subscribe(res => {
        const newMedicalRecord = res;
        this.notifier.notify('success', 'Pregled je dodat');
        this.router.navigate(['/veterinarian/home-vet']);
      }, error => {
        this.notifier.notify('error', 'Pregled nije dodat');
      });
  }

  checkIfDataIsEmpty(): boolean {
    return isEmpty(this.data.description) || isEmpty(this.data.medicines) || this.data.price < 1;
  }
}
