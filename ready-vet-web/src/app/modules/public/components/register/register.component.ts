import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public faEye = faEye;
  public faEyeSlash = faEyeSlash;
  public showPassword = false;
  public users = ['Vlasnik ljubimca', 'Veterinar'];
  public data = {
    name: '',
    surname: '',
    email: '',
    password: '',
    role: '',
    isAgreed: false
  };
  public isRegisterInProgress = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  register(): void {
    if (this.data.role === 'Vlasnik ljubimca') {
      this.data.role = 'ANIMAL_OWNER';
    }
    else {
      this.data.role = 'VETERINARIAN';
    }
    if (this.isRegisterInProgress) { return; }
    this.isRegisterInProgress = true;
    this.authService.register(this.data)
      .subscribe(() => {
        this.isRegisterInProgress = false;
        this.router.navigate(['/vet/confirm-email-info']);
      }, error => {
        this.isRegisterInProgress = false;
      });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  isAgreedChanged(isAgreed) {
    this.data.isAgreed = isAgreed;
  }

  goToLogin(){
    this.router.navigate(['/vet/login']);
  }
}
