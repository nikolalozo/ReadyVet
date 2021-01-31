import { IsNotEmpty, IsMongoId, IsString, Min, IsNumber, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';
import { IFeedbackCreate } from "../interfaces/feedback.create.interface";

export class FeedbackCreateDto implements IFeedbackCreate {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    _medicalRecord: string;

    @IsOptional()
    @IsString()
    comment: string;

    @Transform(parseFloat)
    @IsNumber()
    @Min(0)
    mark: number;
}