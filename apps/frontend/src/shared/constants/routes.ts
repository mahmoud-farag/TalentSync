/**
 * Application route paths
 */
export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  OAUTH_CALLBACK: '/oauth/callback/:provider',

  // Main routes
  HOME: '/',
  DASHBOARD: '/dashboard',

  // User routes
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  USER_PROFILE: '/profile',

  // Jobs routes
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',
  CREATE_JOB: '/jobs/create',

  // Candidates routes
  CANDIDATES: '/candidates',
  CANDIDATE_DETAIL: '/candidates/:id',

  // Settings routes
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_WORKSPACE: '/settings/workspace',

  // Error routes
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
} as const;

/**
 * Route param extraction helper
 */
export const getRoute = ( route: keyof typeof ROUTES,  params?: Record<string, string> ): string => {

  const path = ROUTES[route];
  let newPath;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      newPath = path.replace(`:${key}`, value);
    });
  }
  return newPath || path;
};
