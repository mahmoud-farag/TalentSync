import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { PrismaClient } from 'generated/workspace-client/client';
import { Db, hostName } from 'src/decorators';
import { SignInInput, SignUpInput } from './gqlInputs';
import type { CreateUserDto, UserResponse } from '../user/dto';
import { SignInDto } from './dtos/signIn.dto';
import { AuthPayload } from './types/gqlTypes/authPayload';
import { User } from '../user/types/gqlTypes';

@Resolver(() => User)
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('loginInput') loginInput: SignInInput, @Db() db: PrismaClient, @hostName() hostName: string): Promise<AuthPayload> {
    this.logger.log(`signIn requested for host "${hostName}".`);

    const loginPayload: SignInDto = {
      email: loginInput.email,
      password: loginInput.password,
    };

    const user = await this.authService.signIn({ db, loginPayload });
    return {
      accessToken: '',
      refreshToken: '',
      user,
    };
  }

  @Mutation(() => AuthPayload)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput, @Db() db: PrismaClient, @hostName() hostName: string): Promise<AuthPayload> {
    this.logger.log(`signUp requested for host "${hostName}".`);

    // Map GraphQL input too service DTO
    const createInput: CreateUserDto = {
      email: signUpInput.email,
      // name: signUpInput.name,
      password: signUpInput.password,
      accountType: signUpInput.accountType,
    };

    const user = await this.authService.signUp(db, createInput);

    // Map service response to GraphQL type
    return {
      accessToken: '',
      refreshToken: '',
      user,
    };
  }
}
