import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalHistorySchema } from './medical.history.schema';
import { MedicalHistoryController } from './medical.history.controller';
import { MedicalHistoryService } from './medical.history.service';
import { TimeScheduleModule } from '../time-schedule/time.schedule.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { AnimalModule } from '../animal/animal.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MedicalHistory', schema: MedicalHistorySchema }
    ]),
    TimeScheduleModule,
    forwardRef(() => RealtimeModule),
    forwardRef(() => AnimalModule),
    forwardRef(() => UserModule)
    
  ],
  controllers: [
    MedicalHistoryController
  ],
  providers: [
    MedicalHistoryService
  ],
  exports: [
    MedicalHistoryService
  ]
})
export class MedicalHistoryModule {}