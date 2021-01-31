import { Component, OnInit } from '@angular/core';
import { get } from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MedicalRecordService } from 'src/app/modules/shared/services/medical.record.service';
import { MedicalServiceService } from 'src/app/modules/shared/services/medical.service.service';
import { SessionService } from 'src/app/modules/shared/services/session.service';
import { MedicalRecordDetailsComponent } from '../../medicalRecord- details/medicalRecord- details.component';

@Component({
  selector: 'app-all-medical-examination',
  templateUrl: './all-medical-examination.component.html',
  styleUrls: ['./all-medical-examination.component.css']
})
export class AllMedicalExaminationComponent implements OnInit {
  public _user: string;
  public currentPage = 1;
  public medicalRequests = [];
  private bsModalRef: BsModalRef;
  public totalMedicalRequests: number;
  public reserved = [];
  public totalReserved: number;
  public done = [];
  public totalDone: number;
  public rejected = [];
  public totalRejected: number;
  public where = {
    sort: '-createdAt',
    limit: 200,
    page: 1,
    search: ''
  };
  constructor(
    private readonly sessionService: SessionService,
    private readonly modalService: BsModalService,
    private readonly medicalRecordService: MedicalRecordService,
    private readonly medicalService: MedicalServiceService
  ) { }

  ngOnInit(): void {
    this._user = get(this.sessionService, 'user._id');
    this.getMedicalRequests();
  }

  getMedicalRequests(page?) {
    if (page) {
      this.currentPage = page;
    }
    this.medicalRecordService.getAllMedicalRecords({ ...this.where, page: page || this.where.page })
      .subscribe(res => {
        this.medicalRequests = res.data;
        this.totalMedicalRequests = res.total;
        this.medicalRequests.forEach(el => {
          if (el.status === 'RESERVED') {
            this.reserved.push(el);
            this.totalReserved++;
          }
          else if (el.status === 'DONE') {
            this.done.push(el);
            this.totalDone++;
          }
          else if (el.status === 'REJECTED_VET' || el.status === 'REJECTED_CLIENT') {
            this.rejected.push(el);
            this.totalRejected++;
          }
        });
      });
  }

  getDate(date: any) {
    // tslint:disable-next-line:max-line-length
    return new Date(date).toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  }

  getStatus(status: string) {
    if (status === 'REJECTED_VET') {
      return 'Odbijen zahtev od veterinara';
    } else {
      return 'Odbijen zahtev od vlasnika kucnog ljubimca';
    }
  }

  getType(type: any) {
    if (type === 'MACKA') {
      return 'Macka';
    } else if (type === 'PAS') {
      return 'Pas';
    } else {
      return 'Zec';
    }
  }

  getPetOwner(record: any): string {
    if (record) {
      if (get(record, '_animal._petOwner.name')) {
        // tslint:disable-next-line:max-line-length
        return `${record._animal._petOwner.name.toString()} ${record._animal._petOwner.surname.toString()}`;
      } else {
        return `${record._petOwner.name.toString()} ${record._petOwner.surname.toString()}`;
      }
    }
  }

  openModalForMoreDetails(medical: any) {
    const initialState = {
      description: get(medical, 'description'),
      medicines: get(medical, 'medicines'),
      price: get(medical, 'price'),
      veterinarian: `${get(medical, '_veterinarian.name')} ${get(medical, '_veterinarian.surname')}`,
      animalBreed: get(medical, '_animal.animalBreed'),
      animalType: get(medical, '_animal.animalType'),
      title: 'Detaljnije'
    };
    this.bsModalRef = this.modalService.show(MedicalRecordDetailsComponent, { initialState });
    this.bsModalRef.content.confirmBtnName = 'Stampaj PDF';
    this.bsModalRef.content.confirmColor = 'btn-outline-primary';
  }
}
