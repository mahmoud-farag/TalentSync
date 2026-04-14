import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { LoadingScreen } from '../../../shared';


/**
 * ProtectedRoute - Guards routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute: React.FC = () => {
  //* States

  //* Custom hooks
  const { isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  if (isInitializing) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
