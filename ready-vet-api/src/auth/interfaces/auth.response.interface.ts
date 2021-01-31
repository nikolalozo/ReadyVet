import { IUser } from '../../user/interfaces/user.interface';

export interface IAuthResponseInterface {
  user: IUser;
  token: string;
}
