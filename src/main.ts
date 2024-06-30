import { NestFactory } from '@nestjs/core';
import FastifyVite from '@fastify/vite';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance, RawServerBase } from 'fastify';
import { join, dirname } from 'path';
import { uneval } from 'devalue';
import { Page } from './Page.js';
import { AppModule } from './app.module.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const rootFolder = join(__dirname, '..');
export const clientFolder = join(rootFolder, 'client');

const isProduction = process.env.NODE_ENV === 'production';

async function bootstrapNestJs() {
  let app: NestFastifyApplication<RawServerBase>;

  const adapter = new FastifyAdapter();
  await adapter.register(FastifyVite as any, {
    root: clientFolder,
    spa: false,
    dev: !isProduction,
    clientModule: isProduction ? `../server/entry-server` : 'entry-server.ts',
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

  await app.listen(3000);
}

bootstrapNestJs();
