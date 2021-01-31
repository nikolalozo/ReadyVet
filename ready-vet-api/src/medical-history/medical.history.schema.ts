import { Schema, Types } from 'mongoose';
import {  MedicalRecordStatusType } from './enum/medicalExamination.status';

const MedicalHistorySchema = new Schema({
  _animal: {
    type: Types.ObjectId,
    ref: 'Animal',
  },
  _petOwner: {
    type: Types.ObjectId,
    ref: 'Users',
  },
  _veterinarian: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  _service: {
    type: String,
    ref: 'Service',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  medicines: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: Object.values(MedicalRecordStatusType),
    required: true
  }
}, { timestamps: true });

export { MedicalHistorySchema };
