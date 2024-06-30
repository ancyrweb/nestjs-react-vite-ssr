import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PageInterceptor } from './rendering.js';

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
