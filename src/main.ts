import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { RawServerBase } from 'fastify';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { configureFrontEnd, initializeFrontEnd } from './lib.js';

async function bootstrap() {
  let app: NestFastifyApplication<RawServerBase>;

  app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    await configureFrontEnd(new FastifyAdapter()),
  );

  await app.init();
  await initializeFrontEnd(app);
  await app.listen(3000);

  console.log(`Server listening on http://localhost:3000`);

  return app;
}

bootstrap();
