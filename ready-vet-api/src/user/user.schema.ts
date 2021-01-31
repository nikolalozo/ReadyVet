import { Schema } from 'mongoose';
import { UserType } from './enum/user.type.enum';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  education: {
    type: String
  },
  verificationCode: {
    type: String,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedByAdmin: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: Object.values(UserType)
  },
  image: {
    originalname: { type: String, default: '' },
    filename: { type: String, default: '' },
    path: { type: String, default: '' }
  }
}, { timestamps: true });

export { UserSchema };
