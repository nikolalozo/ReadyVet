import { BaseQueryParamsDto } from '../../shared/dto/base.query.params.dto';
import { IsOptional, IsDate, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class GetQueryTimeScheduleDto extends BaseQueryParamsDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsMongoId()
  _veterinarian: string;
}