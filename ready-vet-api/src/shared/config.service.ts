import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor (filePath: string) {
    this.envConfig = {
      ...(dotenv.parse(fs.readFileSync(filePath)) || {}),
      NODE_ENV: process.env.NODE_ENV
    }
  }

  get (key: string): string {
    return this.envConfig[key];
  }
}