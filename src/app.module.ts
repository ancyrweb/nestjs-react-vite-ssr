import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Module,
  NestInterceptor,
} from '@nestjs/common';
import { AppController } from './app.controller.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { Page } from './Page.js';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class PageInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse() as FastifyReply;
    const req = context.switchToHttp().getRequest() as FastifyRequest;

    return next.handle().pipe(
      map(async (data: any) => {
        if (data instanceof Page) {
          const rendered = await (res as any).render({
            page: data,
          });

          return (res as any).type('text/html').html(rendered);
        }

        return data;
      }),
    );
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PageInterceptor,
    },
  ],
})
export class AppModule {}
