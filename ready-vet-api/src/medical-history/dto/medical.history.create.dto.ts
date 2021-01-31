import { IsNotEmpty, IsMongoId, IsString, Min, IsNumber, IsOptional, IsDate } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { IMedicalHistoryCreate } from "../interfaces/medical.history.create.interface";
import {  MedicalRecordStatusType } from "../enum/medicalExamination.status";

export class MedicalHistoryCreateDto implements IMedicalHistoryCreate {
    @IsOptional()
    @IsString()
    @IsMongoId()
    _animal: string;

    @IsOptional()
    @IsString()
    @IsMongoId()
    _petOwner: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    _veterinarian: string;
    
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    _service: string;

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

    @IsNotEmpty()
    status: MedicalRecordStatusType;

    @IsDate()
    @Type(() => Date)
    date: Date;
}