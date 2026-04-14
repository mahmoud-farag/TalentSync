export const env = {
  // GraphQL endpoint
  GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',

  // REST API base URL (for OAuth, webhooks)
  REST_URL: import.meta.env.VITE_REST_URL || 'http://localhost:3000/api',

  // OAuth redirect URI
  OAUTH_REDIRECT_URI: import.meta.env.VITE_OAUTH_REDIRECT_URI || 'http://localhost:5173/oauth/callback',

  // Frontend URL
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',

  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',

  // Feature flags
  ENABLE_GOOGLE_OAUTH: import.meta.env.VITE_ENABLE_GOOGLE_OAUTH === 'true',
  ENABLE_LINKEDIN_OAUTH: import.meta.env.VITE_ENABLE_LINKEDIN_OAUTH === 'true',
} as const;

export type Env = typeof env;