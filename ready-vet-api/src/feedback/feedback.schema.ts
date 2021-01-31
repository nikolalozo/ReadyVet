import { Schema, Types } from 'mongoose';

const FeedbackSchema = new Schema({
  _medicalRecord: {
    type: Types.ObjectId,
    ref: 'MedicalHistory',
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  mark: {
    type: Number,
    default: 0,
    required: true
  }
}, { timestamps: true });

export { FeedbackSchema };
