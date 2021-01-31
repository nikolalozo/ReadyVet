import { IsMongoId, IsNotEmpty, IsString, Min, IsNumber, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { AnimalType } from '../enum/animal.type.enum';
import { IAnimalUpdate } from '../interfaces/animal.update.interface';

export class AnimalUpdateDto implements IAnimalUpdate {
  @IsOptional()
  @IsString()
  @MaxLength(64, {
    message: 'Name of animal is too long.'
  })
  name: string;

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

  @IsNotEmpty()
  @IsString()
  sicknesses: string;
}
