import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SignUpInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
