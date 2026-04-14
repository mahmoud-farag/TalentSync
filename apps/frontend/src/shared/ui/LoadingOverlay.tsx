import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" aria-hidden />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};
