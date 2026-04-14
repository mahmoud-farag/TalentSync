import { onError } from '@apollo/client/link/error';
import { clearTokens } from '../../auth/token';

/**
 * Apollo error link for global error handling.
 * Handles authentication errors (401) and logs other errors.
 */
export const errorLink = onError(( { graphQLErrors, networkError }) => {
  const navigateToLoginWithoutReload = () => {
    const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
    const isOAuthCallback = window.location.pathname.startsWith('/oauth/callback');

    if (isAuthPage || isOAuthCallback) {
      return;
    }

    window.history.replaceState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      // Handle authentication errors
      if (error.extensions?.code === 'UNAUTHENTICATED' || error.message.includes('not authenticated')) {
        clearTokens();
        navigateToLoginWithoutReload();
        return;
      }

      
      console.error(`[GraphQL Error]: ${error.message}`);
    }
  }

  if (networkError) {
    // Handle network errors (e.g., server unreachable)
    console.error(`[Network Error]:`, networkError);

    // Check for 401 status
    if ('statusCode' in networkError && (networkError as any).statusCode === 401) {
      clearTokens();
      navigateToLoginWithoutReload();
    }
  }
});
