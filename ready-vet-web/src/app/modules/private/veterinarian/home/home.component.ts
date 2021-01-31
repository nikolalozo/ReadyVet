import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service';
import { get } from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public isAdmin = false;
  constructor(
    private readonly sessionService: SessionService
  ) { }

  ngOnInit(): void {
    if (get(this.sessionService, 'user') && get(this.sessionService, 'user.role') === 'ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

}
