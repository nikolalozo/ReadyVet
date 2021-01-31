import { Document } from 'mongoose';

export interface ITimeSchedule extends Document {
  _medicalRecord: string;
  date: Date;
}