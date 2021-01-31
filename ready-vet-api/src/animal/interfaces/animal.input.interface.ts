import { AnimalType } from "../enum/animal.type.enum";

export interface IAnimalCreate {
  _petOwner: string;
  animalType: AnimalType;
  gender: string;
  age: number;
  weight: number;
  animalBreed: string;
  sicknesses?: string;
  _medicalRecord: string;
}