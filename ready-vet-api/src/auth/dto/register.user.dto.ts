import { IsString, IsNotEmpty, MinLength, IsEmail, ValidateIf } from 'class-validator';
import { get } from 'lodash'
import { IRegisterUserInputData } from "../interfaces/register.user.input.data.interface";
import { UserType } from '../../user/enum/user.type.enum';

export class RegisterUserDto implements IRegisterUserInputData {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  role: UserType;
}