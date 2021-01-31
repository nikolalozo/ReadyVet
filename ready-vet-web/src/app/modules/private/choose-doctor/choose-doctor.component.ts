import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IUser } from '../../shared/interfaces/interface';
import { environment } from '../../../../environments/environment';
import { get } from 'lodash';

@Component({
  selector: 'app-choose-doctor',
  templateUrl: './choose-doctor.component.html',
  styleUrls: ['./choose-doctor.component.css']
})
export class ChooseDoctorComponent {
  @Output() action = new EventEmitter();
  public title: string;
  public baseUrl = environment.baseUrl;
  public veterinarians: Array<IUser>;
  public totalVeterinarians: number;
  public confirmColor: string;
  public confirmBtnName: string;
  public closeColor: string;
  public closeBtnName: string;

  constructor(public bsModalRef: BsModalService) { }

  confirm(id: string) {
    this.bsModalRef.hide(1);
    this.action.emit({ _id: id });
    this.removeOverflowHack();
  }

  decline() {
    this.bsModalRef.hide(1);
    this.action.emit(false);
    this.removeOverflowHack();
  }

  removeOverflowHack() {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
  }

  generateUrl(image): string {
    if (image && get(image, 'filename')) {
      return `${this.baseUrl}/users/${get(image, 'filename')}`;
    } else {
      return `../../../../../assets/images/avatar.jpg`;
    }
  }
}
