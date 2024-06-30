import { Controller, Get, Res } from '@nestjs/common';
import { Page } from './Page.js';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  index() {
    return new Page('Home');
  }

  @Get('/about')
  about() {
    return new Page('About');
  }

  @Get('/api/users')
  api() {
    return {
      id: '123',
    };
  }
}
