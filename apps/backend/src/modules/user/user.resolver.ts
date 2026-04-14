import { PrismaClient } from 'generated/workspace-client/client';
import { Db } from 'src/decorators';
import { UserService } from './user.service';
import { Query, Resolver } from '@nestjs/graphql';
import { User } from './types/gqlTypes';

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User)
  getMe(@Db() db: PrismaClient) {
    return {};
  }
}
