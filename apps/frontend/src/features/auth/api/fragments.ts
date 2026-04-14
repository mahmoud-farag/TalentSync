import { gql } from '@apollo/client';

/**
 * User fragment - common user fields used across queries
 */
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
  }
`;

/**
 * Auth payload fragment - response from login/signup mutations
 */
export const AUTH_PAYLOAD_FRAGMENT = gql`
  fragment AuthPayloadFields on AuthPayload {
    accessToken
    refreshToken
    expiresIn
    user {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;