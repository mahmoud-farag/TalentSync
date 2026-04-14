import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import type {
  QueryResult,
  MutationTuple,
  LazyQueryHookOptions,
  QueryHookOptions,
  MutationHookOptions,
} from '@apollo/client';
import type { OperationVariables } from '@apollo/client';
import type { DocumentNode } from 'graphql';

/**
 * Typed hook wrapper for Apollo useQuery
 * Provides better TypeScript inference for query results
 */
export function useGraphQLQuery<TData, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  return useQuery<TData, TVariables>(query, options);
}

/**
 * Typed hook wrapper for Apollo useLazyQuery
 * Useful for queries triggered by user actions
 */
export function useGraphQLLazyQuery<TData, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options?: LazyQueryHookOptions<TData, TVariables>
) {
  return useLazyQuery<TData, TVariables>(query, options);
}

/**
 * Typed hook wrapper for Apollo useMutation
 * Provides better TypeScript inference for mutation results
 */
export function useGraphQLMutation<TData, TVariables extends OperationVariables = OperationVariables>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
): MutationTuple<TData, TVariables> {
  return useMutation<TData, TVariables>(mutation, options);
}

/**
 * Re-export Apollo hooks for convenience
 */
export { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/client';
