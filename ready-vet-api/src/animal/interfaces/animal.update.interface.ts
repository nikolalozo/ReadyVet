import { AnimalType } from "../enum/animal.type.enum";

export interface IAnimalUpdate {
  _petOwner: string;
  animalType: AnimalType;
  name?: string;
  gender: string;
  age: number;
  weight: number;
  animalBreed: string;
  sicknesses: string;
}