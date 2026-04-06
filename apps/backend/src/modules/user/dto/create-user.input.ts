import { IsEmail, IsEnum, IsString, IsStrongPassword, IsOptional, MinLength, MaxLength } from 'class-validator';
import { AccountType } from 'generated/workspace-client/enums';

/**
 * Internal DTO for creating a user.
 * Used by services, independent of GraphQL layer.
 */
export class CreateUserInput {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(40, { message: 'Name cannot exceed 40 characters' })
  name?: string;

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

  @IsEnum(AccountType, { message: 'Invalid account type' })
  accountType: AccountType;
}

/**
 * User response DTO.
 * Explicitly excludes password for security.
 */
export interface UserResponse {
  id: string;
  email: string;
  accountType: AccountType;
  name?: string;
}
