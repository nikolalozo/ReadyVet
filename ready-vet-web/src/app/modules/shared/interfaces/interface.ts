import { AnimalType } from '../enum/animal.type.enum';
import { MedicalRecordStatusType } from '../enum/medical.record.status.type.enum';
import { UserType } from '../enum/user.type.enum';

export interface IAnimal {
  _id?: string;
  name?: string;
  _petOwner: string;
  animalType: string;
  gender: string;
  age: number;
  weight: number;
  animalBreed: string;
  sicknesses: string;
  createdAt?: Date;
  updatedAt?: Date;
  _medicalRecord?: string;
}

export interface IMedicalRecord {
  _id?: string;
  _animal?: string;
  _petOwner?: string;
  _veterinarian?: string;
  _service?: string;
  description?: string;
  medicines?: string;
  price?: number;
  status: MedicalRecordStatusType;
  date?: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber: number;
  role: UserType;
  education: string;
  averageMark?: number;
  description?: string;
  image?: IImage;
}

export interface IMedicalService {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  minPrice?: number;
}

export interface IFeedback {
  _id?: string;
  _medicalRecord: string;
  description?: string;
  mark: number;
}

export interface ITimeSchedule {
  _medicalRecord: string;
  date: Date;
}

export interface IImage {
  originalName: string;
  fileName: string;
  path: string;
}

export interface IFeedback {
  _id?: string;
  _medicalRecord: string;
  description?: string;
  mark: number;
}
