import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IAnimal } from '../../shared/interfaces/interface';

@Component({
  selector: 'app-choose-animal',
  templateUrl: './choose-animal.component.html',
  styleUrls: ['./choose-animal.component.css']
})
export class ChooseAnimalComponent {
  @Output() action = new EventEmitter();
  public title: string;
  public animals: Array<IAnimal>;
  public totalAnimals: number;
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

  getAnimalType(type: string): string {
    if (type === 'PAS') {
      return 'Pas';
    } else if (type === 'MACKA') {
      return 'Macka';
    } else {
      return 'Zec';
    }
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
