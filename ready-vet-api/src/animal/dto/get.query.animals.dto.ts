import { IsMongoId, IsOptional } from 'class-validator';
import { BaseQueryParamsDto } from '../../shared/dto/base.query.params.dto';
import { IGetQueryAnimals } from '../interfaces/get.query.animals.interface';

export class GetQueryAnimalsDto extends BaseQueryParamsDto implements IGetQueryAnimals {
  @IsOptional()
  @IsMongoId()
  _petOwner?: string;
}