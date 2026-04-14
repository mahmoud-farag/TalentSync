import React from 'react';
import { OAuthCallbackHandler } from '../components';
import { useOAuthCallback } from '../store/hooks';

const OAuthCallbackPage: React.FC = () => {
  //* States

  //* Custom hooks
  const { provider, isLoading, processOAuthCallback } = useOAuthCallback();

  //* Refs

  //* Helper functions
  void isLoading;

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <OAuthCallbackHandler
      provider={provider}
      onCallback={processOAuthCallback}
    />
  );
};

export default OAuthCallbackPage;
