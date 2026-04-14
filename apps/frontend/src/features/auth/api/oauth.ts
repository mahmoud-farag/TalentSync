import { restClient, exchangeOAuthCode } from '../../../core/api';
import { env } from '../../../core/config';
import type { OAuthProvider } from '../../../core/auth/types';
import type { User } from '../../../core/auth/types';

/**
 * OAuth configuration
 */
export const getOAuthRedirectUrl = (provider: OAuthProvider): string => {
  const redirectUri = encodeURIComponent(env.OAUTH_REDIRECT_URI);
  // These would typically come from environment config
  const clientId = provider === 'google'
    ? import.meta.env.VITE_GOOGLE_CLIENT_ID
    : import.meta.env.VITE_LINKEDIN_CLIENT_ID;

  switch (provider) {
    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
    case 'linkedin':
      return `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=r_emailaddress%20r_liteprofile`;
    default:
      throw new Error(`Unknown OAuth provider: ${provider}`);
  }
};

/**
 * Initiate OAuth flow - redirects to provider
 */
export const initiateOAuth = (provider: OAuthProvider): void => {
  window.location.href = getOAuthRedirectUrl(provider);
};

/**
 * Handle OAuth callback - exchange code for tokens
 */
export const handleOAuthCallback = async (
  provider: OAuthProvider,
  code: string,
  state?: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const response = await restClient.post(`/oauth/${provider}/callback`, {
    code,
    state,
    redirectUri: env.OAUTH_REDIRECT_URI,
  });

  return response.data;
};