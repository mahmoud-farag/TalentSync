import { gql } from '@apollo/client';
import { AUTH_PAYLOAD_FRAGMENT } from './fragments';

/**
 * Login mutation
 */
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(loginInput: $input) {
      ...AuthPayloadFields
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

/**
 * Signup mutation
 */
export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignUpInput!) {
    signUp(signUpInput: $input) {
      ...AuthPayloadFields
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

/**
 * Logout mutation
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

/**
 * Refresh token mutation
 */
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`;