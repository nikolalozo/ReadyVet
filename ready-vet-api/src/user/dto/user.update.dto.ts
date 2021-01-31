import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";
import { IUserUpdate } from "../interfaces/user.update.interface";

export class UserUpdateDto implements IUserUpdate {
  @IsOptional()
  @IsString()
  _id: string; 

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  verifiedByAdmin: boolean;

  @IsOptional()
  @IsString()
  education: string;

}