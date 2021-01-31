import { Document } from 'mongoose';
import { MedicalRecordStatusType } from '../enum/medicalExamination.status';

export interface IMedicalHistory extends Document {
    _id: string;
    _animal?: string;
    _petOwner?: string;
    _veterinarian : string;
    _service: string;
    description?: string;
    medicines?: string;
    price?: number;
    status: MedicalRecordStatusType;
    date?: Date;
}