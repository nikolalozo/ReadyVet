import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { Socket } from 'ngx-socket-io';
import { SocketEventType } from '../enum/socket.event.type';
import { SessionService } from './session.service';

@Injectable()
export class SocketIoService {
  constructor(
    private readonly socket: Socket,
    private readonly sessionService: SessionService
  ) {}

  connect() {
    this.socket.connect();

    this.socket.on('connect', () => {
      this.doAuth();
    });
  }

  disconnect() {
    this.socket.disconnect();
    this.socket.removeAllListeners();
  }

  doAuth() {
    this.socket.emit(
      'auth',
      { accessToken: get(this.sessionService, 'accessTokenObj'), _user: get(this.sessionService, 'user._id') });
  }

  receivedNewReservation() {
    return this.socket.fromEvent(SocketEventType.NEW_RESERVATION);
  }

  receivedNewConfirmation() {
    return this.socket.fromEvent(SocketEventType.CONFIRMED_BY_VET);
  }

  rejectedByVeterinarian() {
    return this.socket.fromEvent(SocketEventType.REJECTED_BY_VET);
  }

  receiveNewRegistration() {
    return this.socket.fromEvent(SocketEventType.NEW_REGISTRATION);
  }
}
