import FastifyVite from '@fastify/vite';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance, FastifyRequest, RawServerBase } from 'fastify';
import { join, dirname } from 'path';
import { uneval } from 'devalue';
import { NestFactory } from '@nestjs/core';

import { Page } from './Page.js';
import { AppModule } from './app.module.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const rootFolder = join(__dirname, '..');
export const clientFolder = join(rootFolder, 'client');

const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
  let app: NestFastifyApplication<RawServerBase>;

  const adapter = new FastifyAdapter();
  await adapter.register(FastifyVite as any, {
    root: process.cwd(),
    spa: false,
    dev: !isProduction,
    clientModule: 'entry-server.ts',
    createRenderFunction({ renderApp }) {
      return async function ({
        page,
        req,
      }: {
        page: Page;
        req: FastifyRequest;
      }) {
        const result = await renderApp({
          url: req.originalUrl,
          props: page.props,
        });

        return {
          element: result.template, // `element` is the comment inside `index.html`
          title: page.componentName,
          hydration: `<script>window.__INITIAL_STATE__ = ${uneval({
            componentName: page.componentName,
            props: page.props,
          })};</script>`,
        };
      };
    },
  });
  (adapter as any).isMiddieRegistered = true;

  app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

  const instance = app.getHttpAdapter().getInstance() as FastifyInstance;

  await app.init();
  await instance.vite.ready();
  await app.listen(3000);

  console.log(`Server listening on http://localhost:3000`);

  return app;
}

bootstrap();
