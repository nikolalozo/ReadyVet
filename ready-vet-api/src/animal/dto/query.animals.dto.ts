import { IsMongoId, IsOptional } from "class-validator";
import { IQueryAnimals } from "../interfaces/query.animals.interface";

export class QueryAnimalsDto implements IQueryAnimals {
  @IsOptional()
  @IsMongoId()
  _petOwner: string;
}