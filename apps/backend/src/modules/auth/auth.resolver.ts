import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/types';
import type { PrismaClient } from 'generated/workspace-client/client';
import { Db, hostName } from 'src/decorators';
import { SignInInput, SignUpInput } from './inputs';
import type { CreateUserInput } from '../user/dto';

@Resolver(() => User)
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  signIn(@Args('signInInput') signInInput: SignInInput, @Db() db: PrismaClient, @hostName() hostName: string) {
    this.logger.log(`signIn requested for host "${hostName}".`);
    void signInInput;
    void db;
    return {};
  }

  @Mutation(() => User)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput, @Db() db: PrismaClient, @hostName() hostName: string) {
    this.logger.log(`signUp requested for host "${hostName}".`);

    // Map GraphQL input to service DTO
    const createInput: CreateUserInput = {
      email: signUpInput.email,
      // name: signUpInput.name,
      password: signUpInput.password,
      accountType: signUpInput.accountType,
    };

    const user = await this.authService.signUp(db, createInput);

    // Map service response to GraphQL type
    return {
      ...user,
    };
  }
}
