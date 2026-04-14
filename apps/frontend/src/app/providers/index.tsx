import React from 'react';
import { ReduxProvider } from './ReduxProvider';
import { ApolloProvider } from './ApolloProvider';
import { BootstrapProvider } from './BootstrapProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Composed providers for the entire application
 * Order matters: Redux -> Apollo -> Bootstrap
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <ReduxProvider>
      <ApolloProvider>
        <BootstrapProvider>{children}</BootstrapProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
};

export { ReduxProvider } from './ReduxProvider';
export { ApolloProvider } from './ApolloProvider';
export { BootstrapProvider } from './BootstrapProvider';
