import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
  app.enableCors();
  await app.listen(PORT);
}

bootstrap()
  .then(() => {
    console.log(`--- 🎮  Server ready at port ${PORT} 🎮 ---`);
  })
  .catch(err => {
    console.log(err);
  })

// async function createFsDirIfNotExists() {
//   const dest = path.resolve(__dirname, '..', 'fs', 'tmp');
// }
