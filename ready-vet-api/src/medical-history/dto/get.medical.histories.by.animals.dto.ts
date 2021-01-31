import { IGetMedicalHistoriesByAnimals } from "../interfaces/get.medical.histories.by.animals.interface";
import { IsArray, IsString, IsMongoId } from "class-validator";

export class GetMedicalHistoriesByAnimalsDto implements IGetMedicalHistoriesByAnimals {
  @IsString()
  @IsMongoId()
  _petOwner: string;

  @IsArray()
  _animals: Array<string>;
}
