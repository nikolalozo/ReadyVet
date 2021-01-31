import { Schema, Types } from 'mongoose';

const TimeScheduleSchema = new Schema({
  _medicalRecord: {
    type: Types.ObjectId,
    ref: 'MedicalHistory',
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export { TimeScheduleSchema };
