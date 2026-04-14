import React from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { apolloClient } from '../../core/api';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>
  );
};
