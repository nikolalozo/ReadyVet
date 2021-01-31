import { Socket } from 'socket.io';

export interface IUserSocket extends Socket {
  accessToken: string;
  _user?: string;
}
