import { Controller, Get } from '@nestjs/common';
import { Page } from './lib.js';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  index() {
    return new Page({ name: 'Anthony' });
  }

  @Get('/about')
  about() {
    return new Page();
  }

  @Get('/api/users')
  api() {
    return {
      id: '123',
    };
  }
}
