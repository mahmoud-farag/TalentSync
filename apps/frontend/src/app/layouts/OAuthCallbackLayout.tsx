import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface OAuthCallbackLayoutProps {
  provider?: string;
  children: React.ReactNode
}

/**
 * OAuthCallbackLayout - Loading layout for OAuth redirects
 * Shows a centered loading state during OAuth callback processing
 */
export const OAuthCallbackLayout: React.FC<OAuthCallbackLayoutProps> = ({
  provider = 'OAuth',
  children,
}) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-blue-600" />
          <span className="text-xl font-semibold text-gray-900">
            TalentSync
          </span>
        </div>
        <ArrowPathIcon
          className="h-8 w-8 animate-spin text-blue-600"
          aria-hidden
        />
        <p className="text-sm text-gray-600">
          Completing {provider} sign in...
          {children}
        </p>
      </div>
    </div>
  );
};
