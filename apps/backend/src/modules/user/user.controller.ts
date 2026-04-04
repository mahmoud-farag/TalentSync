import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  @Get()
  getHello(@Req() req: Request) {
    return 'Hello World!';
  }
}
