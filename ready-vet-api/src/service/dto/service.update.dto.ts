import { IsString, IsNumber, Min, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';
import { IServiceUpdate } from "src/animal/interfaces/service.update.interface";

export class ServiceUpdateDto implements IServiceUpdate {
  @IsString()
  title: string;
  
  @IsString()
  description: string;

  @IsOptional()
  @Transform(parseFloat)
  @IsNumber()
  @Min(0)
  minPrice: number;
}