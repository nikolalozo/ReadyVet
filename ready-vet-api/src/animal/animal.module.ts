import { Module, forwardRef } from '@nestjs/common';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalSchema } from './animal.schema';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { MedicalHistoryModule } from '../medical-history/medical.history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Animal', schema: AnimalSchema }
    ]),
    MulterModule.register({
      dest: './users-photos'
    }),
    forwardRef(() => UserModule),
    SharedModule,
    forwardRef(() => MedicalHistoryModule)
  ],
  controllers: [
    AnimalController
  ],
  providers: [
    AnimalService
  ],
  exports: [
    AnimalService
  ]
})
export class AnimalModule {}