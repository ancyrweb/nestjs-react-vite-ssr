import { Controller, Get } from '@nestjs/common';
import { Page } from './Page.js';

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
}
