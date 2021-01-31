import { Module, forwardRef } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { SocketIoGateway } from './socket.io.gateway';
import { RealtimeService } from './realtime.service';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => UserModule)
  ],
  providers: [
    SocketIoGateway,
    RealtimeService
  ],
  exports: [
    RealtimeService
  ]
})
export class RealtimeModule {}
