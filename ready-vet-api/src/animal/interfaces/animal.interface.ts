import { Document } from 'mongoose';
import { AnimalType } from '../enum/animal.type.enum';
import { IImage } from '../../image/image.interface';

export interface IAnimal extends Document {
  name?: string;
  _petOwner: string;
  animalType: AnimalType;
  gender: string;
  age: number;
  weight: number;
  animalBreed: string;
  sicknesses?: string;
}