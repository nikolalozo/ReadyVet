import { Document } from 'mongoose';
import { IImage } from '../../image/image.interface';

export interface IService extends Document{
    title: string;
    description: string;
    minPrice?: number;
}