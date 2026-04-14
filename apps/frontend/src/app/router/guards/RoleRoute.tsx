import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { LoadingScreen } from '../../../shared';




/**
 * Role-based route guard
 * Can be used to restrict routes based on user roles
 */
interface RoleRouteProps {
  allowedRoles: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  //* States

  //* Custom hooks
  const { user, isInitializing } = useAppSelector((state) => state.auth);

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  if (isInitializing) {
    return <LoadingScreen message="Checking permissions..." />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
