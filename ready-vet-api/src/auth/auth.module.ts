import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '../shared/config.service';
import { SharedModule } from '../shared/shared.module';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    SharedModule,
    EmailModule,
    UserModule,
    forwardRef(() => RealtimeModule),
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: 259200 }
      }),
      inject: [ConfigService]
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}