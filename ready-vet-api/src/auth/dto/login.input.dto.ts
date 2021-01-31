import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginInputDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}