import { Schema, Types } from 'mongoose';
import { AnimalType } from './enum/animal.type.enum';

const AnimalSchema = new Schema({
  name: {
    type: String
  },
  _petOwner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  animalType: {
    type: String,
    enum: Object.values(AnimalType),
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  animalBreed: {
    type: String,
    required: true
  },
  sicknesses: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export { AnimalSchema };
