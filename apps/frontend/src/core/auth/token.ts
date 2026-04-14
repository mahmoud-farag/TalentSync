const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Token storage utilities
 * Uses localStorage for persistence across sessions
 */

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user has valid tokens
 */
export const hasValidTokens = (): boolean => {
  return !!getAccessToken() && !!getRefreshToken();
};

/**
 * Store user data locally for quick access
 */
export const setStoredUser = (user: unknown): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
 
export const getStoredUser = <T>(): T | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Clear all auth-related storage
 */
export const clearAuthStorage = (): void => {
  clearTokens();
};