import { IsMongoId, IsNotEmpty, IsString, Min, IsNumber, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IAnimalCreate } from '../interfaces/animal.input.interface';
import { AnimalType } from '../enum/animal.type.enum';

export class AnimalCreateDto implements IAnimalCreate {
  @IsNotEmpty()
  @IsMongoId()
  _petOwner: string;

  @IsNotEmpty()
  @IsString()
  animalType: AnimalType;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @Transform(parseFloat)
  @IsNumber()
  @Min(0)
  age: number;

  @Transform(parseFloat)
  @IsNumber()
  @Min(0)
  weight: number;

  @IsNotEmpty()
  @IsString()
  animalBreed: string;

  @IsString()
  sicknesses: string;

  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  _medicalRecord: string;
}
