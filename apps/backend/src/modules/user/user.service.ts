import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from 'generated/workspace-client/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor() {}

  async createUser({ user, db }: { user: unknown; db: PrismaClient }) {
    // const result = await db.user.create({ data: user });\
    this.logger.debug('createUser invoked.');
    void db;

    return Promise.resolve({ name: 'test', email: 'test', id: 'test' });
  }
}
