import { IsString, IsNumber, Min, IsOptional, IsNotEmpty } from "class-validator";
import { Transform } from 'class-transformer';
import { IMedicalHistoryUpdate } from "../interfaces/medical.history.update.interface";
import { MedicalRecordStatusType } from "../enum/medicalExamination.status";

export class MedicalHistoryUpdateDto implements IMedicalHistoryUpdate{
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    medicines?: string;

    @IsOptional()
    @Transform(parseFloat)
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    status: MedicalRecordStatusType;
}