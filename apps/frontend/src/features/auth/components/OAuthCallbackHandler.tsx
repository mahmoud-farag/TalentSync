import React, { useEffect } from 'react';
import { LoadingScreen } from '../../../shared/components';

interface OAuthCallbackHandlerProps {
  provider?: string;
  onCallback: () => Promise<{success: boolean; error?: string}>;
}

export const OAuthCallbackHandler: React.FC<OAuthCallbackHandlerProps> = ({
  provider,
  onCallback,
}) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks
  useEffect(() => {
    onCallback();
  }, [onCallback]);

  //* Handlers

  //* JSX
  return <LoadingScreen message={`Completing ${provider || 'OAuth'} sign in...`} />;
};
