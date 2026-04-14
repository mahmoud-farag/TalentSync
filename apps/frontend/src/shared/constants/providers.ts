/**
 * OAuth provider configuration
 */

export type OAuthProviderId = 'google' | 'linkedin';

export interface OAuthProviderConfig {
  id: OAuthProviderId;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'google',
    color: '#DB4437',
    enabled: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0A66C2',
    enabled: true,
  },
];

export const getOAuthProvider = (id: OAuthProviderId): OAuthProviderConfig | undefined => {
  return OAUTH_PROVIDERS.find((provider) => provider.id === id);
};