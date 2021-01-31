import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { get } from 'lodash';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { SocketIoService } from '../../../shared/services/socket.io.service';
import { NotifierService } from 'angular-notifier';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rv-public-navbar',
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.css']
})
export class PublicNavbarComponent implements OnInit, OnDestroy {
  public readonly faBell = faBell;
  private subscription: Subscription;
  public newNotification = false;
  // tslint:disable-next-line:variable-name
  public _user: string;
  public isPetOwner = false;
  constructor(
    private readonly router: Router,
    private readonly notifier: NotifierService,
    private readonly sessionService: SessionService,
    private readonly socketIoService: SocketIoService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.sessionService.user && (get(this.sessionService, 'user.role') === 'ANIMAL_OWNER')) {
      this.isPetOwner = true;
      this._user = get(this.sessionService, 'user._id');
      this.socketIoService.connect();
      this.subscription = this.socketIoService.receivedNewConfirmation().subscribe(res => {
        this.receivedNewConfirmation(res);
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  receivedNewConfirmation(data) {
    this.newNotification = true;
    this.notifier.notify('success', 'Veterinar je odobrio rezervaciju');
  }

  checkIfPublic(): boolean {
    return !(this.isPetOwner);
  }

  goToLogin() {
    this.router.navigate(['/vet/login']);
  }

  logout() {
    this.authService.logout();
  }
}
