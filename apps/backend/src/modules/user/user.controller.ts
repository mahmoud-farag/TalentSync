import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('user')
export class UserController {

  @Get()
  getHello(@Req() req: Request) {
    const db = req.db;
    return 'Hello World!';
  }
}
