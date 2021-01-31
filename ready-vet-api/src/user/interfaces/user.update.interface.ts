import { UserType } from "../../user/enum/user.type.enum";

export interface IUserUpdate {
  _id?: string;
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  verifiedByAdmin?: boolean;
  education?: string;
}