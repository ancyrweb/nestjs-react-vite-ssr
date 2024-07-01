import FastifyVite from '@fastify/vite';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance, FastifyRequest, RawServerBase } from 'fastify';
import { uneval } from 'devalue';
import { NestFactory } from '@nestjs/core';

import { Page } from './Page.js';
import { AppModule } from './app.module.js';

const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
  let app: NestFastifyApplication<RawServerBase>;

  // We must register FastifyVite before NestJS because
  // FastifyVite loads Middie, the middleware engine of Fastify
  // But NestJS also loads Middie for its own internal middleware system
  // Which leads to a clash as both of them try to load Middie
  const adapter = new FastifyAdapter();
  await adapter.register(FastifyVite as any, {
    root: process.cwd(),
    spa: false,
    dev: !isProduction,
    clientModule: isProduction
      ? 'dist/server/entry-server.js'
      : 'entry-server.ts',
    createRenderFunction({ renderApp }) {
      return async function ({
        page,
        req,
      }: {
        page: Page;
        req: FastifyRequest;
      }) {
        const { template, metadata } = await renderApp({
          url: req.originalUrl,
          props: page.props,
        });

        return {
          element: template,
          title: metadata.title,
          hydration: `<script>window.__INITIAL_STATE__ = ${uneval({
            url: req.originalUrl,
            props: page.props,
          })};</script>`,
        };
      };
    },
  });
  // Hack to prevent the Fastify adapter from registering Middie
  // Don't remove this line or it will crash
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
