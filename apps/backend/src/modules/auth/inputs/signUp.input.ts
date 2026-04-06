import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { AccountType } from 'generated/workspace-client/enums';

registerEnumType(AccountType, {
  name: 'AccountType',
});

@InputType()
export default class SignUpInput {
  // @Field()
  // name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => AccountType)
  @IsEnum(AccountType)
  accountType: AccountType;
}
