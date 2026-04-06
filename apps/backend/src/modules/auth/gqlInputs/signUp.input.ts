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
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  // @IsStrongPassword(
  //   {
  //     minLength: 8,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 0,
  //   },
  //   {
  //     message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
  //   },
  // )
  password: string;

  @Field(() => AccountType)
  @IsEnum(AccountType, { message: 'Invalid account type' })
  accountType: AccountType;
}
