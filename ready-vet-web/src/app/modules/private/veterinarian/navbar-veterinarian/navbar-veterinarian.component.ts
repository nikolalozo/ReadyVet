import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { get } from 'lodash';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../shared/services/auth.service';
import { SessionService } from '../../../shared/services/session.service';
import { SocketIoService } from '../../../shared/services/socket.io.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rv-navbar-veterinarian',
  templateUrl: './navbar-veterinarian.component.html',
  styleUrls: ['./navbar-veterinarian.component.css']
})
export class NavbarVeterinarianComponent implements OnInit, OnDestroy {
  public readonly faBell = faBell;
  public newNotification = false;
  private subscription: Subscription;
  // tslint:disable-next-line:variable-name
  public _id: string;
  public isAdmin = false;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notifier: NotifierService,
    private readonly socketIoService: SocketIoService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.socketIoService.connect();
    this._id = get(this.sessionService, 'user._id');
    if (get(this.sessionService, 'user') && get(this.sessionService, 'user.role') === 'ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.subscription = this.socketIoService.receivedNewReservation().subscribe(res => {
      this.receivedNewReservation(res);
    });
    this.router.events.subscribe(changeUrl => {
      if ((get(changeUrl, 'url') || '').includes('requests')) {
        this.newNotification = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  receivedNewReservation(data) {
    if (!get(this.route, 'snapshot._routerState.url').includes('requests')) {
      this.newNotification = true;
    } else {
      this.newNotification = false;
    }
    this.notifier.notify('success', 'Nova rezervacija je poslata');
  }

  goToLogin() {
    this.router.navigate(['/vet/login']);
  }

  logout() {
    this.authService.logout();
  }
}
