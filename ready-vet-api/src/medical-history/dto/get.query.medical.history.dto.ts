import { BaseQueryParamsDto } from '../../shared/dto/base.query.params.dto';
import { IsMongoId, IsOptional } from 'class-validator';
import { IMedicalHistoryGetQuery } from '../interfaces/medical.history.get.query.interface';
import { MedicalRecordStatusType } from '../enum/medicalExamination.status';

export class GetQueryMedicalHistoryDto extends BaseQueryParamsDto implements IMedicalHistoryGetQuery {
    @IsOptional()
    @IsMongoId()
    _animal: string;

    @IsOptional()
    @IsMongoId()
    _veterinarian: string;

    @IsOptional()
    status: MedicalRecordStatusType
}