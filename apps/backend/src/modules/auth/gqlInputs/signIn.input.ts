import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export default class LoginInput {
  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
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
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
