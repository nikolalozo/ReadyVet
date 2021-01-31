import { Schema } from "mongoose";

const ServiceSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minPrice: {
        type: Number
    }
},  {timestamps: true});
export { ServiceSchema };