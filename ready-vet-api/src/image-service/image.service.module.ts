import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ImageServiceController } from './image.service.controller';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [
    ImageServiceController
  ]
})
export class ImageServiceModule {}