import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
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
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-blue-600" />
          <span className="text-xl font-semibold text-gray-900">TalentSync</span>
        </div>
        <ArrowPathIcon
          className="h-8 w-8 animate-spin text-blue-600"
          aria-hidden
        />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};
 
export interface PageSkeletonProps {
  variant?: 'dashboard' | 'list' | 'detail' | 'form';
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ variant = 'dashboard' }) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className="animate-pulse space-y-4 p-6">
      {variant === 'dashboard' && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-200" />
            ))}
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-64 rounded-lg bg-gray-200" />
            <div className="h-64 rounded-lg bg-gray-200" />
          </div>
        </>
      )}

      {variant === 'list' && (
        <>
          {/* Filter bar */}
          <div className="h-12 rounded-lg bg-gray-200" />
          {/* List items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200" />
          ))}
        </>
      )}

      {variant === 'detail' && (
        <>
          {/* Header */}
          <div className="h-32 rounded-lg bg-gray-200" />
          {/* Content */}
          <div className="space-y-4">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </>
      )}

      {variant === 'form' && (
        <>
          {/* Form fields */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
            </div>
          ))}
          {/* Submit button */}
          <div className="h-10 w-32 rounded bg-gray-200" />
        </>
      )}
    </div>
  );
};
