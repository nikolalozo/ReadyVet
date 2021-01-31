import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeScheduleController } from './time.schedule.controller';
import { TimeScheduleService } from './time.schedule.service';
import { TimeScheduleSchema } from './time.schedule.schema';
import { ServiceModule } from '../service/service.module';
import { AnimalModule } from '../animal/animal.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TimeSchedule', schema: TimeScheduleSchema }
    ]),
    ServiceModule,
    AnimalModule,
    forwardRef(() => UserModule)
  ],
  controllers: [
    TimeScheduleController
  ],
  providers: [
    TimeScheduleService
  ],
  exports: [
    TimeScheduleService
  ]
})
export class TimeScheduleModule {}