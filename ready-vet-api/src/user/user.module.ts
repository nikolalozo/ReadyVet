import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user.schema';
import { SharedModule } from "../shared/shared.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MedicalHistoryModule } from "../medical-history/medical.history.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
    SharedModule,
    forwardRef(() => MedicalHistoryModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}