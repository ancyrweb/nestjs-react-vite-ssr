import { NestFactory } from '@nestjs/core';
import FastifyVite from '@fastify/vite';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { clientFolder } from './rendering.js';
import { AppModule } from './app.module.js';
import { FastifyInstance, RawServerBase } from 'fastify';
import { renderApp } from '../client/entry-server.js';
import { Page } from './Page.js';
import { join } from 'path';

import { uneval } from 'devalue';

async function bootstrapNestJs() {
  let app: NestFastifyApplication<RawServerBase>;

  const adapter = new FastifyAdapter();
  await adapter.register(FastifyVite as any, {
    root: clientFolder,
    dev: true,
    spa: false,
    clientModule: 'entry-server.ts',
    createRenderFunction({ renderApp }) {
      return async function ({ page }: { page: Page }) {
        const pagePath = join(
          clientFolder,
          'pages',
          page.componentName + '.js',
        );

        const Component = await import(pagePath);

        const result = await renderApp({
          Component: Component.default,
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

  const server = app.getHttpAdapter().getInstance() as FastifyInstance;
  await server.vite.ready();

  server.decorateReply('page', null);

  await app.listen(3000);
}

bootstrapNestJs();
