import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { FrontEndModule } from './lib.js';

@Module({
  imports: [FrontEndModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
