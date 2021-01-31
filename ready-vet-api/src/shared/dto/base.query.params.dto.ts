import { IsString, IsOptional, IsNotEmpty, Min, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { IBaseQueryParams } from '../interfaces/base.query.params.interface';

export class BaseQueryParamsDto implements IBaseQueryParams {
  @Transform(parseInt)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  limit: number;

  @Transform(parseInt)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  page: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;
}