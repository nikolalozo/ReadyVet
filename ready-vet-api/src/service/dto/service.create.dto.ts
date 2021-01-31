import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';
import { IServiceCreate } from "../interfaces/service.input.interface";

export class ServiceCreateDto implements IServiceCreate {
  @IsNotEmpty()
  @IsString()
  title: string; 
  
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(parseFloat)
  @IsNumber()
  @Min(0)
  minPrice: number;
}