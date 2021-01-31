import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { get } from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../../shared/services/auth.service';
import { SessionService } from '../../../shared/services/session.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-medical-servis-request',
  templateUrl: './medical-servis-request.component.html',
  styleUrls: ['./medical-servis-request.component.css']
})
export class MedicalServisRequestComponent implements OnInit {
  private bsModalRef: BsModalRef;
  public isLoginInProgress = false;

  constructor(
    private readonly router: Router,
    private readonly modalService: BsModalService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly notifier: NotifierService
  ) { }

  ngOnInit(): void {
  }

  login(data: any): void {
    this.authService.login(data)
      .subscribe(() => {
        this.isLoginInProgress = false;
        if (get(this.sessionService, 'user')) {
          this.handleRedirect(get(this.sessionService, 'user'));
        }
      }, () => {
        this.notifier.notify('error', 'Nije moguce prijavljivanje');
        this.isLoginInProgress = false;
    });
  }

  onLogin() {
    const initialState = {
      title: 'Dobrodošli nazad',
      isLoginInProgress: this.isLoginInProgress
    };

    this.bsModalRef = this.modalService.show(LoginModalComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Odustani';
    this.bsModalRef.content.confirmBtnName = 'Prijava';
    this.bsModalRef.content.confirmColor = 'btn-primary';
    this.bsModalRef.content.closeColor = 'btn-outline-secondary';

    this.bsModalRef.content.action
      .subscribe((value) => {
        if (value) {
          this.login(value);
        }
        return value;
      }, () => {
        return false;
      });

  }

  goToRegistration() {
    this.router.navigate(['/vet/register']);
  }

  handleRedirect(user: any) {
    if (get(user, 'role') === 'VETERINARIAN' || get(user, 'role') === 'ADMIN') {
      this.router.navigate(['/veterinarian/home-vet']);
    } else if (get(user, 'role') === 'ANIMAL_OWNER') {
      this.router.navigate(['/pet-owner/home-pet']);
    } else {
      this.router.navigate(['/']);
    }
  }

}
