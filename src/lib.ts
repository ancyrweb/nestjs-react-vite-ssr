import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawServerBase,
} from 'fastify';
import FastifyVite from '@fastify/vite';
import { uneval } from 'devalue';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type Configuration = {
  isProduction?: boolean;
};

export const configureFrontEnd = async (
  adapter: any,
  config?: Configuration,
) => {
  // silly workaround for https://github.com/microsoft/TypeScript/issues/42873
  adapter = adapter as FastifyAdapter;

  const isProduction =
    typeof config?.isProduction === 'boolean'
      ? config.isProduction
      : process.env.NODE_ENV === 'production';

  // We must register FastifyVite before NestJS because
  // FastifyVite loads Middie, the middleware engine of Fastify
  // But NestJS also loads Middie for its own internal middleware system
  // Which leads to a clash as both of them try to load Middie
  await adapter.register(FastifyVite as any, {
    root: process.cwd(),
    spa: false,
    dev:
      typeof config?.isProduction === 'boolean'
        ? !config.isProduction
        : !isProduction,
    clientModule: isProduction
      ? 'dist/server/entry-server.js'
      : 'entry-server.ts',
    renderer: {
      createRenderFunction({ renderApp }) {
        return async function ({
          page,
          req,
        }: {
          page: Page;
          req: FastifyRequest;
        }) {
          const props = {
            pageProps: page.props,
            appProps: {},
          };

          const { template, metadata } = await renderApp({
            url: req.originalUrl,
            props,
          });

          const pageState = {
            url: req.originalUrl,
            props,
          };

          return {
            element: template,
            title: metadata.title,
            hydration: `<script>window.__INITIAL_STATE__ = ${uneval(pageState)};</script>`,
          };
        };
      },
    },
  });
  // Hack to prevent the Fastify adapter from registering Middie
  // Don't remove this line or it will crash
  (adapter as any).isMiddieRegistered = true;

  return adapter;
};

export const initializeFrontEnd = async (
  app: NestFastifyApplication<RawServerBase>,
) => {
  const instance = app.getHttpAdapter().getInstance() as FastifyInstance;
  await instance.vite.ready();
};

export class Page {
  constructor(public readonly props: Record<string, any> = {}) {}
}

@Injectable()
export class FrontEndInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse() as FastifyReply;
    const req = context.switchToHttp().getRequest() as FastifyRequest;

    return next.handle().pipe(
      map(async (data: any) => {
        if (data instanceof Page) {
          const rendered = await (res as any).render({
            page: data,
            req,
            res,
          });

          return (res as any).type('text/html').html(rendered);
        }

        return data;
      }),
    );
  }
}
