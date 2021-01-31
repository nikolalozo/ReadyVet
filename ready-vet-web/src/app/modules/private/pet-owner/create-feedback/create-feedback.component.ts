import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IUser } from '../../../shared/interfaces/interface';

@Component({
  selector: 'app-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.css']
})
export class CreateFeedbackComponent {
  @Output() action = new EventEmitter();
  public title: string;
  public mark: number;
  public comment: string;
  public confirmColor: string;
  public confirmBtnName: string;
  public closeColor: string;
  public closeBtnName: string;

  constructor(public bsModalRef: BsModalService) { }

  confirm() {
    this.bsModalRef.hide(1);
    this.action.emit({ comment: this.comment, mark: this.mark });
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
