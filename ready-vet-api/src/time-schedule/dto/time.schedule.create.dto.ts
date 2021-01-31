import { IsNotEmpty, IsMongoId, IsString, IsDate } from "class-validator";
import { Type } from 'class-transformer';
import { ITimeScheduleCreate } from "../interfaces/time.schedule.create.interface";

export class TimeScheduleCreateDto implements ITimeScheduleCreate {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    _medicalRecord: string;

    @IsDate()
    @Type(() => Date)
    date: Date;
}