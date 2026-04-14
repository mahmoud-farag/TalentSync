import { ApolloClient, from, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { env } from '../config';
import { authLink, errorLink } from './links';
import { cache } from './cache';

/**
 * HTTP link for queries and mutations
 */
const httpLink = new HttpLink({
  uri: env.GRAPHQL_URL,
  credentials: 'include',
});

/**
 * WebSocket link for subscriptions (only in development/production with WS support)
 */
const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: env.GRAPHQL_URL.replace('http', 'ws').replace('https', 'wss'),
        connectionParams: () => {
          const token = localStorage.getItem('accessToken');
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      })
    )
  : null;

/**
 * Split link: use WebSocket for subscriptions, HTTP for everything else
 */
const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink,
    )
  : httpLink;

/**
 * Apollo Client instance
 * Composes all links: auth → error → split (ws/http)
 */
export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, splitLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

/**
 * Reset the Apollo store (clears cache and refetches active queries)
 * Called on logout
 */
export const resetApolloStore = async () => {
  await apolloClient.clearStore();
};
