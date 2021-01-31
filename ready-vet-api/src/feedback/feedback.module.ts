import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from './feedback.schema';
import { MedicalHistoryModule } from '../medical-history/medical.history.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { AnimalModule } from '../animal/animal.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Feedback', schema: FeedbackSchema }
    ]),
    MedicalHistoryModule,
    AnimalModule,
    forwardRef(() => UserModule)
  ],
  controllers: [
    FeedbackController
  ],
  providers: [
    FeedbackService
  ],
  exports: [
    FeedbackService
  ]
})
export class FeedbackModule {}