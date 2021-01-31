import { IGetAllMedHistoryByService } from '../interfaces/get.all.medical.history.by.service.interface';
import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetAllMedHistoryByServiceDto implements IGetAllMedHistoryByService {
    @IsMongoId()
    @IsNotEmpty()
    _service:string;
}