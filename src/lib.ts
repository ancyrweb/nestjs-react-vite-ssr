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
  Module,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { APP_INTERCEPTOR } from '@nestjs/core';

declare module 'fastify' {
  interface FastifyReply {
    appProps: Record<string, any>;
  }
}

type Configuration = {
  isProduction?: boolean;
  clientModule?: string;
};

/**
 * Configure fastify to serve the front-end
 * @param adapter
 * @param config
 */
export const configureFrontEnd = async (
  adapter: any,
  config?: Configuration,
) => {
  // silly workaround for https://github.com/microsoft/TypeScript/issues/42873
  const ourAdapter = adapter as FastifyAdapter;

  const isProduction =
    typeof config?.isProduction === 'boolean'
      ? config.isProduction
      : process.env.NODE_ENV === 'production';

  // We must register FastifyVite before NestJS because
  // FastifyVite loads Middie, the middleware engine of Fastify
  // But NestJS also loads Middie for its own internal middleware system
  // Which leads to a clash as both of them try to load Middie
  await ourAdapter.register(FastifyVite as any, {
    root: process.cwd(),
    spa: false,
    dev: !isProduction,
    clientModule:
      config?.clientModule ??
      (isProduction ? 'dist/server/entry-server.js' : 'entry-server.ts'),
    renderer: {
      createRenderFunction({ render }) {
        return async function ({
          page,
          req,
          res,
        }: {
          page: Page;
          req: FastifyRequest;
          res: FastifyReply;
        }) {
          // prepare the page props
          const props = {
            pageProps: page.props,
            appProps: res.appProps,
          };

          // render the page using the URL for determining the component
          // to render (using a folder-based structure)
          const { template, metadata } = await render({
            url: req.originalUrl,
            props,
          });

          // serialize state to re-hydrate the page in client side
          const hydrationState = {
            url: req.originalUrl,
            props,
          };

          return {
            element: template,
            title: metadata.title,
            hydration: `<script>window.__INITIAL_STATE__ = ${uneval(hydrationState)};</script>`,
          };
        };
      },
    },
  });

  // Hack to prevent the Fastify adapter from registering Middie
  // Don't remove this line or it will crash
  // A better fix is introduced in 10.3.10 (the skipMiddie flag)
  (adapter as any).isMiddieRegistered = true;

  return adapter;
};

/**
 * Initialize the front-end
 * @param app
 */
export const initializeFrontEnd = async (
  app: NestFastifyApplication<RawServerBase>,
) => {
  const instance = app.getHttpAdapter().getInstance() as FastifyInstance;

  instance.addHook('onRequest', (req, res, done) => {
    res.appProps = {};
    done();
  });

  await instance.vite.ready();
};

/**
 * Informs the interceptor to render a page as a response
 */
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

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FrontEndInterceptor,
    },
  ],
})
export class FrontEndModule {}
