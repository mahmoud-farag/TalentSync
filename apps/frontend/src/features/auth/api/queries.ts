import { gql } from '@apollo/client';
import { USER_FRAGMENT } from './fragments';

/**
 * Get current authenticated user
 */
export const ME_QUERY = gql`
  query Me {
    me {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

/**
 * Check if email is available for registration
 */
export const CHECK_EMAIL_QUERY = gql`
  query CheckEmail($email: String!) {
    checkEmail(email: $email) {
      available
      message
    }
  }
`;