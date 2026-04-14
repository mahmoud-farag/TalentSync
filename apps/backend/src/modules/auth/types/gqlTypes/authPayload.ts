import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/modules/user/types/gqlTypes';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field({ nullable: true })
  expiresIn?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
