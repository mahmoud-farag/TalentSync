import { InMemoryCache, makeVar } from '@apollo/client';

/**
 * Reactive variables for global state
 */
export const authModalOpenVar = makeVar<boolean>(false);

/**
 * Apollo cache configuration with type policies
 */
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // User query always returns the same object, normalize by ID
        me: {
          read(existing) {
            return existing;
          },
        },
      },
    },
    User: {
      // Use _id as the key field
      keyFields: ['id'],
    },
    Tenant: {
      keyFields: ['slug'],
    },
    Job: {
      keyFields: ['id'],
    },
    Candidate: {
      keyFields: ['id'],
    },
    Application: {
      keyFields: ['id'],
    },
  },
});