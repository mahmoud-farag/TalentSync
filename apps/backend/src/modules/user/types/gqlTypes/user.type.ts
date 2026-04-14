import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { AccountType } from 'generated/workspace-client/enums';

registerEnumType(AccountType, {
  name: 'AccountType',
});

@ObjectType()
export default class User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;
 
  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => AccountType)
  @IsEnum(AccountType, { message: 'Invalid account type' })
  accountType: AccountType;
}
