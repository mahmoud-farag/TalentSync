import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import type { PrismaClient } from 'generated/workspace-client/client';
import type { CreateUserInput, UserResponse } from '../user/dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

  async signUp(db: PrismaClient, input: CreateUserInput): Promise<UserResponse> {
    this.logger.log('signUp started::Creating user record.');
    return this.userService.createUser(db, input);
  }
}
