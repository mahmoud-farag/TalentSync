import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import type { PrismaClient } from 'generated/workspace-client/client';
import { SignUpInput } from './inputs';
import { User } from '../user/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

  async signUp({ signUpInput, db }: { signUpInput: SignUpInput; db: PrismaClient }) {
    const userObj: User = {
      id: '1',
      email: signUpInput.email,
      name: signUpInput.name,
      password: signUpInput.password,
      // accountType: AccountType.CANDIDATE,
      // status: UserStatus.ACTIVE,
    };
    this.logger.log('Creating user record.');
    const CreatedUser = await this.userService.createUser({ user: userObj, db });
    return CreatedUser;
  }
}
