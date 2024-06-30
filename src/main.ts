import { NestFactory } from '@nestjs/core';
import FastifyVite from '@fastify/vite';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { clientFolder } from './rendering.js';
import { AppModule } from './app.module.js';

async function bootstrapNestJs() {
  const adapter = new FastifyAdapter({ logger: true });
  await adapter.register(FastifyVite as any, {
    root: clientFolder,
    dev: true,
    spa: false,
    clientModule: 'entry-server.ts',
    createRenderFunction(config) {
      return async () => {
        const result = await config.render();
        return {
          element: result.template,
        };
      };
    },
  });
  (adapter as any).isMiddieRegistered = true;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const server = app.getHttpAdapter().getInstance() as any;
  await server.vite.ready();
  await app.listen(3000);
}

bootstrapNestJs();
