import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { PrismaClient } from 'generated/workspace-client/client';
import { SignUpInput } from './inputs';
import { User } from '../user/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async signUp({ signUpInput, db }: { signUpInput: SignUpInput; db: PrismaClient }) {
    const hostName = this.request.hostname;
    console.log('---hostName:', hostName);
    console.log('---signUpInput:', signUpInput);
    const userObj: User = {
      id: '1',
      email: signUpInput.email,
      name: signUpInput.name,
      password: signUpInput.password,
      // accountType: AccountType.CANDIDATE,
      // status: UserStatus.ACTIVE,
    };
    const CreatedUser = await this.userService.createUser({ user: userObj, db });
    return CreatedUser;
  }
}
