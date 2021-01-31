import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../shared/services/auth.service';
import { get } from 'lodash';
import { SessionService } from '../../../shared/services/session.service';
import { NotifierService } from 'angular-notifier';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public showPassword = false;
  public data = {
    email: '',
    password: ''
  };
  public isLoginInProgress = false;
  public faEye = faEye;
  public faEyeSlash = faEyeSlash;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly notifier: NotifierService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    const { email } = this.route.snapshot.queryParams;
    if (email) { this.data.email = email; }
  }

  login(): void {
    this.isLoginInProgress = true;
    this.authService.login(this.data)
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

  goToRegister() {
    this.router.navigate(['/vet/register']);
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
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
