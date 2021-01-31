import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoose.config';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { AnimalModule } from './animal/animal.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { MedicalHistoryModule } from './medical-history/medical.history.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ImageServiceModule } from './image-service/image.service.module';
import { TimeScheduleModule } from './time-schedule/time.schedule.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
     imports: [SharedModule],
     useClass: MongooseConfigService
  }),
  AuthModule,
  AnimalModule,
  UserModule,
  ServiceModule,
  FeedbackModule,
  MedicalHistoryModule,
  ImageServiceModule,
  TimeScheduleModule,
  RealtimeModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
