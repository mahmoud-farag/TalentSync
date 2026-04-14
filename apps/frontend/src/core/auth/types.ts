/**
 * User roles from backend
 */
export type UserRole = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'CANDIDATE';

/**
 * User object returned from API
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  // isActive: boolean;
  // createdAt: string;
  // updatedAt: string;
}

/**
 * Authentication tokens
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Signup request payload
 */
export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

/**
 * Signup response from API
 */
export interface SignupResponse {
  user: User;
  tokens: TokenPair;
}

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'linkedin';

/**
 * OAuth callback response
 */
export interface OAuthCallbackResponse {
  user: User;
  tokens: TokenPair;
  isNewUser: boolean;
}

/**
 * Auth state shape
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
}
