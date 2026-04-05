import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
