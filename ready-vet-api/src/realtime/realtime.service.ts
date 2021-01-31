import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { SocketIoGateway } from './socket.io.gateway';
import { SocketEventType } from './enum/socket.event.enum.type';

@Injectable()
export class RealtimeService {
  constructor (
    private readonly socketIoGateway: SocketIoGateway
  ) {}

  async sendNewReservation (_vet: string, data: any): Promise<void> {
    console.log('DATAA', data);
    try {
      this.socketIoGateway.emitToUser(
        SocketEventType.NEW_RESERVATION,
        _vet,
        data
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log('err', err);
    }
  }

  async confirmedByVet (_user: string, data: any): Promise<void> {
    try {
      this.socketIoGateway.emitToUser(
        SocketEventType.CONFIRMED_BY_VET,
        _user,
        data
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log('err', err);
    }
  }

  async rejectedByVet (_user: string, data: any): Promise<void> {
    try {
      this.socketIoGateway.emitToUser(
        SocketEventType.REJECTED_BY_VET,
        _user,
        data
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log('err', err);
    }
  }

  async newRegistration (_user: string, data: any): Promise<void> {
    try {
      this.socketIoGateway.emitToUser(
        SocketEventType.NEW_REGISTRATION,
        _user,
        data
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log('err', err);
    }
  }
}
