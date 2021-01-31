import { NestMiddleware, Injectable } from '@nestjs/common';
import * as morgan from 'morgan';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use (req: any, res: any, next: () => void) {
    morgan('dev')(req, res, next);
  }
}