import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "../../../shared";
import { useAppSelector } from "../../store";

/**
 * PublicRoute - Guards routes that should only be accessible when not authenticated
 * Redirects to dashboard if user is already authenticated
 */
export const PublicRoute: React.FC = () => {
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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
