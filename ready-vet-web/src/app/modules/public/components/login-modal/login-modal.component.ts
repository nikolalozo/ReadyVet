import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})

export class LoginModalComponent {
  @Output() action = new EventEmitter();
  public title: string;
  public isLoginInProgress: boolean;
  public showPassword = false;
  public email: string;
  public password: string;
  public faEye = faEye;
  public faEyeSlash = faEyeSlash;
  public confirmColor: string;
  public confirmBtnName: string;
  public closeColor: string;
  public closeBtnName: string;

  constructor(
    public bsModalRef: BsModalService,
    private readonly router: Router
  ) { }

  login() {
    this.bsModalRef.hide(1);
    this.action.emit({ email: this.email, password: this.password });
    this.removeOverflowHack();
  }

  goToRegistration() {
    this.router.navigate(['/vet/register']);
    this.bsModalRef.hide(1);
    this.removeOverflowHack();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
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


