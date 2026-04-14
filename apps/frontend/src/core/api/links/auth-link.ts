import { ApolloLink, Observable } from '@apollo/client';
import { getAccessToken, getRefreshToken } from '../../auth/token';

/**
 * Apollo Link that injects authentication headers to GraphQL requests.
 * Adds Authorization header with Bearer token if available.
 */
export const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const accessToken = getAccessToken();

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    }));

    forward(operation).subscribe({
      next: observer.next.bind(observer),
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });
  });
});