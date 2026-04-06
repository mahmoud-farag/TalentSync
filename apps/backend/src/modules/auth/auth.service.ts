import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import type { PrismaClient } from 'generated/workspace-client/client';
import type { CreateUserDto, UserResponse } from '../user/dto';
import { SignInDto } from './dtos/signIn.dto';
import { comparePassword } from 'src/common/libs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

  async signUp(db: PrismaClient, input: CreateUserDto): Promise<UserResponse> {
    this.logger.log('signUp started::Creating user record.');
    return this.userService.createUser(db, input);
  }

  async signIn({ db, loginPayload }: { db: PrismaClient; loginPayload: SignInDto }): Promise<UserResponse> {
    this.logger.log(`signIn started for email: ${loginPayload.email}`);

    const { email, password } = loginPayload;

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      this.logger.warn(`signIn failed: No user found with email ${email}`);
      throw new NotFoundException('Invalid credentials');
    }

    if (!user?.passwordHash) {
      this.logger.error(`signIn failed: User with email ${email} has no password hash.`);
      throw new NotFoundException('Invalid credentials');
    }

    const isPasswordMatch = await comparePassword(password, user.passwordHash);

    if (!isPasswordMatch) {
      this.logger.warn(`signIn failed: Incorrect password for email ${email}`);
      throw new NotFoundException('Invalid credentials');
    }

    this.logger.log(`signIn successful for email: ${email}`);

    // Return user data without password hash
    return user;
  }
}
