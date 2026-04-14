// Core module exports

// Config
export { env, type Env } from './config';

// API
export {
  apolloClient,
  resetApolloStore,
  cache,
  restClient,
  getOAuthUrl,
  exchangeOAuthCode,
  authLink,
  errorLink,
} from './api';
export type {
  GraphQLResponse,
  GraphQLError,
  ApiResponse,
  PaginatedResponse,
  PaginationArgs,
  SortDirection,
  SortInput,
  ApiError,
} from './api';

// Auth
export type {
  User,
  UserRole,
  TokenPair,
  LoginRequest,
  SignupRequest,
  LoginResponse,
  SignupResponse,
  OAuthProvider,
  OAuthCallbackResponse,
  AuthState,
} from './auth';
export {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  hasValidTokens,
  setStoredUser,
  getStoredUser,
  clearAuthStorage,
} from './auth';

// Permissions
export type { Permission, PermissionCheckResult, RolePermissions } from './permissions';
export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  isAdmin,
  createPermissionGuard,
  createRoleGuard,
} from './permissions';

// Lib
export { cn, debounce, throttle, formatDate, formatDateTime, generateId, sleep } from './lib';
