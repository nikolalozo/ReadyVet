import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '../shared/config.service';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor (
    private readonly config: ConfigService
  ) {}

  createMongooseOptions(): MongooseModuleOptions {

    const options: MongooseModuleOptions = {
      uri: this.config.get('DB_URI'),
      dbName: this.config.get('DB_NAME'),
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    };

    return options;
  }
}