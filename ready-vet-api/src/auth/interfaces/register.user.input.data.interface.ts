import { UserType } from "../../user/enum/user.type.enum";

export interface IRegisterUserInputData {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: UserType;
}