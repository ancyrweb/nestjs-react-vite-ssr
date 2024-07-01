import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FrontEndInterceptor } from './lib.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FrontEndInterceptor,
    },
  ],
})
export class AppModule {}
