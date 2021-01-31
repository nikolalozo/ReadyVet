import { Document } from 'mongoose';
import { UserType } from '../enum/user.type.enum';
import { IImage } from '../../image/image.interface';

export interface IUser extends Document {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  education?: string;
  verificationCode?: string;
  isVerified?: boolean;
  verifiedByAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: UserType;
  image?: IImage;
}