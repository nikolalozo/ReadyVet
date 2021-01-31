import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from './encryption.service';
import { ConfigService } from './config.service';
import { HashService } from './hash.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`.env.${process.env.NODE_ENV}`)
    },
    EncryptionService,
    HashService
  ],
  exports: [
    ConfigService,
    EncryptionService,
    HashService
  ]
})
export class SharedModule {}
