import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from 'generated/workspace-client/client';
import type { CreateUserDto, UserResponse } from './dto';
import { hashPassword } from 'src/common/libs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async createUser(db: PrismaClient, input: CreateUserDto): Promise<UserResponse> {
    this.logger.debug('createUser invoked.');

    const passwordHash = await hashPassword(input.password);

    const query = {
      where: { email: input.email },
    };

    const existingUser = await db.user.findUnique(query);

    if (existingUser) {
      this.logger.warn(`Attempt to create user with existing email: ${input.email}`);
      throw new Error('Email already in use');
    }

    const createdUser = await db.user.create({
      data: {
        email: input.email,
        passwordHash,
        accountType: input.accountType, // Add this line
      },
      select: {
        id: true,
        email: true,
        accountType: true,
        // Password excluded from response
      },
    });

    return createdUser;
  }
}
