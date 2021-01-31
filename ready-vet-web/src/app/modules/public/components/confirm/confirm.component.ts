import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  @Output() action = new EventEmitter();
  public title: string;
  public message: string;
  public confirmColor: string;
  public confirmBtnName: string;
  public closeColor: string;
  public closeBtnName: string;

  constructor(public bsModalRef: BsModalService) { }

  confirm() {
    this.bsModalRef.hide(1);
    this.action.emit(true);
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
}
