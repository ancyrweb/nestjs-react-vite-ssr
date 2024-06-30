import type { ViteDevServer } from 'vite';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { filter, mergeMap, Observable } from 'rxjs';
import { Page } from './Page.js';
import { FastifyReply, FastifyRequest } from 'fastify';

let viteDevServer: ViteDevServer;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootFolder = path.join(__dirname, '..');
export const clientFolder = path.join(rootFolder, 'client');
export const pagesFolder = path.join(clientFolder, 'pages');

const resolveClientPath = (p: string) => path.join(clientFolder, p);

/**
 * get vite server
 * @param opts options
 * @param opts.force create vite server forcibly
 * @returns instance of vite server
 */
export const getViteServer = async ({ force } = { force: false }) => {
  if (!viteDevServer || force) {
    viteDevServer = await createServer({
      publicDir: clientFolder,
      server: {
        middlewareMode: true,
      },
    });
  }

  return viteDevServer;
};

@Injectable()
export class PageInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      filter((data) => data instanceof Page),
      mergeMap(async (data: Page) => {
        const http = context.switchToHttp();
        const req = http.getRequest() as FastifyRequest;
        const res = context.switchToHttp().getResponse() as FastifyReply;

        const Component = await import(
          path.join(pagesFolder, `${data.title}.js`)
        ).then((c) => c.default);

        const vite = await getViteServer();
        const html = await vite.transformIndexHtml(
          req.originalUrl,
          readFileSync(resolveClientPath('index.html'), {
            encoding: 'utf-8',
          }),
        );

        const render = (
          await vite.ssrLoadModule(resolveClientPath('entry-server.js'))
        ).render;

        const { template } = await render(data, Component);

        res.type('text/html');
        return html.replace('<!-- template-placeholder -->', template);
      }),
    );
  }
}
