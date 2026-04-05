import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/types';
import type { PrismaClient } from 'generated/workspace-client/client';
import { Db, hostName } from 'src/decorators';
import { SignInInput, SignUpInput } from './inputs';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  signIn(@Args('signInInput') signInInput: SignInInput, @Db() db: PrismaClient, @hostName() hostName: string) {
    console.log(signInInput);
    console.log(db);
    return {};
  }

  @Mutation(() => User)
  signUp(@Args('signUpInput') signUpInput: SignUpInput, @Db() db: PrismaClient, @hostName() hostName: string) {
    console.log(signUpInput);
    console.log(db);

    console.log('--hostname from resolver:', hostName);

    const result = this.authService.signUp({ signUpInput, db });
    return result;
  }
}
