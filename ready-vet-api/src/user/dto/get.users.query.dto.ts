import { BaseQueryParamsDto } from '../../shared/dto/base.query.params.dto';
import { UserType } from '../enum/user.type.enum';
import { IsOptional } from 'class-validator';

export class GetUsersQueryDto extends BaseQueryParamsDto {
  @IsOptional()
  role: UserType

  @IsOptional()
  verifiedByAdmin: boolean;
}