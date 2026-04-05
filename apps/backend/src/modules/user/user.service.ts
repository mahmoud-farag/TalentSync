import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/workspace-client/client';

@Injectable()
export class UserService {
  constructor() {}

  async createUser({ user, db }: { user: unknown; db: PrismaClient }) {
    // const result = await db.user.create({ data: user });\

    return Promise.resolve({ name: 'test', email: 'test', id: 'test' });
  }
}
