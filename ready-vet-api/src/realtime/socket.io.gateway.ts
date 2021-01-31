import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { Server } from 'socket.io';
import { isEmpty } from 'lodash';
import { SocketEventType } from './enum/socket.event.enum.type';
import { ISocketAuthData } from './interfaces/socket.auth.data.interface';
import { UserService } from '../user/user.service';
import { IUserSocket } from './interfaces/user.socket.interface';

@WebSocketGateway()
export class SocketIoGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor (
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  @SubscribeMessage('auth')
  async handleAuth (client: IUserSocket, data: ISocketAuthData) {
    const { accessToken, _user } = data;
    if (!accessToken || !_user) { return client.disconnect(true); }

    try {
      const _id = _user;
      const user = await this.userService.findById(_id);
      if (isEmpty(user)) { return client.disconnect(true); }
      client.accessToken = accessToken;
      client._user = _user;
      let roomName = `user_${_user}`;
      client.join(roomName);
    } catch (err) {
      client.disconnect(true);
    }
  }

  afterInit (): void {
    setTimeout(() => {
      process.stdout.write(`ReadyVet Socket.io server started\n`);
    }, 700);
  }

  emitToUser (type: SocketEventType, _user: string, data?: object): void {
    this.server.to(`user_${_user}`).emit(type, data);
  }
}