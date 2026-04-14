import { AccountType } from 'generated/workspace-client/enums';
/**
 * Internal DTO for creating a user.
 * Used by services, independent of GraphQL layer.
 */
export class CreateUserDto {
  email: string;

  password: string;

  accountType: AccountType;
}

/**
 * User response DTO.
 * Explicitly excludes password for security.
 */
export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  accountType: AccountType;
}
